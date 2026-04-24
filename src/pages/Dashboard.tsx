import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import Footer from "../pages/Footer";

import { Radar, Line, Doughnut } from "react-chartjs-2";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import GradientButton from "@/components/GradientButton";
import UploadDropzone from "@/components/UploadDropzone";
import ScoreCircle from "@/components/ScoreCircle";
import SkillTag from "@/components/SkillTag";
import LoaderSpinner from "@/components/LoaderSpinner";
import ATSBreakdownPanel from "@/components/ATSBreakdownPanel";
import SkillGapPanel from "@/components/SkillGapPanel";
import { api, type ATSResult, type AnalysisHistory, type SimilarJob } from "@/lib/api";
import {
  ArrowRight, Link as LinkIcon, FileText, TrendingUp, Building, Briefcase,
  ExternalLink, CheckCircle2, XCircle, Lightbulb, ThumbsUp, ThumbsDown
} from "lucide-react";


ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler, CategoryScale, LinearScale, BarElement);

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Dashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [useUrl, setUseUrl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [companyInfo, setCompanyInfo] = useState<string>("");
  const [similarJobs, setSimilarJobs] = useState<SimilarJob[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.getAtsHistory();
      console.log("History Data", data);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleUpload = async (f: File) => {
    setFile(f);
    setUploading(true);
    setError("");
    try {
      const data = await api.uploadResume(f);
      console.log("Upload Data", data);
      setResumeText(data.text);
      console.log("Resume Text", data.text);
    } catch (err: any) {
      setError("Error found during uploading " + err);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    console.log("CLICK WORKING");
    setAnalyzing(true);
    setError("");
    try {
      let description = jobDesc;
      console.log("URL outside", jobUrl, useUrl);
      if (useUrl && jobUrl) {
        console.log("URL", jobUrl);
        const scraped = await api.scrapeJob(jobUrl);
        console.log("Scraped Data", scraped);
        description = scraped.text;
        console.log("Scraped Description", description);
        setJobDesc(description);
        setCompanyInfo(scraped.company_info || "");
        setSimilarJobs(scraped.similar_jobs || []);
      } else {
        setCompanyInfo("");
        setSimilarJobs([]);
      }
      const data = await api.analyzeATS(resumeText, description);
      console.log("Anylysed Data ", data);
      setResult(data);
      fetchHistory(); // Refresh history after new analysis
    } catch (err: any) {
      setError(err.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const radarData = result
    ? {
      labels: Object.keys(result.section_scores),
      datasets: [
        {
          label: "Section Scores",
          data: Object.values(result.section_scores),
          backgroundColor: "rgba(249, 115, 22, 0.15)",
          borderColor: "#F97316",
          borderWidth: 2,
          pointBackgroundColor: "#F97316",
        },
      ],
    }
    : null;

  const lineData = history.length > 0
    ? {
      labels: history.map((h) => new Date(h.created_at).toLocaleDateString()),
      datasets: [
        {
          label: "ATS Score Trend",
          data: history.map((h) => h.ats_score),
          borderColor: "#F97316",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    }
    : null;

  const doughnutData = result
    ? {
      labels: ["Matched Skills", "Missing Skills"],
      datasets: [
        {
          data: [result.matched_skills.length, result.missing_skills.length],
          backgroundColor: ["#22C55E", "#EF4444"],
          borderWidth: 0,
        },
      ],
    }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8">
        <motion.div {...fadeIn} className="mb-8 text-center">
          <h1 className="text-4xl font-bold font-heading md:text-5xl">
            AI Resume <span className="gradient-text">Analyzer</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume, paste a job description, and get an instant ATS compatibility score with actionable insights.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
            <GlassCard>
              <h2 className="mb-4 text-lg font-semibold font-heading flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Upload Resume
              </h2>
              <UploadDropzone onFileAccepted={handleUpload} acceptedFile={file} isUploading={uploading} />
              {resumeText && (
                <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ Resume extracted successfully
                </p>
              )}
            </GlassCard>
          </motion.div>

          <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
            <GlassCard>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold font-heading">Job Description</h2>
                <button
                  onClick={() => setUseUrl(!useUrl)}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <LinkIcon className="h-4 w-4" />
                  {useUrl ? "Paste text" : "Use URL"}
                </button>
              </div>
              {useUrl ? (
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://example.com/job-posting"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              ) : (
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              )}
              <GradientButton
                className="mt-4 w-full"
                disabled={!file || analyzing}
                onClick={handleAnalyze}
              >
                {analyzing ? "Analyzing..." : "Analyze Match"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </GradientButton>
            </GlassCard>
          </motion.div>
        </div>

        {error && (
          <motion.div {...fadeIn} className="mt-6">
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
              {error}
            </div>
          </motion.div>
        )}

        {analyzing && (
          <motion.div {...fadeIn} className="mt-12 flex justify-center">
            <LoaderSpinner text="Analyzing your resume..." />
          </motion.div>
        )}

        <AnimatePresence>
          {result && !analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12 space-y-8"
            >
              {/* ── Score + Summary ── */}
              <div className="grid gap-6 md:grid-cols-3">
                <GlassCard className="flex flex-col items-center justify-center py-8">
                  <ScoreCircle score={result.ats_score} />
                </GlassCard>

                <GlassCard className="md:col-span-2">
                  <h3 className="mb-3 text-lg font-semibold font-heading">Analysis Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
                </GlassCard>
              </div>

              {/* ── Should You Apply? ── */}
              {(() => {
                const shouldApply = result.missing_skills.length < 4;
                return (
                  <GlassCard>
                    <h3 className="mb-4 text-lg font-semibold font-heading flex items-center gap-2">
                      {shouldApply
                        ? <ThumbsUp className="h-5 w-5 text-green-500" />
                        : <ThumbsDown className="h-5 w-5 text-red-500" />}
                      Should You Apply?
                    </h3>
                    <div className={`rounded-xl p-5 flex items-start gap-4 ${shouldApply
                        ? "bg-green-500/10 border border-green-500/20"
                        : "bg-red-500/10 border border-red-500/20"
                      }`}>
                      {shouldApply
                        ? <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0 mt-0.5" />
                        : <XCircle className="h-8 w-8 text-red-500 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className={`text-xl font-bold mb-1 ${shouldApply ? "text-green-500" : "text-red-500"
                          }`}>
                          {shouldApply ? "Yes, Go for it!" : "Not Yet"}
                        </p>
                        {shouldApply ? (
                          <p className="text-sm text-muted-foreground">
                            You match well with this role — only {result.missing_skills.length} skill{result.missing_skills.length !== 1 ? "s" : ""} missing. Apply with confidence!
                          </p>
                        ) : (
                          <div>
                            <p className="text-sm text-muted-foreground mb-3">
                              You have {result.missing_skills.length} missing skills. Consider building these before applying:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {result.missing_skills.map((s) => (
                                <span key={s} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-red-500/20 text-red-500 border border-red-500/30">
                                  <XCircle className="h-3 w-3" /> {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })()}

              {/* ── Suggestions ── */}
              {result.suggestions.length > 0 && (
                <GlassCard>
                  <h3 className="mb-4 text-lg font-semibold font-heading flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" /> Suggestions to Improve Your Match
                  </h3>
                  <div className="space-y-3">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg bg-muted/30 border border-border/50 p-3">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="text-sm">{s}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* ── Matched / Missing Skills ── */}

              <div className="grid gap-6 md:grid-cols-2">
                <GlassCard>
                  <h3 className="mb-3 text-lg font-semibold font-heading text-green-600 dark:text-green-400">
                    Matched Skills ({result.matched_skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_skills.map((s) => (
                      <SkillTag key={s} label={s} variant="matched" />
                    ))}
                  </div>
                </GlassCard>
                <GlassCard>
                  <h3 className="mb-3 text-lg font-semibold font-heading text-red-600 dark:text-red-400">
                    Missing Skills ({result.missing_skills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((s) => (
                      <SkillTag key={s} label={s} variant="missing" />
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <ATSBreakdownPanel scores={result.section_scores as any} />
                <SkillGapPanel missingSkills={result.missing_skills} />
              </div>


              {/* ── Company Info + Similar Jobs ── */}
              {(companyInfo || similarJobs.length > 0) && (
                <div className="grid gap-6 md:grid-cols-2">
                  {companyInfo && (
                    <GlassCard>
                      <h3 className="mb-3 text-lg font-semibold font-heading flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" /> About the Company
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{companyInfo}</p>
                    </GlassCard>
                  )}
                  {similarJobs.length > 0 && (
                    <GlassCard>
                      <h3 className="mb-3 text-lg font-semibold font-heading flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" /> Similar Jobs
                      </h3>
                      <div className="space-y-3">
                        {similarJobs.map((job, i) => (
                          <div key={i} className="rounded-lg border border-border/50 bg-muted/20 p-4 hover:bg-muted/40 transition-colors">
                            <h4 className="font-semibold text-sm">{job.title}</h4>
                            {job.company && (
                              <p className="text-xs text-primary mt-0.5">{job.company}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1 mb-2">{job.details}</p>
                            {job.url && (
                              <a href={job.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                                View Job <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  )}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {radarData && (
                  <GlassCard>
                    <h3 className="mb-3 text-lg font-semibold font-heading">Radar Overview</h3>
                    <Radar data={radarData} options={{ scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }} />
                  </GlassCard>
                )}
                {doughnutData && (
                  <GlassCard>
                    <h3 className="mb-3 text-lg font-semibold font-heading">Skills Coverage</h3>
                    <Doughnut data={doughnutData} options={{ plugins: { legend: { position: "bottom" } } }} />
                  </GlassCard>
                )}
                {lineData && (
                  <GlassCard className="lg:col-span-1 md:col-span-2">
                    <h3 className="mb-3 text-lg font-semibold font-heading flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" /> Score Trend
                    </h3>
                    <div className="h-48 w-full">
                      <Line data={lineData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }} />
                    </div>
                  </GlassCard>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;


// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";
// import { Radar, Bar, Doughnut } from "react-chartjs-2";
// import Navbar from "@/components/Navbar";
// import GlassCard from "@/components/GlassCard";
// import GradientButton from "@/components/GradientButton";
// import UploadDropzone from "@/components/UploadDropzone";
// import ScoreCircle from "@/components/ScoreCircle";
// import SkillTag from "@/components/SkillTag";
// import LoaderSpinner from "@/components/LoaderSpinner";
// import { api, type ATSResult } from "@/lib/api";
// import { ArrowRight, Link as LinkIcon, FileText } from "lucide-react";

// ChartJS.register(ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler, CategoryScale, LinearScale, BarElement);

// const fadeIn = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.5 },
// };

// const Dashboard = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [resumeText, setResumeText] = useState("");
//   const [jobDesc, setJobDesc] = useState("");
//   const [jobUrl, setJobUrl] = useState("");
//   const [useUrl, setUseUrl] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [result, setResult] = useState<ATSResult | null>(null);
//   const [error, setError] = useState("");

//   const handleUpload = async (f: File) => {
//     setFile(f);
//     setUploading(true);
//     setError("");
//     try {
//       const data = await api.uploadResume(f);
//       setResumeText(data.text);
//     } catch (err: any) {
//       setError(err.message || "Failed to upload resume");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // FIX: Explicitly typed as React.MouseEventHandler to ensure proper event binding
//   const handleAnalyze = async () => {
//     console.log("CLICK WORKING");
//     setAnalyzing(true);
//     setError("");
//     try {
//       let description = jobDesc;
//       if (useUrl && jobUrl) {
//         const scraped = await api.scrapeJob(jobUrl);
//         description = scraped.text;
//         setJobDesc(description);
//       }
//       const data = await api.analyzeATS(resumeText, description);
//       setResult(data);
//     } catch (err: any) {
//       setError(err.message || "Analysis failed");
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   const radarData = result
//     ? {
//         labels: Object.keys(result.section_scores),
//         datasets: [
//           {
//             label: "Section Scores",
//             data: Object.values(result.section_scores),
//             backgroundColor: "rgba(249, 115, 22, 0.15)",
//             borderColor: "#F97316",
//             borderWidth: 2,
//             pointBackgroundColor: "#F97316",
//           },
//         ],
//       }
//     : null;

//   const barData = result
//     ? {
//         labels: ["Semantic", "Skills", "Keywords", "Experience", "Formatting"],
//         datasets: [
//           {
//             label: "Score Breakdown",
//             data: [
//               (result.section_scores["semantic"] ?? 0),
//               (result.section_scores["skills"] ?? 0),
//               (result.section_scores["keywords"] ?? 0),
//               (result.section_scores["experience"] ?? 0),
//               (result.section_scores["formatting"] ?? 0),
//             ],
//             backgroundColor: ["#F97316", "#FB923C", "#F59E0B", "#FCD34D", "#FDBA74"],
//             borderRadius: 8,
//           },
//         ],
//       }
//     : null;

//   const doughnutData = result
//     ? {
//         labels: ["Matched Skills", "Missing Skills"],
//         datasets: [
//           {
//             data: [result.matched_skills.length, result.missing_skills.length],
//             backgroundColor: ["#22C55E", "#EF4444"],
//             borderWidth: 0,
//           },
//         ],
//       }
//     : null;

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <main className="container py-8">
//         <motion.div {...fadeIn} className="mb-8 text-center">
//           <h1 className="text-4xl font-bold font-heading md:text-5xl">
//             AI Resume <span className="gradient-text">Analyzer</span>
//           </h1>
//           <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
//             Upload your resume, paste a job description, and get an instant ATS compatibility score with actionable insights.
//           </p>
//         </motion.div>

//         <div className="grid gap-8 lg:grid-cols-2">
//           <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
//             <GlassCard>
//               <h2 className="mb-4 text-lg font-semibold font-heading flex items-center gap-2">
//                 <FileText className="h-5 w-5 text-primary" /> Upload Resume
//               </h2>
//               <UploadDropzone onFileAccepted={handleUpload} acceptedFile={file} isUploading={uploading} />
//               {resumeText && (
//                 <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-medium">
//                   ✓ Resume extracted successfully
//                 </p>
//               )}
//             </GlassCard>
//           </motion.div>

//           <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
//             <GlassCard>
//               <div className="mb-4 flex items-center justify-between">
//                 <h2 className="text-lg font-semibold font-heading">Job Description</h2>
//                 <button
//                   type="button"
//                   onClick={() => setUseUrl(!useUrl)}
//                   className="flex items-center gap-1 text-sm text-primary hover:underline"
//                 >
//                   <LinkIcon className="h-4 w-4" />
//                   {useUrl ? "Paste text" : "Use URL"}
//                 </button>
//               </div>
//               {useUrl ? (
//                 <input
//                   type="url"
//                   value={jobUrl}
//                   onChange={(e) => setJobUrl(e.target.value)}
//                   placeholder="https://example.com/job-posting"
//                   className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
//                 />
//               ) : (
//                 <textarea
//                   value={jobDesc}
//                   onChange={(e) => setJobDesc(e.target.value)}
//                   placeholder="Paste the job description here..."
//                   rows={8}
//                   className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
//                 />
//               )}
//               {/* FIX: Explicit onClick prop, type="button" to prevent accidental form submission */}
//               <GradientButton
//                 type="button"
//                 className="mt-4 w-full"
//                 disabled={!resumeText || analyzing}
//                 onClick={handleAnalyze}
//               >
//                 {analyzing ? "Analyzing..." : "Analyze Match"}
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </GradientButton>
//             </GlassCard>
//           </motion.div>
//         </div>

//         {error && (
//           <motion.div {...fadeIn} className="mt-6">
//             <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
//               {error}
//             </div>
//           </motion.div>
//         )}

//         {analyzing && (
//           <motion.div {...fadeIn} className="mt-12 flex justify-center">
//             <LoaderSpinner text="Analyzing your resume..." />
//           </motion.div>
//         )}

//         <AnimatePresence>
//           {result && !analyzing && (
//             <motion.div
//               initial={{ opacity: 0, y: 40 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="mt-12 space-y-8"
//             >
//               <div className="grid gap-6 md:grid-cols-3">
//                 <GlassCard className="flex flex-col items-center justify-center py-8">
//                   <ScoreCircle score={result.ats_score} />
//                 </GlassCard>

//                 <GlassCard className="md:col-span-2">
//                   <h3 className="mb-3 text-lg font-semibold font-heading">Analysis Summary</h3>
//                   <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
//                   <div className="mt-4 space-y-2">
//                     {result.suggestions.map((s, i) => (
//                       <div key={i} className="flex items-start gap-2 text-sm">
//                         <span className="mt-0.5 text-primary">→</span>
//                         <span>{s}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </GlassCard>
//               </div>

//               <div className="grid gap-6 md:grid-cols-2">
//                 <GlassCard>
//                   <h3 className="mb-3 text-lg font-semibold font-heading text-green-600 dark:text-green-400">
//                     Matched Skills ({result.matched_skills.length})
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {result.matched_skills.map((s) => (
//                       <SkillTag key={s} label={s} variant="matched" />
//                     ))}
//                   </div>
//                 </GlassCard>
//                 <GlassCard>
//                   <h3 className="mb-3 text-lg font-semibold font-heading text-red-600 dark:text-red-400">
//                     Missing Skills ({result.missing_skills.length})
//                   </h3>
//                   <div className="flex flex-wrap gap-2">
//                     {result.missing_skills.map((s) => (
//                       <SkillTag key={s} label={s} variant="missing" />
//                     ))}
//                   </div>
//                 </GlassCard>
//               </div>

//               <div className="grid gap-6 md:grid-cols-3">
//                 {radarData && (
//                   <GlassCard>
//                     <h3 className="mb-3 text-lg font-semibold font-heading">Radar Overview</h3>
//                     <Radar data={radarData} options={{ scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }} />
//                   </GlassCard>
//                 )}
//                 {barData && (
//                   <GlassCard>
//                     <h3 className="mb-3 text-lg font-semibold font-heading">Score Breakdown</h3>
//                     <Bar data={barData} options={{ scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }} />
//                   </GlassCard>
//                 )}
//                 {doughnutData && (
//                   <GlassCard>
//                     <h3 className="mb-3 text-lg font-semibold font-heading">Skills Coverage</h3>
//                     <Doughnut data={doughnutData} options={{ plugins: { legend: { position: "bottom" } } }} />
//                   </GlassCard>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;