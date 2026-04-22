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
import { Radar, Bar, Doughnut } from "react-chartjs-2";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import GradientButton from "@/components/GradientButton";
import UploadDropzone from "@/components/UploadDropzone";
import ScoreCircle from "@/components/ScoreCircle";
import SkillTag from "@/components/SkillTag";
import LoaderSpinner from "@/components/LoaderSpinner";
import { api, type ATSResult } from "@/lib/api";
import { ArrowRight, Link as LinkIcon, FileText } from "lucide-react";

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
  const [error, setError] = useState("");

  const handleUpload = async (f: File) => {
    setFile(f);
    setUploading(true);
    setError("");
    try {
      const data = await api.uploadResume(f);
      console.log("Data", data);
      setResumeText(data.text);
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
      if (useUrl && jobUrl) {
        const scraped = await api.scrapeJob(jobUrl);
        description = scraped.text;
        setJobDesc(description);
      }
      const data = await api.analyzeATS(resumeText, description);
      setResult(data);
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

  const barData = result
    ? {
      labels: ["Semantic", "Skills", "Keywords", "Experience", "Formatting"],
      datasets: [
        {
          label: "Score Breakdown",
          data: [
            (result.section_scores["semantic"] ?? 0),
            (result.section_scores["skills"] ?? 0),
            (result.section_scores["keywords"] ?? 0),
            (result.section_scores["experience"] ?? 0),
            (result.section_scores["formatting"] ?? 0),
          ],
          backgroundColor: ["#F97316", "#FB923C", "#F59E0B", "#FCD34D", "#FDBA74"],
          borderRadius: 8,
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
              <div className="grid gap-6 md:grid-cols-3">
                <GlassCard className="flex flex-col items-center justify-center py-8">
                  <ScoreCircle score={result.ats_score} />
                </GlassCard>

                <GlassCard className="md:col-span-2">
                  <h3 className="mb-3 text-lg font-semibold font-heading">Analysis Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
                  <div className="mt-4 space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5 text-primary">→</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

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

              <div className="grid gap-6 md:grid-cols-3">
                {radarData && (
                  <GlassCard>
                    <h3 className="mb-3 text-lg font-semibold font-heading">Radar Overview</h3>
                    <Radar data={radarData} options={{ scales: { r: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }} />
                  </GlassCard>
                )}
                {barData && (
                  <GlassCard>
                    <h3 className="mb-3 text-lg font-semibold font-heading">Score Breakdown</h3>
                    <Bar data={barData} options={{ scales: { y: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }} />
                  </GlassCard>
                )}
                {doughnutData && (
                  <GlassCard>
                    <h3 className="mb-3 text-lg font-semibold font-heading">Skills Coverage</h3>
                    <Doughnut data={doughnutData} options={{ plugins: { legend: { position: "bottom" } } }} />
                  </GlassCard>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
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