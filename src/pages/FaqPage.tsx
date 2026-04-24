import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { HelpCircle, FileSearch, ShieldCheck } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How does the ATS score get calculated?",
    answer: "Our AI model compares your resume against the provided job description across 5 key areas: Semantic Match, Skill Coverage, Keyword Overlap, Experience Level, and Formatting Quality. These are weighted to generate an overall compatibility score out of 100."
  },
  {
    question: "What makes a resume 'ATS-friendly'?",
    answer: "An ATS-friendly resume avoids complex tables, images, and weird fonts. It uses clear section headers (like 'Experience', 'Education', 'Skills') and standard bullet points. Our AI Bullet Improver helps rewrite your text so the ATS can parse your achievements effectively."
  },
  {
    question: "Does the AI fabricate information on my resume?",
    answer: "No. The AI is strictly instructed to only enhance, rephrase, and restructure what already exists in your original resume. It improves the phrasing using action verbs and quantifiable metrics if implied, but never invents fake experience."
  },
  {
    question: "Can I download my improved resume?",
    answer: "Yes! Once you are happy with the improvements in the Resume Editor, you can download it as an ATS-friendly text file or generate a formatted PDF."
  },
  {
    question: "How is my data handled?",
    answer: "Your uploaded resumes and job descriptions are processed securely. The extracted text is saved securely in your version history so you can track improvements over time."
  }
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="gradient-bg flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shadow-primary/20">
              <HelpCircle className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-heading mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about optimizing your resume and landing your dream job.
          </p>
        </motion.div>

        <div className="space-y-6">
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="hover:border-primary/50 transition-colors">
                <h3 className="text-lg font-semibold mb-2 flex items-start gap-2">
                  <span className="text-primary mt-1">•</span> {item.question}
                </h3>
                <p className="text-muted-foreground ml-4">{item.answer}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <GlassCard className="text-center py-8">
            <FileSearch className="h-10 w-10 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Smart Analysis</h4>
            <p className="text-sm text-muted-foreground">Deep dive into your skills gap and get actionable insights.</p>
          </GlassCard>
          <GlassCard className="text-center py-8">
            <ShieldCheck className="h-10 w-10 text-primary mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Privacy First</h4>
            <p className="text-sm text-muted-foreground">Your career history belongs to you. We handle it with care.</p>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
};

export default FaqPage;
