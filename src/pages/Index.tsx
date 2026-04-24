import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText, BarChart3, MessageSquare, Sparkles, Download, Shield, Upload, Search, Zap, CheckCircle } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import GradientButton from "@/components/GradientButton";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import heroBg from "@/assets/hero-bg.jpg";
import heroDashboard from "@/assets/hero-dashboard.png";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Footer from "./Footer";

const features = [
  { icon: FileText, title: "Smart Resume Parsing", desc: "Upload PDF or DOCX and instantly extract structured content." },
  { icon: BarChart3, title: "ATS Scoring Engine", desc: "Get a detailed 0-100 compatibility score with breakdown." },
  { icon: Sparkles, title: "AI Resume Improvement", desc: "Enhance your resume with AI-powered suggestions." },
  { icon: MessageSquare, title: "Career AI Chatbot", desc: "Context-aware assistant for career guidance and tips." },
  { icon: Download, title: "PDF Generation", desc: "Generate polished resumes and download instantly." },
  { icon: Shield, title: "Fast and Secure", desc: "Both Fast and Secure for the best results." },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    desc: "Drag and drop your PDF or DOCX resume. Our AI parser instantly extracts all sections, skills, and experience.",
  },
  {
    icon: Search,
    step: "02",
    title: "Paste a Job URL or Description",
    desc: "Provide a job posting URL or paste the description. We scrape and analyze the requirements automatically.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Get Your ATS Score & Insights",
    desc: "Receive a detailed ATS compatibility score with skill matching, keyword analysis, and a \"Should You Apply?\" recommendation.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Improve & Apply with Confidence",
    desc: "Use AI suggestions to fill skill gaps, improve your bullet points, and generate a polished PDF — ready to send.",
  },
];

const faqs = [
  {
    question: "Is my resume stored securely?",
    answer: "Yes, your data is encrypted and securely stored. We never share your personal information with third parties without your explicit consent.",
  },
  {
    question: "How accurate is the ATS scoring?",
    answer: "Our ATS scoring engine uses advanced LLMs to simulate real-world Applicant Tracking Systems, giving you a highly accurate breakdown of keyword matches, formatting, and overall compatibility.",
  },
  {
    question: "What file formats are supported?",
    answer: "Currently, we support PDF and DOCX formats for resume uploads. Our parser extracts text seamlessly from both.",
  },
  {
    question: "Can I edit my resume after uploading?",
    answer: "Absolutely! After uploading, you'll be directed to our Resume Editor where you can modify your content, and see real-time updates to your ATS score.",
  },
  {
    question: "Is this free to use?",
    answer: "Yes, our core features are completely free. We also offer premium plans for advanced AI improvements and deeper career insights.",
  },
];

const LandingPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* ── Hero Section ── */}
    <section className="relative overflow-hidden container py-20 text-center">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20 pointer-events-none" width={1920} height={1080} />
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
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


      </div>
    </section>

    {/* ── Features Section ── */}
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

    {/* ── How It Works Section ── */}
    <section className="container py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Zap className="h-4 w-4" />
          Simple Process
        </div>
        <h2 className="text-3xl font-bold font-heading md:text-4xl">
          How It <span className="gradient-text">Works</span>
        </h2>
        <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
          Get from resume upload to job-ready in minutes, not hours.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[2px] bg-gradient-to-r from-primary/40 to-primary/10" />
              )}
              <GlassCard hover className="h-full text-center relative z-10">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:scale-110 transition-transform">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="inline-block mb-2 text-xs font-bold text-primary/60 tracking-widest uppercase">
                  Step {s.step}
                </span>
                <h3 className="mb-2 text-lg font-semibold font-heading">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </GlassCard>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA under How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Link to="/dashboard">
          <GradientButton size="lg">
            Try It Now — It's Free <ArrowRight className="ml-2 h-5 w-5" />
          </GradientButton>
        </Link>
      </motion.div>
    </section>

    {/* ── FAQ Section ── */}
    <section className="container py-20 relative z-10">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mb-10 text-lg">
            Everything you need to know about the product and how it works.
          </p>
        </motion.div>
      </div>
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-primary/10">
                <AccordionTrigger className="text-left font-semibold text-[15px] hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-[15px]">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>


    <Footer />

  </div>
);

export default LandingPage;
