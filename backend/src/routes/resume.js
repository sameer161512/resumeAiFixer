const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

const upload = multer({
  dest: "tmp/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in backend/.env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function cleanText(text = "") {
  return text.replace(/\u0000/g, "").trim();
}

function getMimeType(ext) {
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  return "application/octet-stream";
}

function extractJsonString(rawText = "") {
  if (!rawText || typeof rawText !== "string") return "";

  let text = rawText.trim();

  text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "");
  text = text.replace(/\s*```$/i, "").trim();

  if (
    (text.startsWith("{") && text.endsWith("}")) ||
    (text.startsWith("[") && text.endsWith("]"))
  ) {
    return text;
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1).trim();
  }

  const firstBracket = text.indexOf("[");
  const lastBracket = text.lastIndexOf("]");

  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    return text.slice(firstBracket, lastBracket + 1).trim();
  }

  return text;
}

function safeJsonParse(rawText = "") {
  const cleaned = extractJsonString(rawText);
  return JSON.parse(cleaned);
}

function isRetryableGeminiError(err) {
  const message = err?.message || "";
  return (
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("Service Unavailable")
  );
}

async function generateWithRetry(payload, label = "Gemini request", maxRetries = 3) {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      return await ai.models.generateContent(payload);
    } catch (err) {
      attempts++;

      if (!isRetryableGeminiError(err) || attempts >= maxRetries) {
        throw err;
      }

      console.log(`${label} failed. Retrying... attempt ${attempts}`);
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
    }
  }
}

async function extractResumeText(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  if (ext === ".pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return cleanText(data.text || "");
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return cleanText(result.value || "");
  }

  return null;
}

router.post("/analyze", upload.single("resume"), async (req, res) => {
  const tempPath = req.file?.path;
  const originalName = req.file?.originalname || "";

  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "No resume file uploaded.",
      });
    }

    const ext = path.extname(originalName).toLowerCase();

    // ✅ WEBP removed because it can fail on real iPhone uploads / Gemini image handling
    const isImage = [".jpg", ".jpeg", ".png"].includes(ext);
    const isDocument = [".pdf", ".docx"].includes(ext);

    if (!isImage && !isDocument) {
      return res.status(400).json({
        ok: false,
        message:
          "Only PDF, DOCX, JPG, JPEG, and PNG files are supported right now. Please convert WEBP images to JPG or PNG.",
      });
    }

    const prompt = `
You are an expert ATS resume reviewer and career coach.

Analyze the uploaded resume and return ONLY valid JSON.
Do not return markdown.
Do not return any explanation outside JSON.

Required JSON format:
{
  "overallScore": number,
  "summary": "string",
  "scores": {
    "ats": number,
    "impact": number,
    "formatting": number,
    "keywords": number,
    "clarity": number
  },
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string"],
  "missingKeywords": ["string"],
  "improvedBullets": [
    {
      "original": "string",
      "improved": "string"
    }
  ]
}

Rules:
- Scores must be between 0 and 100.
- Keep summary short and useful.
- Give 3 to 6 strengths.
- Give 3 to 6 weaknesses.
- Give 5 to 10 suggestions.
- Give realistic missing keywords based on the resume.
- Give 3 improved bullet rewrites if possible.
- If the resume is hard to read, still do your best and mention clarity/formatting issues.
`;

    let geminiResponse;

    if (isImage) {
      const buffer = fs.readFileSync(tempPath);
      const base64Image = buffer.toString("base64");
      const mimeType = getMimeType(ext);

      geminiResponse = await generateWithRetry(
        {
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        },
        "Analyze image"
      );
    } else {
      const resumeText = await extractResumeText(tempPath, originalName);

      if (!resumeText) {
        return res.status(400).json({
          ok: false,
          message:
            "Could not extract text from this file. Upload a text-based PDF or DOCX, or use a JPG/PNG image.",
        });
      }

      geminiResponse = await generateWithRetry(
        {
          model: "gemini-2.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${prompt}\n\nResume content:\n\n${resumeText}`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
          },
        },
        "Analyze document"
      );
    }

    const raw = geminiResponse?.text || "";
    let analysis;

    try {
      analysis = safeJsonParse(raw);
    } catch (parseError) {
      console.error("Gemini invalid JSON:", parseError);
      console.error("Raw Gemini response:", raw);

      return res.status(500).json({
        ok: false,
        message: "Gemini returned invalid JSON. Try again.",
        raw,
      });
    }

    return res.json({
      ok: true,
      analysis,
    });
  } catch (error) {
    console.error("Resume analyze error:", error);

    return res.status(isRetryableGeminiError(error) ? 503 : 500).json({
      ok: false,
      message: isRetryableGeminiError(error)
        ? "AI is busy right now. Please try again in a few seconds."
        : error?.message || "Resume analysis failed. Please try again.",
    });
  } finally {
    if (tempPath && fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
});

router.post("/fix", async (req, res) => {
  try {
    const { analysis, fileName } = req.body || {};

    if (!analysis) {
      return res.status(400).json({
        ok: false,
        message: "Analysis data is required.",
      });
    }

    const prompt = `
You are an expert resume writer.

Based on this resume analysis, generate a complete improved resume draft.

Return ONLY valid JSON in this exact format:
{
  "fixedResume": {
    "fullName": "string",
    "jobTitle": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "summary": "string",
    "experience": [
      {
        "company": "string",
        "role": "string",
        "duration": "string",
        "bullets": ["string"]
      }
    ],
    "projects": [
      {
        "name": "string",
        "details": ["string"]
      }
    ],
    "education": [
      {
        "school": "string",
        "degree": "string",
        "year": "string"
      }
    ],
    "skills": ["string"]
  }
}

Use the analysis below:
${JSON.stringify(analysis, null, 2)}

Rules:
- Create a polished, ATS-friendly full resume draft.
- Rewrite content professionally.
- Use strong achievement-focused bullet points.
- Keep it realistic and clean.
- Use modern concise wording.
- If exact details are missing, infer carefully and keep them generic.
- Do not add markdown.
- Do not wrap in triple backticks.
- Return only pure JSON.
`;

    const aiResponse = await generateWithRetry(
      {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      },
      "Fix resume"
    );

    const raw = aiResponse?.text || "";
    let parsed;

    try {
      parsed = safeJsonParse(raw);
    } catch {
      return res.status(500).json({
        ok: false,
        message: "Gemini returned invalid JSON while fixing resume.",
        raw,
      });
    }

    return res.json({
      ok: true,
      fileName,
      fixedResume: parsed?.fixedResume || null,
    });
  } catch (error) {
    console.error("Resume fix error:", error);

    return res.status(isRetryableGeminiError(error) ? 503 : 500).json({
      ok: false,
      message: isRetryableGeminiError(error)
        ? "AI is busy right now. Please try again in a few seconds."
        : error?.message || "Failed to generate fixed resume.",
    });
  }
});

router.post("/generate-from-scratch", async (req, res) => {
  try {
    const {
      fullName,
      targetRole,
      email,
      phone,
      city,
      skills,
      education,
      objective,
      projects,
    } = req.body;

    if (
      !fullName ||
      !targetRole ||
      !email ||
      !phone ||
      !city ||
      !skills ||
      !education ||
      !objective ||
      !projects
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const prompt = `
You are an expert ATS resume writer.

Create a polished, realistic, ATS-friendly fresher resume in JSON format using the user's details below.

User details:
- Full Name: ${fullName}
- Target Role: ${targetRole}
- Email: ${email}
- Phone: ${phone}
- City: ${city}
- Skills: ${skills}
- Education: ${education}
- Career Objective: ${objective}
- Projects / Achievements: ${projects}

Return ONLY valid JSON in this exact structure:

{
  "fullName": "",
  "targetRole": "",
  "email": "",
  "phone": "",
  "location": "",
  "summary": "",
  "skills": ["", ""],
  "experience": [],
  "projects": [
    {
      "title": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ]
}

Rules:
- Make the summary strong, professional, concise, and ATS-friendly.
- Keep fullName, targetRole, email, phone exactly aligned with the provided user details.
- Use the provided city as "location".
- Convert skills into a clean array of strings.
- If real work experience is not provided, keep "experience" as an empty array.
- Convert projects into array objects using exactly:
  { "title": "...", "description": "..." }
- Convert education into array objects using exactly:
  { "degree": "...", "institution": "...", "year": "..." }
- Infer institution and year carefully from the provided education text when possible.
- If institution or year is not clearly available, keep them as empty strings instead of inventing wrong details.
- Projects description must be meaningful and not empty.
- Do not add markdown.
- Do not wrap in triple backticks.
- Return only pure JSON.
`;

    const aiResponse = await generateWithRetry(
      {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      },
      "Generate from scratch"
    );

    const rawText = aiResponse?.text?.trim();

    if (!rawText) {
      return res.status(500).json({
        message: "Empty response from AI",
      });
    }

    let parsedResume;

    try {
      parsedResume = safeJsonParse(rawText);
    } catch (parseError) {
      console.log("AI JSON parse error:", parseError);
      console.log("Raw AI response:", rawText);

      return res.status(500).json({
        message: "AI returned invalid JSON",
        raw: rawText,
      });
    }

    return res.status(200).json({
      message: "Resume generated successfully",
      resume: parsedResume,
    });
  } catch (error) {
    console.log("generate-from-scratch error:", error);

    return res.status(isRetryableGeminiError(error) ? 503 : 500).json({
      message: isRetryableGeminiError(error)
        ? "AI is busy right now. Please try again in a few seconds."
        : error?.message || "Something went wrong",
    });
  }
});

module.exports = router;