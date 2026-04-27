import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Target, Lightbulb, History as HistoryIcon, Star, Shield, Zap, FileText, Link as LinkIcon, AlertTriangle, UploadCloud, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "./Footer";
import GlassCard from "@/components/GlassCard";
import GradientButton from "@/components/GradientButton";
import chatbotImg from "@/assets/chatbot.png";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-12 max-w-6xl mx-auto">
        <div className="flex flex-col gap-6">
          
          {/* Row 1: AI Chatbot */}
          <Link to="/chat" className="block group">
            <GlassCard className="relative overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center border border-primary/20 transition-all hover:border-primary/50">
              <div className="md:w-1/2 z-10 flex flex-col items-start gap-4">
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">AI Chatbot</h2>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                  Get instant AI help to improve your resume.
                </p>
                <div className="mt-4">
                  <GradientButton className="font-semibold px-6 py-2.5">
                    Chat Now <ArrowRight className="ml-2 h-4 w-4" />
                  </GradientButton>
                </div>
              </div>
              <div className="md:w-1/2 relative mt-8 md:mt-0 flex justify-end">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
                <img src={chatbotImg} alt="AI Chatbot" className="w-64 h-auto relative z-10 drop-shadow-2xl object-contain mix-blend-screen" />
              </div>
            </GlassCard>
          </Link>

          {/* Row 2: ATS Score, Resume Matcher, Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ATS Score */}
            <GlassCard className="p-6 flex flex-col">
              <h3 className="text-xl font-bold font-heading text-white mb-2">ATS Score</h3>
              <p className="text-sm text-muted-foreground mb-8">Check your score<br/>and optimize.</p>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                  {/* Progress ring SVG */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="12" />
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="#F97316" strokeWidth="12" strokeDasharray="351.85" strokeDashoffset="45.74" strokeLinecap="round" />
                  </svg>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white block leading-none">87</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500 font-semibold">
                  Excellent <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                </div>
              </div>
            </GlassCard>

            {/* Resume Matcher */}
            <GlassCard className="p-6 flex flex-col">
              <h3 className="text-xl font-bold font-heading text-white mb-2">Resume Matcher</h3>
              <p className="text-sm text-muted-foreground mb-8">Match your resume<br/>with any job.</p>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                   <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="4" />
                    <circle cx="64" cy="64" r="56" fill="transparent" stroke="#F97316" strokeWidth="4" strokeDasharray="351.85" strokeDashoffset="28.14" strokeLinecap="round" />
                  </svg>
                  <Target className="w-16 h-16 text-primary" strokeWidth={1.5} />
                </div>
                <div className="text-green-500 font-semibold text-lg">92% Match</div>
              </div>
            </GlassCard>

            {/* Strengths & Weaknesses */}
            <GlassCard className="p-6 flex flex-col">
              <h3 className="text-xl font-bold font-heading text-white mb-2">Strengths & Weaknesses</h3>
              <p className="text-sm text-muted-foreground mb-6">Know your strengths<br/>and areas to improve.</p>
              <div className="flex-1 flex flex-col gap-6">
                <div>
                  <h4 className="text-green-500 font-semibold mb-3 text-sm">Strengths</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Communication
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Problem Solving
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Team Collaboration
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-500 font-semibold mb-3 text-sm">Weaknesses</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <AlertTriangle className="w-4 h-4 text-red-500" /> Technical Depth
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <AlertTriangle className="w-4 h-4 text-red-500" /> Project Experience
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>

          </div>

          {/* Row 3: Roadmap & Job Description */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Roadmap */}
            <GlassCard className="p-6 md:col-span-5 flex flex-col relative overflow-hidden">
              <h3 className="text-xl font-bold font-heading text-white mb-2 relative z-10">Roadmap</h3>
              <p className="text-sm text-muted-foreground mb-12 relative z-10">Step-by-step plan to<br/>improve your resume.</p>
              
              <div className="relative flex-1 mt-12 mb-8">
                {/* Custom animated/dashed path could go here. For now, absolute positioned points. */}
                <svg className="absolute top-1/2 left-0 w-full h-32 -translate-y-[80%] overflow-visible" preserveAspectRatio="none">
                  <path d="M 30 50 C 80 50, 100 10, 150 40 S 220 80, 280 20 L 320 20" fill="transparent" stroke="#F97316" strokeWidth="2" strokeDasharray="6 6" />
                </svg>
                
                {/* Points */}
                <div className="absolute top-8 left-[10%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)] z-10 mb-2">1</div>
                  <div className="text-center">
                    <span className="text-white font-semibold text-sm block">Analyze</span>
                    <span className="text-xs text-muted-foreground">Identify gaps</span>
                  </div>
                </div>

                <div className="absolute top-0 left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)] z-10 mb-2">2</div>
                  <div className="text-center">
                    <span className="text-white font-semibold text-sm block">Improve</span>
                    <span className="text-xs text-muted-foreground">Work on weak areas</span>
                  </div>
                </div>

                <div className="absolute top-[30%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(249,115,22,0.5)] z-10 mb-2">3</div>
                  <div className="text-center">
                    <span className="text-white font-semibold text-sm block">Apply</span>
                    <span className="text-xs text-muted-foreground">Get job-ready</span>
                  </div>
                </div>

                <div className="absolute -top-12 right-4 text-primary animate-pulse">
                  <Target className="w-10 h-10" />
                </div>
              </div>
            </GlassCard>

            {/* Job Description */}
            <Link to="/dashboard" className="block md:col-span-7 group">
              <GlassCard className="p-6 h-full flex flex-col transition-all hover:border-primary/50">
                <h3 className="text-xl font-bold font-heading text-white mb-2">Job Description</h3>
                <p className="text-sm text-muted-foreground mb-6">Supports text & link based job descriptions.</p>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-2 border-b border-border mb-4 w-max pb-2">
                    <button className="text-primary font-medium text-sm px-2 border-b-2 border-primary -mb-[9px]">Text</button>
                    <button className="text-muted-foreground text-sm px-2">Link</button>
                  </div>
                  
                  <textarea 
                    className="flex-1 w-full bg-black/20 border border-border rounded-lg p-4 text-sm text-gray-300 resize-none focus:outline-none focus:border-primary/50 mb-4 min-h-[120px]"
                    placeholder="Paste the job description here..."
                  ></textarea>
                  
                  <div className="text-right text-xs text-muted-foreground mb-4 -mt-10 mr-4 pointer-events-none relative z-10">0 / 5000</div>

                  <div className="w-full">
                    <GradientButton className="w-full font-semibold pointer-events-none">
                      Analyze Job Description <ArrowRight className="ml-2 h-4 w-4" />
                    </GradientButton>
                  </div>
                </div>
              </GlassCard>
            </Link>

          </div>

          {/* Row 4: 4 small cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <GlassCard className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-heading text-white mb-2">Eligibility Check</h3>
                <p className="text-sm text-muted-foreground mb-6">Check if you meet<br/>the job requirements.</p>
                <FileText className="w-10 h-10 text-primary mb-8" strokeWidth={1.5} />
              </div>
              <div className="text-primary text-sm font-semibold flex items-center group cursor-pointer w-max">
                View Eligibility <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
              </div>
            </GlassCard>

            <Link to="/dashboard" className="block group">
              <GlassCard className="p-6 flex flex-col justify-between h-full transition-all hover:border-primary/50">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white mb-2">Suggestions</h3>
                  <p className="text-sm text-muted-foreground mb-6">Get smart suggestions<br/>to improve your resume.</p>
                  <Lightbulb className="w-10 h-10 text-primary mb-8" strokeWidth={1.5} />
                </div>
                <div className="text-primary text-sm font-semibold flex items-center w-max">
                  View Suggestions <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </div>
              </GlassCard>
            </Link>

            <Link to="/history" className="block group">
              <GlassCard className="p-6 flex flex-col justify-between h-full transition-all hover:border-primary/50">
                <div>
                  <h3 className="text-lg font-bold font-heading text-white mb-2">History</h3>
                  <p className="text-sm text-muted-foreground mb-6">View your past<br/>analyses and reports.</p>
                  <HistoryIcon className="w-10 h-10 text-primary mb-8" strokeWidth={1.5} />
                </div>
                <div className="text-primary text-sm font-semibold flex items-center w-max">
                  View History <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </div>
              </GlassCard>
            </Link>

            <GlassCard className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-heading text-white mb-2">Rating & Feedback</h3>
                <p className="text-sm text-muted-foreground mb-6">Rate your match and<br/>share your feedback.</p>
                <div className="flex flex-col items-center mb-6">
                  <div className="flex gap-1 mb-2">
                    <Star className="w-6 h-6 text-primary fill-primary" />
                    <Star className="w-6 h-6 text-primary fill-primary" />
                    <Star className="w-6 h-6 text-primary fill-primary" />
                    <Star className="w-6 h-6 text-primary fill-primary" />
                    <Star className="w-6 h-6 text-muted-foreground stroke-1" />
                  </div>
                  <span className="text-sm text-gray-300">4.0 / 5</span>
                </div>
              </div>
              <div className="text-primary text-sm font-semibold flex items-center group cursor-pointer w-max">
                Submit Feedback <ArrowRight className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
              </div>
            </GlassCard>

          </div>

          {/* Row 5: 3 features cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <GlassCard className="p-6 flex flex-col">
              <h3 className="text-xl font-bold font-heading text-white mb-2">Resume Upload</h3>
              <p className="text-sm text-muted-foreground mb-6">Upload your resume<br/>in PDF or DOCX format.</p>
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-xl p-6 bg-black/10">
                <UploadCloud className="w-10 h-10 text-gray-400 mb-3" strokeWidth={1.5} />
                <p className="text-sm text-gray-300 mb-1 text-center">Drag & drop your file here or <span className="text-primary">Browse</span></p>
                <p className="text-xs text-muted-foreground">DOCX, PDF (Max 5MB)</p>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col">
              <h3 className="text-xl font-bold font-heading text-white mb-2">Security & Privacy</h3>
              <p className="text-sm text-muted-foreground mb-6">Your data is encrypted<br/>and 100% secure.</p>
              <div className="flex-1 flex items-center justify-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                  <Shield className="w-20 h-20 text-primary relative z-10" strokeWidth={1} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="w-4 h-5 bg-background border-2 border-primary rounded-sm flex items-center justify-center">
                      <div className="w-1.5 h-2.5 border-t-2 border-l-2 border-r-2 border-primary rounded-t-full -mt-4"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Data Encrypted
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> GDPR Compliant
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> 100% Secure
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col">
              <h3 className="text-xl font-bold font-heading text-white mb-2">Fast & Reliable</h3>
              <p className="text-sm text-muted-foreground mb-6">Get instant results<br/>in just a few seconds.</p>
              <div className="flex-1 flex items-center justify-center gap-6">
                <div className="relative w-20 h-20 flex flex-col items-center justify-center rounded-full border-4 border-t-primary border-r-primary border-b-border border-l-primary">
                  <Zap className="w-8 h-8 text-primary absolute -top-4 -right-2 fill-primary bg-background rounded-full p-1" />
                  <span className="text-xs font-semibold text-white mt-2">4.0/s</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> AI-Powered Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Real-time Results
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Accurate Insights
                  </div>
                </div>
              </div>
            </GlassCard>

          </div>

        </div>
      </main>
    </div>
  );
};

export default FeaturesPage;
