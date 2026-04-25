export interface ParsedResume {
  name: string;
  contact: string[];
  summary: string;
  sections: {
    title: string;
    content: string[];
  }[];
}

const SECTION_KEYWORDS = new Set([
  "experience", "education", "skills", "summary", "objective",
  "projects", "certifications", "awards", "publications", "languages",
  "interests", "references", "contact", "profile", "achievements",
  "volunteer", "work history", "professional experience", "technical skills",
  "work experience", "career objective", "about me",
]);

function isSectionHeader(line: string): boolean {
  const s = line.trim().toLowerCase().replace(/:$/, "");
  if (SECTION_KEYWORDS.has(s)) return true;
  const stripped = line.trim();
  if (stripped.length > 0 && stripped === stripped.toUpperCase() && stripped.split(" ").length <= 5) {
    return true;
  }
  return false;
}

export function parseResumeText(text: string): ParsedResume {
  const result: ParsedResume = {
    name: "John Doe", // fallback
    contact: [],
    summary: "",
    sections: [],
  };

  if (!text || !text.trim()) return result;

  const lines = text.split("\n").map(l => l.trim());
  let currentSection = "";
  let currentContent: string[] = [];
  
  let headerBlock = true;
  let nameFound = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line) {
      if (headerBlock && currentContent.length > 0) {
        headerBlock = false;
      }
      continue;
    }

    if (isSectionHeader(line)) {
      headerBlock = false;
      
      // Save previous section
      if (currentSection) {
        if (currentSection.toLowerCase().includes("summary") || currentSection.toLowerCase().includes("profile")) {
          result.summary = currentContent.join("\n");
        } else {
          result.sections.push({ title: currentSection, content: [...currentContent] });
        }
      }
      
      currentSection = line.replace(/:$/, "");
      currentContent = [];
      continue;
    }

    if (headerBlock) {
      if (!nameFound) {
        result.name = line;
        nameFound = true;
      } else {
        result.contact.push(line);
      }
    } else {
      if (!currentSection) {
        // If we hit content but no section yet, maybe it's still header or summary
        if (currentContent.length === 0 && line.length > 50) {
           currentSection = "Summary";
        }
      }
      currentContent.push(line);
    }
  }

  // push last section
  if (currentSection) {
    if (currentSection.toLowerCase().includes("summary") || currentSection.toLowerCase().includes("profile")) {
      result.summary = (result.summary ? result.summary + "\n" : "") + currentContent.join("\n");
    } else {
      result.sections.push({ title: currentSection, content: [...currentContent] });
    }
  } else if (!headerBlock && currentContent.length > 0) {
    result.summary = currentContent.join("\n");
  }

  return result;
}
