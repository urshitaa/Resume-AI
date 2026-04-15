import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import { api, type ResumeVersion } from "@/lib/api";

const HistoryPage = () => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);

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
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
