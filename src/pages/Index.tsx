import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, BarChart3, MessageSquare, Sparkles, Download, Shield } from "lucide-react";
import GradientButton from "@/components/GradientButton";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: FileText, title: "Smart Resume Parsing", desc: "Upload PDF or DOCX and instantly extract structured content." },
  { icon: BarChart3, title: "ATS Scoring Engine", desc: "Get a detailed 0-100 compatibility score with breakdown." },
  { icon: Sparkles, title: "AI Resume Improvement", desc: "Enhance your resume with AI-powered suggestions." },
  { icon: MessageSquare, title: "Career AI Chatbot", desc: "Context-aware assistant for career guidance and tips." },
  { icon: Download, title: "PDF Generation", desc: "Generate polished resumes and download instantly." },
  { icon: Shield, title: "Gemini & Grok Models", desc: "Switch between AI providers for best results." },
];

const LandingPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="relative overflow-hidden container py-20 text-center">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20 pointer-events-none" width={1920} height={1080} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          AI-Powered Resume Intelligence
        </div>
        <h1 className="text-5xl font-bold font-heading leading-tight md:text-7xl">
          Land Your Dream Job
          <br />
          <span className="gradient-text">With AI Precision</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Upload your resume, match it against any job description, and get an instant ATS score with AI-powered improvement suggestions. Powered by Gemini & Grok.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/dashboard">
            <GradientButton size="lg">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </GradientButton>
          </Link>
          <Link to="/chat">
            <GradientButton variant="outline" size="lg">
              Try AI Assistant
            </GradientButton>
          </Link>
        </div>
      </motion.div>
    </section>

    <section className="container pb-20">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <GlassCard hover className="h-full">
              <div className="gradient-bg mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold font-heading">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>

    <footer className="border-t border-border py-8">
      <div className="container text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} ResumeAI. Built for job seekers who mean business.</p>
      </div>
    </footer>
  </div>
);

export default LandingPage;
