import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { api, type ResumeVersion } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const HistoryPage = () => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersion | null>(null);

  useEffect(() => {
    api
      .getHistory()
      .then(setVersions)
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-heading mb-2">
            Resume <span className="gradient-text">History</span>
          </h1>
          <p className="text-muted-foreground mb-8">Track your resume versions and ATS scores over time.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
        ) : versions.length === 0 ? (
          <GlassCard className="text-center py-16">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No history yet</h2>
            <p className="text-muted-foreground">
              Upload and analyze your first resume to start tracking versions.
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {versions.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div onClick={() => setSelectedVersion(v)} className="cursor-pointer block">
                  <GlassCard hover className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="gradient-bg flex h-10 w-10 items-center justify-center rounded-lg">
                      <FileText className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">{v.filename}</p>
                      <p className="text-sm text-muted-foreground">{new Date(v.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  {v.ats_score !== undefined && (
                    <div className="text-right">
                      <span className="text-2xl font-bold gradient-text">{v.ats_score}</span>
                      <span className="text-sm text-muted-foreground block">ATS Score</span>
                    </div>
                  )}
                </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!selectedVersion} onOpenChange={(open) => !open && setSelectedVersion(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedVersion?.filename}</DialogTitle>
            <p className="text-sm text-muted-foreground">{selectedVersion ? new Date(selectedVersion.created_at).toLocaleString() : ""}</p>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto mt-4 pr-2 custom-scrollbar">
            <pre className="whitespace-pre-wrap text-sm font-mono text-foreground bg-muted p-6 rounded-lg border border-border shadow-inner">
              {selectedVersion?.improved_text || "No text available for this version."}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HistoryPage;
