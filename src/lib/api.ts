const API_BASE = ("https://resume-ai-ipzm.onrender.com").replace(/\/+$/, "");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      mode: "cors",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail || `Request failed with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Network request failed: ${error.message}`);
    }
    throw new Error("Network request failed.");
  }
}

export interface ATSResult {
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  section_scores: Record<string, number>;
  suggestions: string[];
  explanation: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ResumeVersion {
  id: number;
  filename: string;
  created_at: string;
  improved_text?: string;
  ats_score?: number;
}

export interface AnalysisHistory {
  id: number;
  ats_score: number;
  created_at: string;
}

export interface SimilarJob {
  title: string;
  company?: string;
  details: string;
  url?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  feedback: string;
  created_at: string;
}

export const api = {
  login: (email: string, password: string): Promise<{ access_token: string }> =>
    request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string): Promise<{ access_token: string }> =>
    request("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }),

  health: () => request<{ status: string }>("/health"),

  uploadResume: async (file: File): Promise<{ text: string; filename: string, resume_id: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/api/resume/upload", { method: "POST", body: formData });
  },

  analyzeATS: (resumeText: string, jobDescription: string): Promise<ATSResult> =>
    request("/api/ats/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
    }),

  scrapeJob: (url: string): Promise<{ text: string; company_info?: string; similar_jobs?: SimilarJob[] }> =>
    request("/api/job/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }),

  chat: (messages: ChatMessage[], resumeContext?: string): Promise<{ reply: string }> =>
    request("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, resume_context: resumeContext }),
    }),

  improveResume: (resumeText: string, jobDescription: string): Promise<{ improved_text: string }> =>
    request("/api/resume/improve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
    }),

  generatePDF: async (resumeText: string): Promise<Blob> => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/api/resume/generate-pdf`, {
      method: "POST",
      headers,
      body: JSON.stringify({ resume_text: resumeText }),
    });
    if (!res.ok) throw new Error("PDF generation failed");
    return res.blob();
  },

  getHistory: (): Promise<ResumeVersion[]> =>
    request("/api/history/versions"),

  getAtsHistory: (): Promise<AnalysisHistory[]> =>
    request("/api/history/ats"),

  improveBullet: (bulletText: string, jobDescription: string): Promise<{ improved_bullet: string }> =>
    request("/api/resume/improve-bullet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bullet_text: bulletText, job_description: jobDescription }),
    }),

  saveResumeVersion: (resumeId: number, improvedText: string): Promise<{ message: string, version_id: number }> =>
    request("/api/resume/save-version", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_id: resumeId, improved_text: improvedText }),
    }),

  submitTestimonial: (data: { name: string; email: string; rating: number; feedback: string }): Promise<Testimonial> =>
    request("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getTestimonials: (): Promise<Testimonial[]> =>
    request("/api/testimonials"),
};
