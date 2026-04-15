const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || "Request failed");
  }
  return res.json();
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
  id: string;
  filename: string;
  created_at: string;
  ats_score?: number;
}

export const api = {
  health: () => request<{ status: string }>("/health"),

  uploadResume: async (file: File): Promise<{ text: string; filename: string }> => {
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

  scrapeJob: (url: string): Promise<{ text: string }> =>
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
    const res = await fetch(`${API_BASE}/api/resume/generate-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume_text: resumeText }),
    });
    if (!res.ok) throw new Error("PDF generation failed");
    return res.blob();
  },

  getHistory: (): Promise<ResumeVersion[]> =>
    request("/api/history"),
};
