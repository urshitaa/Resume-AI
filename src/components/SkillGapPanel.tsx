import { ExternalLink, BookOpen } from "lucide-react";
import GlassCard from "./GlassCard";

interface SkillGapPanelProps {
  missingSkills: string[];
}

const COURSES_DB: Record<string, { title: string; url: string; platform: string }> = {
  "react": { title: "Advanced React Patterns", url: "https://react.dev/learn", platform: "React Docs" },
  "typescript": { title: "TypeScript Masterclass", url: "https://www.typescriptlang.org/", platform: "TypeScript" },
  "python": { title: "Python for Data Science", url: "https://www.python.org/", platform: "Python.org" },
  "aws": { title: "AWS Certified Solutions Architect", url: "https://aws.amazon.com/training/", platform: "AWS Training" },
  "docker": { title: "Docker Mastery", url: "https://docs.docker.com/", platform: "Docker Docs" },
};

const SkillGapPanel = ({ missingSkills }: SkillGapPanelProps) => {
  if (!missingSkills || missingSkills.length === 0) return null;

  return (
    <GlassCard className="w-full">
      <h3 className="mb-4 text-lg font-semibold font-heading flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" /> Skill Gap Analysis
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Based on the job description, here are recommended resources to bridge your skill gaps:
      </p>
      <div className="space-y-3">
        {missingSkills.map((skill) => {
          const course = COURSES_DB[skill.toLowerCase()] || {
            title: `Learn ${skill}`,
            url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
            platform: "Coursera",
          };

          return (
            <a
              key={skill}
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors border border-border group"
            >
              <div>
                <p className="font-medium text-sm text-foreground">{course.title}</p>
                <p className="text-xs text-muted-foreground">{course.platform} • For '{skill}'</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default SkillGapPanel;
