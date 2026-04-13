// src/config/api.js

// export const API_BASE_URL = "http://10.0.15.231:4000";

export const API_BASE_URL = "http://localhost:4000";

export async function registerApi({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data; // { token, user }
}

export async function verifyEmailApi({ email, otp }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Verification failed");
  }

  return data;
}

export async function loginApi({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data; // { token, user }
}

export async function forgotPasswordApi(email) {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function verifyForgotOtpApi({ email, otp }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "OTP verification failed");
  return data; // { message, resetToken }
}

export async function resetPasswordApi({ resetToken, newPassword }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetToken, newPassword }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Password reset failed");
  return data; // { message }
}

export async function analyzeResumeApi(file) {
  const formData = new FormData();

  formData.append("resume", {
    uri: file.uri,
    name: file.name || "resume.docx",
    type:
      file.type ||
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const response = await fetch("http://10.0.15.233:4000/api/resume/analyze", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Resume analysis failed");
  }

  return data;
}

export async function generateFixedResumeApi(file, analysis) {
  const response = await fetch("http://10.0.15.233:4000/api/resume/fix", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      fileName: file?.name,
      analysis,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate fixed resume");
  }

  return data;
}