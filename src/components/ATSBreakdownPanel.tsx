import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

interface SectionScores {
  semantic: number;
  skills: number;
  keywords: number;
  experience: number;
  formatting: number;
}

const ProgressBar = ({ label, score }: { label: string; score: number }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm font-medium">
        <span>{label}</span>
        <span className={score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"}>
          {score}%
        </span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-2.5 rounded-full ${
            score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"
          }`}
        ></motion.div>
      </div>
    </div>
  );
};

const ATSBreakdownPanel = ({ scores }: { scores: SectionScores }) => {
  return (
    <GlassCard className="w-full">
      <h3 className="mb-4 text-lg font-semibold font-heading">Detailed Breakdown</h3>
      <ProgressBar label="Semantic Match" score={scores.semantic} />
      <ProgressBar label="Skills Coverage" score={scores.skills} />
      <ProgressBar label="Keyword Match" score={scores.keywords} />
      <ProgressBar label="Experience Level" score={scores.experience} />
      <ProgressBar label="Formatting Quality" score={scores.formatting} />
    </GlassCard>
  );
};

export default ATSBreakdownPanel;
