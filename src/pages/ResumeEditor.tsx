import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Wand2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import GradientButton from "@/components/GradientButton";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api } from "@/lib/api";

const ResumeEditor = () => {
  const [originalText, setOriginalText] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [improving, setImproving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleImprove = async () => {
    if (!originalText.trim() || !jobDesc.trim()) return;
    setImproving(true);
    setError("");
    try {
      const { improved_text } = await api.improveResume(originalText, jobDesc);
      setImprovedText(improved_text);
    } catch (err: any) {
      setError(err.message || "Improvement failed");
    } finally {
      setImproving(false);
    }
  };

  const handleDownload = async () => {
    setGenerating(true);
    setError("");
    try {
      const blob = await api.generatePDF(improvedText || originalText);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume-improved.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "PDF generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold font-heading">
            Resume <span className="gradient-text">Editor</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Paste your resume text, provide a target job description, and let AI enhance it.
          </p>
        </motion.div>

        <div className="mb-6">
          <GlassCard>
            <label className="mb-2 block text-sm font-medium">Target Job Description</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste the job description you want to optimize for..."
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="h-full">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold font-heading">Original Resume</h2>
              </div>
              <textarea
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste your current resume text here..."
                rows={20}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono"
              />
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="h-full">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold font-heading">
                  Improved Resume
                  {improvedText && <span className="ml-2 text-sm text-green-600 dark:text-green-400">✓ AI Enhanced</span>}
                </h2>
              </div>
              {improving ? (
                <div className="flex h-96 items-center justify-center">
                  <LoaderSpinner text="AI is enhancing your resume..." />
                </div>
              ) : (
                <textarea
                  value={improvedText}
                  onChange={(e) => setImprovedText(e.target.value)}
                  placeholder="Improved resume will appear here..."
                  rows={20}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono"
                />
              )}
            </GlassCard>
          </motion.div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <GradientButton
            onClick={handleImprove}
            disabled={!originalText.trim() || !jobDesc.trim() || improving}
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {improving ? "Improving..." : "AI Improve Resume"}
          </GradientButton>
          <GradientButton
            variant="outline"
            onClick={handleDownload}
            disabled={(!improvedText && !originalText) || generating}
          >
            <Download className="mr-2 h-4 w-4" />
            {generating ? "Generating PDF..." : "Download PDF"}
          </GradientButton>
        </div>
      </main>
    </div>
  );
};

export default ResumeEditor;
