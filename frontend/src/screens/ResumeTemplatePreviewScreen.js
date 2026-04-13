import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../theme/ThemeContext";
import spacing from "../theme/spacing";
import ScreenHeader from "../components/ScreenHeader";
import { generatePDF } from "react-native-html-to-pdf";
import Share from "react-native-share";
import FileViewer from "react-native-file-viewer";

export default function ResumeTemplatePreviewScreen({ navigation, route }) {
  const { colors, mode } = useTheme();
  const styles = useMemo(() => makeStyles(colors, mode), [colors, mode]);

  const fixedResume = route?.params?.fixedResume || null;
  const selectedTemplate = route?.params?.selectedTemplate || "modern";
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const isModern = selectedTemplate === "modern";
  const isProfessional = selectedTemplate === "professional";
  const isMinimal = selectedTemplate === "minimal";
  const isExecutive = selectedTemplate === "executive";
  const isCompact = selectedTemplate === "compact";
  const isSidebar = selectedTemplate === "sidebar";
  const isElegant = selectedTemplate === "elegant";
  const isCreative = selectedTemplate === "creative";
  const isPhoto = selectedTemplate === "photo";
  const isSinglePage = selectedTemplate === "singlepage";

  const templateLabel =
    selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1);

  const contactLine = [fixedResume?.email, fixedResume?.phone, fixedResume?.location]
    .filter(Boolean)
    .join(" • ");

  function getResumeHtmlByTemplate() {
    switch (selectedTemplate) {
      case "professional":
        return getProfessionalHtml();
      case "minimal":
        return getMinimalHtml();
      case "executive":
        return getExecutiveHtml();
      case "compact":
        return getCompactHtml();
      case "sidebar":
        return getSidebarHtml();
      case "elegant":
        return getElegantHtml();
      case "creative":
        return getCreativeHtml();
      case "photo":
        return getPhotoHtml();
      case "singlepage":
        return getSinglePageHtml();
      case "modern":
      default:
        return getModernHtml();
    }
  }

  function safeString(value) {
    if (value === null || value === undefined) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toArray(value) {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    return [value];
  }

  function getNormalizedResumeData() {
    const skillsArray = Array.isArray(fixedResume?.skills)
      ? fixedResume.skills
      : typeof fixedResume?.skills === "string"
      ? fixedResume.skills.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const experienceArray = toArray(fixedResume?.experience);
    const projectsArray = toArray(fixedResume?.projects);
    const educationArray = toArray(fixedResume?.education);

    return {
      name: safeString(fixedResume?.fullName || "Your Name"),
      role: safeString(fixedResume?.jobTitle || "Professional Title"),
      email: safeString(fixedResume?.email || ""),
      phone: safeString(fixedResume?.phone || ""),
      location: safeString(fixedResume?.location || ""),
      summary: safeString(fixedResume?.summary || ""),
      contactLine: safeString(
        [fixedResume?.email, fixedResume?.phone, fixedResume?.location]
          .filter(Boolean)
          .join(" • ")
      ),
      skillsArray,
      experienceArray,
      projectsArray,
      educationArray,
    };
  }

  function renderExperienceHtml(accentColor = "#4F46E5") {
    const { experienceArray } = getNormalizedResumeData();
    if (!experienceArray.length) return "";

    return `
      <div class="section">
        <div class="section-title" style="color:${accentColor}; border-color:${accentColor};">Experience</div>
        ${experienceArray
          .map((item) => {
            if (typeof item === "string") {
              return `<p class="body">${safeString(item)}</p>`;
            }

            const bullets = Array.isArray(item?.bullets)
              ? item.bullets
              : item?.bullets
              ? [item.bullets]
              : [];

            return `
              <div class="entry">
                <div class="entry-row">
                  <div class="entry-title">${safeString(item?.role || "Role")}</div>
                  ${item?.duration ? `<div class="entry-meta">${safeString(item.duration)}</div>` : ""}
                </div>
                ${item?.company ? `<div class="entry-subtitle">${safeString(item.company)}</div>` : ""}
                ${
                  bullets.length
                    ? `<ul class="bullet-list">
                        ${bullets.map((bullet) => `<li>${safeString(bullet)}</li>`).join("")}
                      </ul>`
                    : ""
                }
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderProjectsHtml(accentColor = "#4F46E5") {
    const { projectsArray } = getNormalizedResumeData();
    if (!projectsArray.length) return "";

    return `
      <div class="section">
        <div class="section-title" style="color:${accentColor}; border-color:${accentColor};">Projects</div>
        ${projectsArray
          .map((item) => {
            if (typeof item === "string") {
              return `<p class="body">${safeString(item)}</p>`;
            }

            const details = Array.isArray(item?.details)
              ? item.details
              : item?.details
              ? [item.details]
              : [];

            return `
              <div class="entry">
                <div class="entry-title">${safeString(item?.name || "Project")}</div>
                ${
                  details.length
                    ? `<ul class="bullet-list">
                        ${details.map((detail) => `<li>${safeString(detail)}</li>`).join("")}
                      </ul>`
                    : ""
                }
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderEducationHtml(accentColor = "#4F46E5") {
    const { educationArray } = getNormalizedResumeData();
    if (!educationArray.length) return "";

    return `
      <div class="section">
        <div class="section-title" style="color:${accentColor}; border-color:${accentColor};">Education</div>
        ${educationArray
          .map((item) => {
            if (typeof item === "string") {
              return `<p class="body">${safeString(item)}</p>`;
            }

            return `
              <div class="entry">
                <div class="entry-row">
                  <div class="entry-title">${safeString(item?.degree || "Degree")}</div>
                  ${item?.year ? `<div class="entry-meta">${safeString(item.year)}</div>` : ""}
                </div>
                ${item?.school ? `<div class="entry-subtitle">${safeString(item.school)}</div>` : ""}
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderSkillsHtml(accentColor = "#4F46E5", title = "Skills") {
    const { skillsArray } = getNormalizedResumeData();
    if (!skillsArray.length) return "";

    return `
      <div class="section">
        <div class="section-title" style="color:${accentColor}; border-color:${accentColor};">${title}</div>
        <p class="body">${safeString(skillsArray.join(" • "))}</p>
      </div>
    `;
  }

  function getBaseCss(extra = "") {
    return `
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #111827;
          background: #ffffff;
        }
        .page {
          padding: 28px;
        }
        .name {
          font-size: 28px;
          font-weight: 800;
          margin: 0;
        }
        .role {
          font-size: 14px;
          font-weight: 700;
          margin-top: 6px;
        }
        .contact {
          font-size: 12px;
          color: #6B7280;
          margin-top: 8px;
          line-height: 18px;
        }
        .section {
          margin-top: 20px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          padding-bottom: 6px;
          border-bottom: 1px solid;
          margin-bottom: 10px;
        }
        .body {
          font-size: 13px;
          line-height: 1.7;
          color: #374151;
          margin: 0;
        }
        .entry {
          margin-bottom: 14px;
        }
        .entry-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
        }
        .entry-title {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
        }
        .entry-subtitle {
          font-size: 12px;
          font-weight: 600;
          color: #4B5563;
          margin-top: 4px;
        }
        .entry-meta {
          font-size: 11px;
          font-weight: 700;
          color: #6B7280;
          white-space: nowrap;
        }
        .bullet-list {
          margin: 7px 0 0 18px;
          padding: 0;
        }
        .bullet-list li {
          font-size: 13px;
          line-height: 1.7;
          color: #374151;
          margin-bottom: 4px;
        }
        ${extra}
      </style>
    `;
  }

  function getModernHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>
          ${getBaseCss(`
            .top {
              display: flex;
              gap: 18px;
              align-items: stretch;
            }
            .accent-bar {
              width: 10px;
              border-radius: 999px;
              background: #4F46E5;
            }
            .role { color: #4F46E5; }
          `)}
        </head>
        <body>
          <div class="page">
            <div class="top">
              <div style="flex:1;">
                <h1 class="name">${d.name}</h1>
                <div class="role">${d.role}</div>
                <div class="contact">${d.contactLine}</div>
              </div>
              <div class="accent-bar"></div>
            </div>

            ${d.summary ? `<div class="section"><div class="section-title" style="color:#4F46E5;border-color:#4F46E5;">Professional Summary</div><p class="body">${d.summary}</p></div>` : ""}
            ${renderExperienceHtml("#4F46E5")}
            ${renderProjectsHtml("#4F46E5")}
            ${renderEducationHtml("#4F46E5")}
            ${renderSkillsHtml("#4F46E5")}
          </div>
        </body>
      </html>
    `;
  }

  function getProfessionalHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>${getBaseCss(`
          .header-center { text-align: center; }
          .section-title { color: #111827; border-color: #D1D5DB; }
        `)}</head>
        <body>
          <div class="page">
            <div class="header-center">
              <h1 class="name">${d.name}</h1>
              <div class="role" style="color:#374151;">${d.role}</div>
              <div class="contact">${d.contactLine}</div>
            </div>

            ${d.summary ? `<div class="section"><div class="section-title">Professional Summary</div><p class="body">${d.summary}</p></div>` : ""}
            ${renderExperienceHtml("#111827")}
            ${renderProjectsHtml("#111827")}
            ${renderEducationHtml("#111827")}
            ${renderSkillsHtml("#111827")}
          </div>
        </body>
      </html>
    `;
  }

  function getMinimalHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>${getBaseCss(`
          .section-title { color: #111827; border-color: #E5E7EB; }
          .role { color: #374151; }
        `)}</head>
        <body>
          <div class="page">
            <h1 class="name">${d.name}</h1>
            <div class="role">${d.role}</div>
            <div class="contact">${d.contactLine}</div>

            ${d.summary ? `<div class="section"><div class="section-title">Summary</div><p class="body">${d.summary}</p></div>` : ""}
            ${renderExperienceHtml("#111827")}
            ${renderProjectsHtml("#111827")}
            ${renderEducationHtml("#111827")}
            ${renderSkillsHtml("#111827")}
          </div>
        </body>
      </html>
    `;
  }

  function getExecutiveHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>${getBaseCss(`
          .header-center { text-align: center; }
          .name { font-size: 30px; letter-spacing: 0.3px; }
          .role { color: #1F2937; }
          .section-title { color: #111827; border-color: #111827; }
        `)}</head>
        <body>
          <div class="page">
            <div class="header-center">
              <h1 class="name">${d.name}</h1>
              <div class="role">${d.role}</div>
              <div class="contact">${d.contactLine}</div>
            </div>

            ${d.summary ? `<div class="section"><div class="section-title">Executive Summary</div><p class="body">${d.summary}</p></div>` : ""}
            ${renderExperienceHtml("#111827")}
            ${renderProjectsHtml("#111827")}
            ${renderEducationHtml("#111827")}
            ${renderSkillsHtml("#111827", "Core Skills")}
          </div>
        </body>
      </html>
    `;
  }

  function getCompactHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>${getBaseCss(`
          .page { padding: 22px; }
          .name { font-size: 24px; }
          .role { color: #374151; font-size: 13px; }
          .contact { font-size: 11px; line-height: 16px; }
          .section { margin-top: 16px; }
          .section-title { font-size: 12px; color: #111827; border-color: #E5E7EB; padding-bottom: 4px; }
          .body, .bullet-list li { font-size: 12px; line-height: 1.55; }
          .entry-title { font-size: 13px; }
          .entry-subtitle { font-size: 11px; }
          .entry-meta { font-size: 10px; }
        `)}</head>
        <body>
          <div class="page">
            <h1 class="name">${d.name}</h1>
            <div class="role">${d.role}</div>
            <div class="contact">${d.contactLine}</div>

            ${d.summary ? `<div class="section"><div class="section-title">Summary</div><p class="body">${d.summary}</p></div>` : ""}
            ${renderExperienceHtml("#111827")}
            ${renderProjectsHtml("#111827")}
            ${renderEducationHtml("#111827")}
            ${renderSkillsHtml("#111827")}
          </div>
        </body>
      </html>
    `;
  }

  function getSidebarHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>${getBaseCss(`
          body { background: #ffffff; }
          .page { padding: 0; }
          .layout { display: table; width: 100%; table-layout: fixed; }
          .left {
            display: table-cell;
            width: 30%;
            vertical-align: top;
            background: #111827;
            padding: 26px 18px;
            color: #ffffff;
            min-height: 100vh;
          }
          .right {
            display: table-cell;
            width: 70%;
            vertical-align: top;
            padding: 26px 24px;
          }
          .left .name {
            color: #ffffff;
            font-size: 22px;
          }
          .left .role {
            color: #C7D2FE;
            font-size: 13px;
            margin-bottom: 18px;
          }
          .left-title {
            margin-top: 16px;
            margin-bottom: 6px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #ffffff;
          }
          .left-text {
            font-size: 12px;
            line-height: 1.6;
            color: #D1D5DB;
            margin-bottom: 4px;
          }
          .right .section-title {
            color: #111827;
            border-color: #E5E7EB;
          }
        `)}</head>
        <body>
          <div class="layout">
            <div class="left">
              <h1 class="name">${d.name}</h1>
              <div class="role">${d.role}</div>

              <div class="left-title">Contact</div>
              <div class="left-text">${d.email || "-"}</div>
              <div class="left-text">${d.phone || "-"}</div>
              <div class="left-text">${d.location || "-"}</div>

              ${
                d.skillsArray.length
                  ? `
                    <div class="left-title">Skills</div>
                    ${d.skillsArray
                      .map((skill) => `<div class="left-text">• ${safeString(skill)}</div>`)
                      .join("")}
                  `
                  : ""
              }
            </div>

            <div class="right">
              ${d.summary ? `<div class="section"><div class="section-title" style="color:#111827;border-color:#E5E7EB;">Profile</div><p class="body">${d.summary}</p></div>` : ""}
              ${renderExperienceHtml("#111827")}
              ${renderProjectsHtml("#111827")}
              ${renderEducationHtml("#111827")}
            </div>
          </div>
        </body>
      </html>
    `;
  }

  function getElegantHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>${getBaseCss(`
          body { background: #FFFBF7; }
          .page { background: #FFFBF7; }
          .name, .entry-title { color: #3F2D20; }
          .role, .section-title, .entry-meta { color: #8B5E3C; }
          .contact, .entry-subtitle, .body, .bullet-list li { color: #4B3A2F; }
          .section-title { border-color: #D8BFA3; }
        `)}</head>
        <body>
          <div class="page">
            <div style="text-align:center;">
              <h1 class="name">${d.name}</h1>
              <div class="role">${d.role}</div>
              <div class="contact">${d.contactLine}</div>
            </div>

            ${d.summary ? `<div class="section"><div class="section-title">Summary</div><p class="body">${d.summary}</p></div>` : ""}
            ${renderExperienceHtml("#8B5E3C")}
            ${renderProjectsHtml("#8B5E3C")}
            ${renderEducationHtml("#8B5E3C")}
            ${renderSkillsHtml("#8B5E3C")}
          </div>
        </body>
      </html>
    `;
  }

  function getCreativeHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>${getBaseCss(`
          .creative-top {
            background: #4F46E5;
            padding: 18px 20px;
            border-radius: 18px;
            margin-bottom: 16px;
          }
          .creative-top .name {
            color: #ffffff;
            font-size: 26px;
          }
          .creative-top .role {
            color: #E0E7FF;
          }
          .section-title { color: #4F46E5; border-color: #C7D2FE; }
          .contact { color: #64748B; }
        `)}</head>
        <body>
          <div class="page">
            <div class="creative-top">
              <h1 class="name">${d.name}</h1>
              <div class="role">${d.role}</div>
            </div>
            <div class="contact">${d.contactLine}</div>

            ${d.summary ? `<div class="section"><div class="section-title">About Me</div><p class="body">${d.summary}</p></div>` : ""}
            ${renderExperienceHtml("#4F46E5")}
            ${renderProjectsHtml("#4F46E5")}
            ${renderEducationHtml("#4F46E5")}
            ${renderSkillsHtml("#4F46E5")}
          </div>
        </body>
      </html>
    `;
  }

  function getPhotoHtml() {
    const d = getNormalizedResumeData();
    return `
      <html>
        <head>${getBaseCss(`
          .photo-header {
            display: flex;
            align-items: center;
            gap: 18px;
            margin-bottom: 18px;
          }
          .photo-circle {
            width: 82px;
            height: 82px;
            border-radius: 41px;
            background: #E5E7EB;
          }
          .section-title { color: #111827; border-color: #E5E7EB; }
        `)}</head>
        <body>
          <div class="page">
            <div class="photo-header">
              <div class="photo-circle"></div>
              <div>
                <h1 class="name">${d.name}</h1>
                <div class="role" style="color:#374151;">${d.role}</div>
                <div class="contact">${d.contactLine}</div>
              </div>
            </div>

            ${d.summary ? `<div class="section"><div class="section-title">Profile</div><p class="body">${d.summary}</p></div>` : ""}
            ${renderExperienceHtml("#111827")}
            ${renderProjectsHtml("#111827")}
            ${renderEducationHtml("#111827")}
            ${renderSkillsHtml("#111827")}
          </div>
        </body>
      </html>
    `;
  }

  function getSinglePageHtml() {
    const d = getNormalizedResumeData();
    const exp = d.experienceArray.slice(0, 2);
    const edu = d.educationArray.slice(0, 1);

    return `
      <html>
        <head>${getBaseCss(`
          .page { padding: 22px; }
          .name, .role, .contact { text-align: center; }
          .name { font-size: 24px; }
          .role { color: #374151; }
          .contact { font-size: 11px; line-height: 16px; }
          .section { margin-top: 14px; }
          .section-title { font-size: 12px; color: #111827; border-color: #E5E7EB; padding-bottom: 4px; }
          .body, .bullet-list li { font-size: 12px; line-height: 1.55; }
          .entry-title { font-size: 13px; }
          .entry-meta { font-size: 10px; }
        `)}</head>
        <body>
          <div class="page">
            <h1 class="name">${d.name}</h1>
            <div class="role">${d.role}</div>
            <div class="contact">${d.contactLine}</div>

            ${d.summary ? `<div class="section"><div class="section-title">Summary</div><p class="body">${d.summary}</p></div>` : ""}

            ${
              exp.length
                ? `
                  <div class="section">
                    <div class="section-title">Experience</div>
                    ${exp
                      .map((item) => {
                        if (typeof item === "string") {
                          return `<p class="body">${safeString(item)}</p>`;
                        }

                        const bullets = Array.isArray(item?.bullets)
                          ? item.bullets.slice(0, 2)
                          : item?.bullets
                          ? [item.bullets]
                          : [];

                        return `
                          <div class="entry">
                            <div class="entry-title">
                              ${safeString(item?.role || "Role")}
                              ${item?.company ? ` • ${safeString(item.company)}` : ""}
                            </div>
                            ${item?.duration ? `<div class="entry-meta">${safeString(item.duration)}</div>` : ""}
                            ${
                              bullets.length
                                ? `<ul class="bullet-list">
                                    ${bullets.map((bullet) => `<li>${safeString(bullet)}</li>`).join("")}
                                  </ul>`
                                : ""
                            }
                          </div>
                        `;
                      })
                      .join("")}
                  </div>
                `
                : ""
            }

            ${renderSkillsHtml("#111827")}

            ${
              edu.length
                ? `
                  <div class="section">
                    <div class="section-title">Education</div>
                    ${edu
                      .map((item) => {
                        if (typeof item === "string") {
                          return `<p class="body">${safeString(item)}</p>`;
                        }
                        return `
                          <p class="body">
                            ${[item?.degree, item?.school, item?.year]
                              .filter(Boolean)
                              .map((part) => safeString(part))
                              .join(" • ")}
                          </p>
                        `;
                      })
                      .join("")}
                  </div>
                `
                : ""
            }
          </div>
        </body>
      </html>
    `;
  }

  async function handleDownloadResume() {
    try {
      if (!fixedResume) {
        Alert.alert("Error", "No resume data available");
        return;
      }

      const safeFileName = `${fixedResume?.fullName || "Resume"}_${selectedTemplate}`
        .replace(/[^a-zA-Z0-9_-]/g, "_");

      const htmlContent = getResumeHtmlByTemplate();

      const file = await generatePDF({
        html: htmlContent,
        fileName: safeFileName,
        directory: "Documents",
      });

      if (!file?.filePath) {
        Alert.alert("Error", "PDF created but file path was not returned");
        return;
      }

      await FileViewer.open(file.filePath, {
        showOpenWithDialog: true,
      });

      setTimeout(async () => {
        try {
          await Share.open({
            url: `file://${file.filePath}`,
            type: "application/pdf",
            failOnCancel: false,
            saveToFiles: true,
          });
        } catch (shareError) {
          console.log("Share error:", shareError);
        }
      }, 600);
    } catch (error) {
      console.log("PDF download/open error:", error);
      Alert.alert("Error", error?.message || "Failed to download resume");
    }
  }

  function renderSummary(textStyle, titleStyle, title = "Professional Summary") {
    if (!fixedResume?.summary) return null;
    return (
      <Section title={title} titleStyle={titleStyle}>
        <Text style={textStyle}>{fixedResume.summary}</Text>
      </Section>
    );
  }

  function renderExperience(
    entryTitleStyle,
    subtitleStyle,
    metaStyle,
    bulletStyle,
    titleStyle
  ) {
    if (!fixedResume?.experience?.length) return null;

    return (
      <Section title="Experience" titleStyle={titleStyle}>
        {fixedResume.experience.map((item, index) => (
          <View key={index} style={styles.entryBlock}>
            <View style={styles.entryTopRow}>
              <Text style={entryTitleStyle}>{item?.role || "Role"}</Text>
              {!!item?.duration && <Text style={metaStyle}>{item.duration}</Text>}
            </View>

            {!!item?.company && <Text style={subtitleStyle}>{item.company}</Text>}

            {item?.bullets?.map((bullet, i) => (
              <Text key={i} style={bulletStyle}>
                • {bullet}
              </Text>
            ))}
          </View>
        ))}
      </Section>
    );
  }

  function renderProjects(entryTitleStyle, bulletStyle, titleStyle) {
    if (!fixedResume?.projects?.length) return null;

    return (
      <Section title="Projects" titleStyle={titleStyle}>
        {fixedResume.projects.map((item, index) => (
          <View key={index} style={styles.entryBlock}>
            <Text style={entryTitleStyle}>{item?.name || "Project"}</Text>
            {item?.details?.map((detail, i) => (
              <Text key={i} style={bulletStyle}>
                • {detail}
              </Text>
            ))}
          </View>
        ))}
      </Section>
    );
  }

  function renderEducation(entryTitleStyle, subtitleStyle, metaStyle, titleStyle) {
    if (!fixedResume?.education?.length) return null;

    return (
      <Section title="Education" titleStyle={titleStyle}>
        {fixedResume.education.map((item, index) => (
          <View key={index} style={styles.entryBlock}>
            <View style={styles.entryTopRow}>
              <Text style={entryTitleStyle}>{item?.degree || "Degree"}</Text>
              {!!item?.year && <Text style={metaStyle}>{item.year}</Text>}
            </View>

            {!!item?.school && <Text style={subtitleStyle}>{item.school}</Text>}
          </View>
        ))}
      </Section>
    );
  }

  function renderSkillsText(textStyle, titleStyle, title = "Skills") {
    if (!fixedResume?.skills?.length) return null;

    return (
      <Section title={title} titleStyle={titleStyle}>
        <Text style={textStyle}>{fixedResume.skills.join(" • ")}</Text>
      </Section>
    );
  }

  function renderSkillsChips(titleStyle) {
    if (!fixedResume?.skills?.length) return null;

    return (
      <Section title="Skills" titleStyle={titleStyle}>
        <View style={styles.skillsWrap}>
          {fixedResume.skills.map((skill, index) => (
            <View key={index} style={styles.modernSkillChip}>
              <Text style={styles.modernSkillChipText}>{skill}</Text>
            </View>
          ))}
        </View>
      </Section>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <ScreenHeader title="Template Preview" onBack={() => navigation.goBack()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.hero}>
            <Animated.View
              style={[
                styles.heroGlow,
                {
                  transform: [
                    {
                      translateX: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-30, 30],
                      }),
                    },
                  ],
                },
              ]}
            />

            <View style={styles.heroChip}>
              <Icon name="document-text-outline" size={14} color={colors.primary} />
              <Text style={styles.heroChipText}>Resume Preview</Text>
            </View>

            <Text style={styles.heading}>
              Preview Your{"\n"}Final Resume
            </Text>

            <Text style={styles.subheading}>
              Review your resume in the selected template before downloading or
              exporting.
            </Text>
          </View>

          <View style={styles.previewInfoCard}>
            <View style={styles.previewInfoTop}>
              <View style={styles.previewInfoIconWrap}>
                <Icon name="sparkles-outline" size={18} color={colors.primary} />
              </View>

              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>{templateLabel} Template</Text>
              </View>
            </View>

            <Text style={styles.previewInfoTitle}>Selected Resume Layout</Text>
            <Text style={styles.previewInfoText}>
              This is your polished resume preview with the chosen template applied.
              Review spacing, hierarchy, and content flow before export.
            </Text>
          </View>

          <View style={styles.previewStage}>
            <View style={styles.previewStageTop}>
              <View style={styles.previewStageDot} />
              <View style={styles.previewStageDot} />
              <View style={styles.previewStageDot} />
            </View>

            <View style={styles.previewStagePaper}>
              {isModern && (
                <View style={styles.modernCard}>
                  <View style={styles.modernHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modernName}>
                        {fixedResume?.fullName || "Your Name"}
                      </Text>
                      <Text style={styles.modernRole}>
                        {fixedResume?.jobTitle || "Professional Title"}
                      </Text>
                      <Text style={styles.modernContact}>{contactLine}</Text>
                    </View>
                    <View style={styles.modernAccent} />
                  </View>

                  {renderSummary(styles.modernText, styles.modernSectionTitle)}
                  {renderExperience(
                    styles.entryTitle,
                    styles.entrySubtitle,
                    styles.entryMeta,
                    styles.bulletText,
                    styles.modernSectionTitle
                  )}
                  {renderProjects(
                    styles.entryTitle,
                    styles.bulletText,
                    styles.modernSectionTitle
                  )}
                  {renderEducation(
                    styles.entryTitle,
                    styles.entrySubtitle,
                    styles.entryMeta,
                    styles.modernSectionTitle
                  )}
                  {renderSkillsChips(styles.modernSectionTitle)}
                </View>
              )}

              {isProfessional && (
                <View style={styles.professionalCard}>
                  <Text style={styles.professionalName}>
                    {fixedResume?.fullName || "Your Name"}
                  </Text>
                  <Text style={styles.professionalRole}>
                    {fixedResume?.jobTitle || "Professional Title"}
                  </Text>
                  <Text style={styles.professionalContact}>{contactLine}</Text>

                  {renderSummary(styles.professionalText, styles.professionalSectionTitle)}
                  {renderExperience(
                    styles.professionalEntryTitle,
                    styles.professionalSubtitle,
                    styles.professionalMeta,
                    styles.professionalBullet,
                    styles.professionalSectionTitle
                  )}
                  {renderProjects(
                    styles.professionalEntryTitle,
                    styles.professionalBullet,
                    styles.professionalSectionTitle
                  )}
                  {renderEducation(
                    styles.professionalEntryTitle,
                    styles.professionalSubtitle,
                    styles.professionalMeta,
                    styles.professionalSectionTitle
                  )}
                  {renderSkillsText(
                    styles.professionalText,
                    styles.professionalSectionTitle
                  )}
                </View>
              )}

              {isMinimal && (
                <View style={styles.minimalCard}>
                  <Text style={styles.minimalName}>
                    {fixedResume?.fullName || "Your Name"}
                  </Text>
                  <Text style={styles.minimalRole}>
                    {fixedResume?.jobTitle || "Professional Title"}
                  </Text>
                  <Text style={styles.minimalContact}>{contactLine}</Text>

                  {renderSummary(styles.minimalText, styles.minimalSectionTitle, "Summary")}
                  {renderExperience(
                    styles.minimalEntryTitle,
                    styles.minimalMeta,
                    styles.minimalMeta,
                    styles.minimalBullet,
                    styles.minimalSectionTitle
                  )}
                  {renderProjects(
                    styles.minimalEntryTitle,
                    styles.minimalBullet,
                    styles.minimalSectionTitle
                  )}
                  {renderEducation(
                    styles.minimalEntryTitle,
                    styles.minimalMeta,
                    styles.minimalMeta,
                    styles.minimalSectionTitle
                  )}
                  {renderSkillsText(styles.minimalText, styles.minimalSectionTitle)}
                </View>
              )}

              {isExecutive && (
                <View style={styles.executiveCard}>
                  <Text style={styles.executiveName}>
                    {fixedResume?.fullName || "Your Name"}
                  </Text>
                  <Text style={styles.executiveRole}>
                    {fixedResume?.jobTitle || "Professional Title"}
                  </Text>
                  <Text style={styles.executiveContact}>{contactLine}</Text>

                  {renderSummary(
                    styles.executiveText,
                    styles.executiveSectionTitle,
                    "Executive Summary"
                  )}
                  {renderExperience(
                    styles.executiveEntryTitle,
                    styles.executiveSubtitle,
                    styles.executiveMeta,
                    styles.executiveBullet,
                    styles.executiveSectionTitle
                  )}
                  {renderProjects(
                    styles.executiveEntryTitle,
                    styles.executiveBullet,
                    styles.executiveSectionTitle
                  )}
                  {renderEducation(
                    styles.executiveEntryTitle,
                    styles.executiveSubtitle,
                    styles.executiveMeta,
                    styles.executiveSectionTitle
                  )}
                  {renderSkillsText(
                    styles.executiveText,
                    styles.executiveSectionTitle,
                    "Core Skills"
                  )}
                </View>
              )}

              {isCompact && (
                <View style={styles.compactCard}>
                  <Text style={styles.compactName}>
                    {fixedResume?.fullName || "Your Name"}
                  </Text>
                  <Text style={styles.compactRole}>
                    {fixedResume?.jobTitle || "Professional Title"}
                  </Text>
                  <Text style={styles.compactContact}>{contactLine}</Text>

                  {renderSummary(styles.compactText, styles.compactSectionTitle, "Summary")}
                  {renderExperience(
                    styles.compactEntryTitle,
                    styles.compactMeta,
                    styles.compactMeta,
                    styles.compactBullet,
                    styles.compactSectionTitle
                  )}
                  {renderProjects(
                    styles.compactEntryTitle,
                    styles.compactBullet,
                    styles.compactSectionTitle
                  )}
                  {renderEducation(
                    styles.compactEntryTitle,
                    styles.compactMeta,
                    styles.compactMeta,
                    styles.compactSectionTitle
                  )}
                  {renderSkillsText(styles.compactText, styles.compactSectionTitle)}
                </View>
              )}

              {isSidebar && (
                <View style={styles.sidebarCard}>
                  <View style={styles.sidebarLeft}>
                    <Text style={styles.sidebarName}>
                      {fixedResume?.fullName || "Your Name"}
                    </Text>
                    <Text style={styles.sidebarRole}>
                      {fixedResume?.jobTitle || "Professional Title"}
                    </Text>

                    <Text style={styles.sidebarSideHeading}>Contact</Text>
                    <Text style={styles.sidebarSideText}>{fixedResume?.email || "-"}</Text>
                    <Text style={styles.sidebarSideText}>{fixedResume?.phone || "-"}</Text>
                    <Text style={styles.sidebarSideText}>
                      {fixedResume?.location || "-"}
                    </Text>

                    {!!fixedResume?.skills?.length && (
                      <>
                        <Text style={styles.sidebarSideHeading}>Skills</Text>
                        {fixedResume.skills.map((skill, index) => (
                          <Text key={index} style={styles.sidebarSideText}>
                            • {skill}
                          </Text>
                        ))}
                      </>
                    )}
                  </View>

                  <View style={styles.sidebarRight}>
                    {renderSummary(styles.sidebarText, styles.sidebarSectionTitle, "Profile")}
                    {renderExperience(
                      styles.sidebarEntryTitle,
                      styles.sidebarSubtitle,
                      styles.sidebarMeta,
                      styles.sidebarBullet,
                      styles.sidebarSectionTitle
                    )}
                    {renderProjects(
                      styles.sidebarEntryTitle,
                      styles.sidebarBullet,
                      styles.sidebarSectionTitle
                    )}
                    {renderEducation(
                      styles.sidebarEntryTitle,
                      styles.sidebarSubtitle,
                      styles.sidebarMeta,
                      styles.sidebarSectionTitle
                    )}
                  </View>
                </View>
              )}

              {isElegant && (
                <View style={styles.elegantCard}>
                  <Text style={styles.elegantName}>
                    {fixedResume?.fullName || "Your Name"}
                  </Text>
                  <Text style={styles.elegantRole}>
                    {fixedResume?.jobTitle || "Professional Title"}
                  </Text>
                  <Text style={styles.elegantContact}>{contactLine}</Text>

                  {renderSummary(styles.elegantText, styles.elegantSectionTitle, "Summary")}
                  {renderExperience(
                    styles.elegantEntryTitle,
                    styles.elegantSubtitle,
                    styles.elegantMeta,
                    styles.elegantBullet,
                    styles.elegantSectionTitle
                  )}
                  {renderProjects(
                    styles.elegantEntryTitle,
                    styles.elegantBullet,
                    styles.elegantSectionTitle
                  )}
                  {renderEducation(
                    styles.elegantEntryTitle,
                    styles.elegantSubtitle,
                    styles.elegantMeta,
                    styles.elegantSectionTitle
                  )}
                  {renderSkillsText(styles.elegantText, styles.elegantSectionTitle)}
                </View>
              )}

              {isCreative && (
                <View style={styles.creativeCard}>
                  <View style={styles.creativeTop}>
                    <Text style={styles.creativeName}>
                      {fixedResume?.fullName || "Your Name"}
                    </Text>
                    <Text style={styles.creativeRole}>
                      {fixedResume?.jobTitle || "Professional Title"}
                    </Text>
                  </View>

                  <Text style={styles.creativeContact}>{contactLine}</Text>

                  {renderSummary(styles.creativeText, styles.creativeSectionTitle, "About Me")}
                  {renderExperience(
                    styles.creativeEntryTitle,
                    styles.creativeMeta,
                    styles.creativeMeta,
                    styles.creativeBullet,
                    styles.creativeSectionTitle
                  )}
                  {renderProjects(
                    styles.creativeEntryTitle,
                    styles.creativeBullet,
                    styles.creativeSectionTitle
                  )}
                  {renderEducation(
                    styles.creativeEntryTitle,
                    styles.creativeMeta,
                    styles.creativeMeta,
                    styles.creativeSectionTitle
                  )}
                  {renderSkillsText(styles.creativeText, styles.creativeSectionTitle)}
                </View>
              )}

              {isPhoto && (
                <View style={styles.photoCard}>
                  <View style={styles.photoHeader}>
                    <View style={styles.photoCircle} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.photoName}>
                        {fixedResume?.fullName || "Your Name"}
                      </Text>
                      <Text style={styles.photoRole}>
                        {fixedResume?.jobTitle || "Professional Title"}
                      </Text>
                      <Text style={styles.photoContact}>{contactLine}</Text>
                    </View>
                  </View>

                  {renderSummary(styles.photoText, styles.photoSectionTitle, "Profile")}
                  {renderExperience(
                    styles.photoEntryTitle,
                    styles.photoMeta,
                    styles.photoMeta,
                    styles.photoBullet,
                    styles.photoSectionTitle
                  )}
                  {renderProjects(
                    styles.photoEntryTitle,
                    styles.photoBullet,
                    styles.photoSectionTitle
                  )}
                  {renderEducation(
                    styles.photoEntryTitle,
                    styles.photoMeta,
                    styles.photoMeta,
                    styles.photoSectionTitle
                  )}
                  {renderSkillsText(styles.photoText, styles.photoSectionTitle)}
                </View>
              )}

              {isSinglePage && (
                <View style={styles.singlePageCard}>
                  <Text style={styles.singlePageName}>
                    {fixedResume?.fullName || "Your Name"}
                  </Text>
                  <Text style={styles.singlePageRole}>
                    {fixedResume?.jobTitle || "Professional Title"}
                  </Text>
                  <Text style={styles.singlePageContact}>{contactLine}</Text>

                  {renderSummary(styles.singlePageText, styles.singlePageSectionTitle, "Summary")}

                  {!!fixedResume?.experience?.length && (
                    <Section title="Experience" titleStyle={styles.singlePageSectionTitle}>
                      {fixedResume.experience.slice(0, 2).map((item, index) => (
                        <View key={index} style={styles.compactEntryBlock}>
                          <Text style={styles.singlePageEntryTitle}>
                            {item?.role || "Role"}
                            {item?.company ? ` • ${item.company}` : ""}
                          </Text>
                          {!!item?.duration && (
                            <Text style={styles.singlePageMeta}>{item.duration}</Text>
                          )}
                          {(item?.bullets || []).slice(0, 2).map((bullet, i) => (
                            <Text key={i} style={styles.singlePageBullet}>
                              • {bullet}
                            </Text>
                          ))}
                        </View>
                      ))}
                    </Section>
                  )}

                  {!!fixedResume?.skills?.length && (
                    <Section title="Skills" titleStyle={styles.singlePageSectionTitle}>
                      <Text style={styles.singlePageText}>
                        {fixedResume.skills.join(" • ")}
                      </Text>
                    </Section>
                  )}

                  {!!fixedResume?.education?.length && (
                    <Section title="Education" titleStyle={styles.singlePageSectionTitle}>
                      {fixedResume.education.slice(0, 1).map((item, index) => (
                        <Text key={index} style={styles.singlePageText}>
                          {[item?.degree, item?.school, item?.year]
                            .filter(Boolean)
                            .join(" • ")}
                        </Text>
                      ))}
                    </Section>
                  )}
                </View>
              )}
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipIconWrap}>
                <Icon name="bulb-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.tipTitle}>Final Check</Text>
            </View>

            <Text style={styles.tipText}>
              Review line breaks, section spacing, and role titles carefully.
              This preview helps you catch layout issues before export.
            </Text>
          </View>
        </ScrollView>

        <Pressable
          onPress={handleDownloadResume}
          style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
        >
          <LinearGradient
            colors={
              mode === "dark"
                ? ["#4F46E5", "#6366F1", "#7C3AED"]
                : ["#4F46E5", "#6366F1", "#818CF8"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaCard}
          >
            <View style={styles.ctaHeaderRow}>
              <View style={styles.ctaIconWrap}>
                <Icon name="download-outline" size={24} color="#FFFFFF" />
              </View>

              <View style={styles.ctaBadge}>
                <Text style={styles.ctaBadgeText}>{templateLabel} Ready</Text>
              </View>
            </View>

            <Text style={styles.ctaTitle}>Download Resume</Text>

            <Text style={styles.ctaDesc}>
              Export this selected template as your final polished resume file.
            </Text>

            <View style={styles.ctaFooterRow}>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Export PDF</Text>
              </View>

              <View style={styles.ctaArrowWrap}>
                <Icon name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Section({ title, titleStyle, children }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={titleStyle}>{title}</Text>
      {children}
    </View>
  );
}

const makeStyles = (colors, mode) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
    },

    scrollContent: {
      paddingTop: 6,
      paddingBottom: spacing.xl,
      alignItems: "center",
    },

    hero: {
      width: "100%",
      marginTop: 6,
      marginBottom: 18,
      position: "relative",
    },

    heroGlow: {
      position: "absolute",
      top: -220,
      left: -140,
      width: 420,
      height: 420,
      borderRadius: 420,
      backgroundColor: "#6366F1",
      opacity: 0.06,
    },

    heroChip: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 18,
    },

    heroChipText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "700",
    },

    heading: {
      color: colors.text,
      fontSize: 30,
      fontWeight: "800",
      lineHeight: 34,
      letterSpacing: -1,
    },

    subheading: {
      color: colors.mutedText,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      fontSize: 16,
      lineHeight: 22,
      maxWidth: 560,
    },

    previewInfoCard: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      marginBottom: spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.05,
      shadowRadius: 18,
      elevation: 3,
    },

    previewInfoTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
      gap: 12,
    },

    previewInfoIconWrap: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    previewBadge: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors.subtle,
      borderWidth: 1,
      borderColor: colors.border,
    },

    previewBadgeText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "800",
    },

    previewInfoTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "800",
      marginBottom: 8,
    },

    previewInfoText: {
      color: colors.mutedText,
      fontSize: 14,
      lineHeight: 21,
    },

    previewStage: {
      width: "100%",
      backgroundColor: mode === "dark" ? "#111827" : "#EEF2FF",
      borderRadius: 28,
      padding: 14,
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(79,70,229,0.08)",
      marginBottom: spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: mode === "dark" ? 0.18 : 0.08,
      shadowRadius: 24,
      elevation: 4,
    },

    previewStageTop: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
      paddingHorizontal: 2,
    },

    previewStageDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: mode === "dark" ? "rgba(255,255,255,0.22)" : "#C7D2FE",
    },

    previewStagePaper: {
      backgroundColor: mode === "dark" ? "#0F172A" : "#F8FAFC",
      borderRadius: 22,
      padding: 10,
      borderWidth: 1,
      borderColor:
        mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.06)",
      alignItems: "center",
    },

    tipCard: {
      width: "100%",
      backgroundColor: colors.card,
      borderRadius: 22,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: mode === "dark" ? "rgba(255,255,255,0.05)" : colors.border,
      marginBottom: spacing.lg,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: mode === "dark" ? 0.12 : 0.05,
      shadowRadius: 18,
      elevation: 3,
    },

    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },

    tipIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.subtle,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },

    tipTitle: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "800",
    },

    tipText: {
      color: colors.mutedText,
      fontSize: 13,
      lineHeight: 20,
    },

    ctaCard: {
      borderRadius: 28,
      marginTop: 4,
      marginBottom: 10,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: mode === "dark" ? 0.22 : 0.12,
      shadowRadius: 24,
      elevation: 4,
    },

    ctaHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      marginBottom: 5,
    },

    ctaIconWrap: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.16)",
      alignItems: "center",
      justifyContent: "center",
    },

    ctaBadge: {
      paddingHorizontal: 16,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.14)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
      alignItems: "center",
      justifyContent: "center",
    },

    ctaBadgeText: {
      color: "#FFFFFF",
      fontSize: 12,
      fontWeight: "700",
    },

    ctaTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "900",
      lineHeight: 24,
      marginBottom: 12,
      paddingLeft: 15,
    },

    ctaDesc: {
      color: "rgba(255,255,255,0.92)",
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 24,
      paddingLeft: 15,
      paddingRight: 15,
    },

    ctaFooterRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
    },

    ctaButton: {
      backgroundColor: "rgba(255,255,255,0.18)",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 14,
    },

    ctaButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
    },

    ctaArrowWrap: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: "rgba(255,255,255,0.14)",
      alignItems: "center",
      justifyContent: "center",
    },

    modernCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },

    modernHeader: {
      flexDirection: "row",
      alignItems: "stretch",
      gap: spacing.md,
      marginBottom: spacing.lg,
    },

    modernAccent: {
      width: 10,
      borderRadius: 999,
      backgroundColor: "#4F46E5",
    },

    modernName: {
      fontSize: 28,
      fontWeight: "900",
      color: "#111827",
    },

    modernRole: {
      marginTop: 6,
      fontSize: 15,
      fontWeight: "700",
      color: "#4F46E5",
    },

    modernContact: {
      marginTop: 8,
      fontSize: 12,
      lineHeight: 18,
      color: "#6B7280",
    },

    modernSectionTitle: {
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: "#4F46E5",
      marginBottom: spacing.sm,
    },

    modernText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    modernSkillChip: {
      backgroundColor: "#EEF2FF",
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },

    modernSkillChipText: {
      color: "#4338CA",
      fontSize: 12,
      fontWeight: "700",
    },

    professionalCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: "#D1D5DB",
    },

    professionalName: {
      fontSize: 26,
      fontWeight: "900",
      color: "#111827",
      textAlign: "center",
    },

    professionalRole: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: "700",
      color: "#374151",
      textAlign: "center",
    },

    professionalContact: {
      marginTop: 8,
      fontSize: 12,
      color: "#6B7280",
      textAlign: "center",
      lineHeight: 18,
      marginBottom: spacing.lg,
    },

    professionalSectionTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: "#111827",
      borderBottomWidth: 1,
      borderBottomColor: "#D1D5DB",
      paddingBottom: 6,
      marginBottom: spacing.sm,
      textTransform: "uppercase",
    },

    professionalText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    professionalEntryTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "800",
      color: "#111827",
    },

    professionalSubtitle: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: "600",
      color: "#4B5563",
    },

    professionalMeta: {
      fontSize: 12,
      fontWeight: "700",
      color: "#6B7280",
    },

    professionalBullet: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    minimalCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },

    minimalName: {
      fontSize: 28,
      fontWeight: "800",
      color: "#111827",
    },

    minimalRole: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: "600",
      color: "#374151",
    },

    minimalContact: {
      marginTop: 8,
      fontSize: 12,
      color: "#6B7280",
      lineHeight: 18,
      marginBottom: spacing.lg,
    },

    minimalSectionTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: "#111827",
      marginBottom: spacing.sm,
      textTransform: "uppercase",
    },

    minimalText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    minimalEntryTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: "#111827",
    },

    minimalMeta: {
      marginTop: 4,
      fontSize: 12,
      color: "#6B7280",
    },

    minimalBullet: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    executiveCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: "#D1D5DB",
    },

    executiveName: {
      fontSize: 30,
      fontWeight: "900",
      color: "#111827",
      textAlign: "center",
    },

    executiveRole: {
      marginTop: 6,
      fontSize: 15,
      fontWeight: "700",
      color: "#1F2937",
      textAlign: "center",
    },

    executiveContact: {
      marginTop: 8,
      marginBottom: spacing.lg,
      fontSize: 12,
      color: "#6B7280",
      textAlign: "center",
      lineHeight: 18,
    },

    executiveSectionTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: "#111827",
      marginBottom: spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },

    executiveText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    executiveEntryTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "800",
      color: "#111827",
    },

    executiveSubtitle: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: "600",
      color: "#4B5563",
    },

    executiveMeta: {
      fontSize: 12,
      fontWeight: "700",
      color: "#6B7280",
    },

    executiveBullet: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    compactCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },

    compactName: {
      fontSize: 24,
      fontWeight: "900",
      color: "#111827",
    },

    compactRole: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: "700",
      color: "#374151",
    },

    compactContact: {
      marginTop: 6,
      marginBottom: spacing.md,
      fontSize: 11,
      lineHeight: 16,
      color: "#6B7280",
    },

    compactSectionTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: "#111827",
      marginBottom: spacing.xs,
      textTransform: "uppercase",
    },

    compactText: {
      fontSize: 13,
      lineHeight: 20,
      color: "#374151",
    },

    compactEntryBlock: {
      marginBottom: spacing.sm,
    },

    compactEntryTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: "#111827",
    },

    compactMeta: {
      marginTop: 3,
      fontSize: 11,
      color: "#6B7280",
    },

    compactBullet: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 19,
      color: "#374151",
    },

    sidebarCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      flexDirection: "row",
      backgroundColor: "#FFFFFF",
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#E5E7EB",
      overflow: "hidden",
    },

    sidebarLeft: {
      width: 120,
      backgroundColor: "#111827",
      padding: spacing.lg,
    },

    sidebarRight: {
      flex: 1,
      padding: spacing.lg,
    },

    sidebarName: {
      fontSize: 22,
      fontWeight: "900",
      color: "#FFFFFF",
    },

    sidebarRole: {
      marginTop: 6,
      fontSize: 13,
      fontWeight: "700",
      color: "#C7D2FE",
      marginBottom: spacing.lg,
    },

    sidebarSideHeading: {
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      fontSize: 12,
      fontWeight: "900",
      color: "#FFFFFF",
      textTransform: "uppercase",
    },

    sidebarSideText: {
      fontSize: 12,
      lineHeight: 18,
      color: "#D1D5DB",
      marginBottom: 4,
    },

    sidebarSectionTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: "#111827",
      textTransform: "uppercase",
      marginBottom: spacing.sm,
    },

    sidebarText: {
      fontSize: 13,
      lineHeight: 20,
      color: "#374151",
    },

    sidebarEntryTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: "#111827",
    },

    sidebarSubtitle: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "600",
      color: "#4B5563",
    },

    sidebarMeta: {
      marginTop: 4,
      fontSize: 11,
      color: "#6B7280",
    },

    sidebarBullet: {
      marginTop: 5,
      fontSize: 13,
      lineHeight: 20,
      color: "#374151",
    },

    elegantCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#FFFBF7",
      borderRadius: 24,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: "#F3E8D7",
    },

    elegantName: {
      fontSize: 28,
      fontWeight: "900",
      color: "#3F2D20",
      textAlign: "center",
    },

    elegantRole: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: "700",
      color: "#8B5E3C",
      textAlign: "center",
    },

    elegantContact: {
      marginTop: 8,
      marginBottom: spacing.lg,
      fontSize: 12,
      lineHeight: 18,
      color: "#7C6A58",
      textAlign: "center",
    },

    elegantSectionTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: "#8B5E3C",
      marginBottom: spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },

    elegantText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#4B3A2F",
    },

    elegantEntryTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "800",
      color: "#3F2D20",
    },

    elegantSubtitle: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: "600",
      color: "#7C6A58",
    },

    elegantMeta: {
      fontSize: 12,
      fontWeight: "700",
      color: "#8B5E3C",
    },

    elegantBullet: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 22,
      color: "#4B3A2F",
    },

    creativeCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#F8FAFC",
      borderRadius: 24,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: "#E2E8F0",
    },

    creativeTop: {
      backgroundColor: "#4F46E5",
      borderRadius: 18,
      padding: spacing.lg,
      marginBottom: spacing.md,
    },

    creativeName: {
      fontSize: 26,
      fontWeight: "900",
      color: "#FFFFFF",
    },

    creativeRole: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: "700",
      color: "#E0E7FF",
    },

    creativeContact: {
      fontSize: 12,
      lineHeight: 18,
      color: "#64748B",
      marginBottom: spacing.lg,
    },

    creativeSectionTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: "#4F46E5",
      marginBottom: spacing.sm,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },

    creativeText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#334155",
    },

    creativeEntryTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: "#0F172A",
    },

    creativeMeta: {
      marginTop: 4,
      fontSize: 12,
      color: "#64748B",
    },

    creativeBullet: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 22,
      color: "#334155",
    },

    photoCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      padding: spacing.xl,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },

    photoHeader: {
      flexDirection: "row",
      gap: spacing.lg,
      alignItems: "center",
      marginBottom: spacing.lg,
    },

    photoCircle: {
      width: 82,
      height: 82,
      borderRadius: 999,
      backgroundColor: "#E5E7EB",
    },

    photoName: {
      fontSize: 24,
      fontWeight: "900",
      color: "#111827",
    },

    photoRole: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: "700",
      color: "#374151",
    },

    photoContact: {
      marginTop: 8,
      fontSize: 12,
      lineHeight: 18,
      color: "#6B7280",
    },

    photoSectionTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: "#111827",
      textTransform: "uppercase",
      marginBottom: spacing.sm,
    },

    photoText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    photoEntryTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: "#111827",
    },

    photoMeta: {
      marginTop: 4,
      fontSize: 12,
      color: "#6B7280",
    },

    photoBullet: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    singlePageCard: {
      width: "100%",
      maxWidth: 420,
      alignSelf: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },

    singlePageName: {
      fontSize: 24,
      fontWeight: "900",
      color: "#111827",
      textAlign: "center",
    },

    singlePageRole: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: "700",
      color: "#374151",
      textAlign: "center",
    },

    singlePageContact: {
      marginTop: 6,
      marginBottom: spacing.md,
      fontSize: 11,
      lineHeight: 16,
      color: "#6B7280",
      textAlign: "center",
    },

    singlePageSectionTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: "#111827",
      marginBottom: spacing.xs,
      textTransform: "uppercase",
    },

    singlePageText: {
      fontSize: 13,
      lineHeight: 19,
      color: "#374151",
    },

    singlePageEntryTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: "#111827",
    },

    singlePageMeta: {
      marginTop: 3,
      fontSize: 11,
      color: "#6B7280",
    },

    singlePageBullet: {
      marginTop: 4,
      fontSize: 13,
      lineHeight: 18,
      color: "#374151",
    },

    entryBlock: {
      marginBottom: spacing.md,
    },

    entryTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing.md,
    },

    entryTitle: {
      flex: 1,
      fontSize: 15,
      fontWeight: "800",
      color: "#111827",
    },

    entrySubtitle: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: "600",
      color: "#4B5563",
    },

    entryMeta: {
      fontSize: 12,
      fontWeight: "700",
      color: "#6B7280",
    },

    bulletText: {
      marginTop: 6,
      fontSize: 14,
      lineHeight: 22,
      color: "#374151",
    },

    skillsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
  });