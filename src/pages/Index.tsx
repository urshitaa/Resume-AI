import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, animate, useInView } from "framer-motion";
import { api, type Testimonial } from "@/lib/api";
import { ArrowRight, FileText, BarChart3, MessageSquare, Sparkles, Download, Shield, Upload, Search, Zap, CheckCircle, Star, Target, Quote } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import GradientButton from "@/components/GradientButton";
import GlassCard from "@/components/GlassCard";
import Navbar from "@/components/Navbar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import heroVideo from "@/assets/HerosectionVideo.mp4";
import heroBg from "@/assets/hero-bg.jpg";
import heroDashboard from "@/assets/hero-dashboard.png";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import Footer from "./Footer";
import feature1 from "@/assets/Feature1.png";
import feature2 from "@/assets/Feature2.png";
import feature3 from "@/assets/Feature3.png";
import step1Img from "@/assets/1st.png";
import step2Img from "@/assets/2nd.png";
import step3Img from "@/assets/3rd.png";
import step4Img from "@/assets/4th.png";
import lightstep1Img from "@/assets/light-1.png";
import lightstep2Img from "@/assets/light-2.png";
import lightstep3Img from "@/assets/light-3.png";
import lightstep4Img from "@/assets/light-45.png";

import Pricing from "./Pricing";

function AnimatedCounter({ from, to, suffix = "" }: { from: number; to: number; suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });



  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(from, to, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = Math.round(value).toString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, inView, suffix]);

  return <span ref={nodeRef} />;
}


const features = [
  { icon: FileText, title: "Smart Resume Parsing", desc: "Upload PDF or DOCX and instantly extract structured content." },
  { icon: BarChart3, title: "ATS Scoring Engine", desc: "Get a detailed 0-100 compatibility score with breakdown." },
  { icon: Sparkles, title: "AI Resume Improvement", desc: "Enhance your resume with AI-powered suggestions." },
  { icon: MessageSquare, title: "Career AI Chatbot", desc: "Context-aware assistant for career guidance and tips." },
  { icon: Download, title: "PDF Generation", desc: "Generate polished resumes and download instantly." },
  { icon: Shield, title: "Fast and Secure", desc: "Both Fast and Secure for the best results." },
];
const dark = localStorage.getItem("theme") === "dark";
const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    desc: "Drag and drop your PDF or DOCX resume. Our AI parser instantly extracts all sections, skills, and experience.",
    image: dark ? step1Img : lightstep1Img,
  },
  {
    icon: Search,
    step: "02",
    title: "Paste a Job URL or Description",
    desc: "Provide a job posting URL or paste the description. We scrape and analyze the requirements automatically.",
    image: dark ? step2Img : lightstep2Img,
  },
  {
    icon: Zap,
    step: "03",
    title: "Get Your ATS Score & Insights",
    desc: "Receive a detailed ATS compatibility score with skill matching, keyword analysis, and a \"Should You Apply?\" recommendation.",
    image: dark ? step3Img : lightstep3Img,
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Improve & Apply with Confidence",
    desc: "Use AI suggestions to fill skill gaps, improve your bullet points, and generate a polished PDF — ready to send.",
    image: dark ? step4Img : lightstep4Img,
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

const LandingPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    api.getTestimonials().then(setTestimonials).catch(console.error);
  }, []);

  return (
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

      {/* ── Why Works Section ── */}
      <section className="container py-20 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase"
          >
            <Sparkles className="h-3 w-3" /> SMART • FAST • EFFECTIVE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold font-heading md:text-5xl mb-4"
          >
            Why <span className="text-primary">Resume.ai</span> Works for Every Job
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Powerful AI tools to analyze, improve and tailor your resume for maximum impact.
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-sm"
          >
            <img src={feature1} alt="ATS Score" className="w-full  mb-8 rounded-lg object-contain" />
            <div className="w-full text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary mb-4">
                <Star className="text-primary-foreground w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">Get Your Real ATS Score</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">See how your resume performs with applicant tracking systems and know exactly where you stand.</p>
              <div className="w-12 h-[2px] bg-primary mt-6"></div>
            </div>
          </motion.div>
          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border hover:scale-90  hover:border-primary hover:border-2 rounded-2xl p-6 flex flex-col items-center shadow-sm"
          >
            <img src={feature2} alt="Fix Suggestions" className="w-full mb-8 rounded-lg object-contain" />
            <div className="w-full text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary mb-4">
                <Sparkles className="text-primary-foreground w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">Instant Resume Fix Suggestions</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Get AI-powered tips to improve content, keywords, formatting and overall clarity in one click.</p>
              <div className="w-12 h-[2px] bg-primary mt-6"></div>
            </div>
          </motion.div>
          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center shadow-sm"
          >
            <img src={feature3} alt="Match Job" className="w-full mb-8 rounded-lg object-contain" />
            <div className="w-full text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary mb-4">
                <Target className="text-primary-foreground w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">Match Any Job in Seconds</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Paste a job description and let AI tailor your resume to match the role perfectly.</p>
              <div className="w-12 h-[2px] bg-primary mt-6"></div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* ── Stats Section ── */}
      <section className="container py-12 relative z-10 my-10">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-12 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary/10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                <AnimatedCounter from={0} to={10} suffix="K+" />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-semibold">Resumes Created</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                <AnimatedCounter from={0} to={85} suffix="%" />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-semibold">Interview Rate</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                <AnimatedCounter from={0} to={5} suffix="M+" />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-semibold">Jobs Analyzed</div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <div className="text-4xl md:text-5xl font-bold font-heading text-primary mb-2">
                <AnimatedCounter from={0} to={99} suffix="%" />
              </div>
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-semibold">Happy Users</div>
            </motion.div>
          </div>
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
          <h2 className="text-4xl font-bold font-heading md:text-5xl font-bold font-heading md:text-4xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
            Get from resume upload to job-ready in minutes, not hours.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 max-w-65xl mx-auto">
          {steps.map((s, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard hover className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12">
                  {/* Image */}
                  <div className={`w-full md:w-1/2 flex justify-center ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <img src={s.image} alt={s.title} className="w-full max-w-[400px] h-auto object-contain" />
                  </div>
                  {/* Text */}
                  <div className={`w-full md:w-1/2 flex flex-col items-start text-left ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-bold tracking-widest text-primary uppercase">
                      Step {s.step}
                    </div>
                    <h3 className="mb-4 text-2xl md:text-3xl font-bold font-heading">{s.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{s.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
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
              {"Try It Now — It's Free"} <ArrowRight className="ml-2 h-5 w-5" />
            </GradientButton>
          </Link>
        </motion.div>
      </section>

      {/* ── Feature Video Section ── */}

      {/* ── Feature Video Section ── */}
      <section className="container py-20 relative z-10 text-center">

        <h2 className="text-3xl md:text-5xl font-bold font-heading my-4">
          See <span className="text-primary">Resume.ai</span> in Action
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-muted-foreground leading-relaxed">
          Watch how our platform effortlessly extracts your experience and compares it to your dream job.
        </p>
        <div className=" rounded-3xl overflow-hidden shadow-sm p-8 py-32 md:py-32 md:p-12   transition-shadow duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text content (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-10 relative pr-4"
            >
              {[
                {
                  title: "Real-time ATS Score",
                  desc: "Instantly calculate your ATS match rate against your target job.",
                  icon: BarChart3,
                  color: "text-blue-500",
                },
                {
                  title: "AI Improvements",
                  desc: "One-click intelligent bullet point enhancements powered by AI.",
                  icon: Sparkles,
                  color: "text-pink-500",
                },
                {
                  title: "Smart Job Matching",
                  desc: "Tailor your experience seamlessly to fit the job description.",
                  icon: Target,
                  color: "text-emerald-500",
                },
                {
                  title: "Instant PDF Export",
                  desc: "Download your polished, ATS-friendly resume in seconds.",
                  icon: Download,
                  color: "text-amber-500",
                }
              ].map((item, idx, arr) => (
                <div key={idx} className="flex gap-8 relative group">
                  {/* Dashed line connecting icons */}
                  {idx !== arr.length - 1 && (
                    <div className="absolute left-[1.55rem] top-12 bottom-[-2.5rem] w-[1px] border-2 border-dashed border-border border-primary group-hover:border-primary transition-colors" />
                  )}
                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 border-border shadow-sm flex items-center justify-center border-primary group-hover:border-primary group-hover:shadow-md transition-all">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  {/* Text */}
                  <div className="flex flex-col pt-1">
                    <h3 className="text-xl font-bold font-heading text-foreground mb-1 text-primary group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Video content (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Ambient Glow Behind Video */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[20%] h-[130%] bg-primary/50 blur-[100px] rounded-full z-0 pointer-events-none"></div>

              <div className="relative z-10   overflow-hidden  shadow-2xl bg-zinc-900">
                <video
                  src={heroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ── Pricing Section ── */}
      <Pricing />


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

      {/* ── Testimonials Section ── */}
      {testimonials.length > 0 && (
        <section className="container py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold font-heading mb-4">Loved by Job Seekers</h2>
              <p className="text-muted-foreground mb-10 text-lg">
                Here is what people say about our AI Resume Enhancer.
              </p>
            </motion.div>
          </div>
          <Carousel
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full mx-auto"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {testimonials.map((t, idx) => (
                <CarouselItem key={t.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-[30%]">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="h-full px-2 py-4"
                  >
                    <div className="relative h-full rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-[#111111] border border-border dark:border-none flex flex-col">
                      {/* Light Mode Top Orange Header */}
                      <div className="dark:hidden bg-[#FF6B00] pt-6 pb-4 px-6 relative text-center">
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#FF6B00] z-10" />
                        <Quote className="w-10 h-10 text-white mx-auto opacity-100 fill-white rotate-180" />
                      </div>

                      {/* Dark Mode Left Orange Strip */}
                      <div className="hidden dark:block absolute left-0 top-0 bottom-0 w-6 bg-[#FF6B00] z-0" />

                      {/* Dark Mode Quote Circle */}
                      <div className="hidden dark:flex absolute left-3 top-6 w-12 h-12 bg-white rounded-full items-center justify-center z-10 shadow-md">
                        <Quote className="w-6 h-6 text-[#FF6B00] fill-[#FF6B00] rotate-180" />
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 p-6 dark:pl-20 flex flex-col pt-8 dark:pt-8">
                        <p className="text-foreground dark:text-gray-200 text-base md:text-lg leading-relaxed mb-6 flex-1 font-medium">
                          {t.feedback}
                        </p>
                        <div className="mt-auto">
                          <div className="w-10 h-[2px] bg-[#FF6B00] mb-3 dark:mb-4" />
                          <p className="font-bold text-[#FF6B00] text-lg mb-1">{t.name}</p>
                          <p className="text-xs text-muted-foreground mb-3">User</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < t.rating ? "text-[#FF6B00] fill-[#FF6B00]" : "text-muted dark:text-gray-700"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      )}


      <Footer />

    </div>
  );
};

export default LandingPage;
