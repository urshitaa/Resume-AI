import { ParsedResume } from "./resumeParser";

export function mapToJsonResume(parsed: ParsedResume) {
  // Try to parse out email, phone, location from contact info
  let email = "";
  let phone = "";
  let address = "";
  let website = "";

  parsed.contact.forEach((c) => {
    if (c.includes("@")) email = c;
    else if (/\d{3,}/.test(c)) phone = c;
    else if (c.includes("http") || c.includes("www")) website = c;
    else address = c;
  });

  const basics = {
    name: parsed.name || "John Doe",
    label: "Professional",
    image: "",
    email: email,
    phone: phone,
    url: website,
    summary: parsed.summary || "",
    location: {
      address: address,
      postalCode: "",
      city: address.split(",")[0] || "",
      countryCode: "",
      region: ""
    },
    profiles: []
  };

  const work: any[] = [];
  const education: any[] = [];
  const skills: any[] = [];

  // Very rudimentary mapping of sections
  parsed.sections.forEach((section) => {
    const title = section.title.toLowerCase();
    
    if (title.includes("experience") || title.includes("work")) {
      // Dump the whole text into a single work entry for display
      work.push({
        name: "Experience",
        position: "Professional Experience",
        url: "",
        startDate: "",
        endDate: "",
        summary: section.content.join("\n"),
        highlights: []
      });
    } else if (title.includes("education") || title.includes("degree")) {
      education.push({
        institution: "Education",
        url: "",
        area: "Degree",
        studyType: "",
        startDate: "",
        endDate: "",
        score: "",
        courses: section.content
      });
    } else if (title.includes("skill") || title.includes("technolog")) {
      skills.push({
        name: section.title,
        level: "",
        keywords: section.content.map(c => c.replace(/^[-•*]\s*/, ""))
      });
    } else {
      // Put everything else in work as well just so it shows up on the profile
      work.push({
        name: section.title,
        position: "",
        summary: section.content.join("\n"),
        highlights: []
      });
    }
  });

  return {
    basics,
    work,
    volunteer: [],
    education,
    awards: [],
    publications: [],
    skills,
    languages: [],
    interests: [],
    references: [],
    projects: []
  };
}
