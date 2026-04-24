import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, X, Check, Copy } from "lucide-react";
import GradientButton from "./GradientButton";
import LoaderSpinner from "./LoaderSpinner";
import { api } from "@/lib/api";

interface BulletImproverDialogProps {
  selectedText: string;
  jobDescription: string;
  onClose: () => void;
  onReplace: (newText: string) => void;
}

const BulletImproverDialog = ({ selectedText, jobDescription, onClose, onReplace }: BulletImproverDialogProps) => {
  const [improvedText, setImprovedText] = useState("");
  const [improving, setImproving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedText && jobDescription) {
      handleImprove();
    }
  }, []);

  const handleImprove = async () => {
    if (!selectedText.trim() || !jobDescription.trim()) return;
    setImproving(true);
    setError("");
    try {
      const result = await api.improveBullet(selectedText, jobDescription);
      setImprovedText(result.improved_bullet);
    } catch (err: any) {
      setError(err.message || "Failed to improve bullet");
    } finally {
      setImproving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl bg-card border border-border shadow-lg rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" /> AI Bullet Improver
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Original Bullet Point</p>
              <div className="p-4 bg-muted rounded-lg text-sm font-mono whitespace-pre-wrap border border-border">
                {selectedText}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">AI Suggested Improvement</p>
              <div className="p-4 bg-primary/5 rounded-lg text-sm font-mono whitespace-pre-wrap border border-primary/20 min-h-[100px] relative">
                {improving ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoaderSpinner text="Crafting perfect bullet point..." />
                  </div>
                ) : error ? (
                  <span className="text-destructive">{error}</span>
                ) : (
                  improvedText
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleImprove}
                disabled={improving}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg"
              >
                Retry
              </button>
              <GradientButton
                onClick={() => onReplace(improvedText)}
                disabled={improving || !improvedText}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" /> Replace
              </GradientButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulletImproverDialog;
