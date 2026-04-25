import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Hexagon, Triangle, Circle, Sparkles } from "lucide-react";

const tiers = [
  {
    name: "FREE",
    price: "$0",
    period: "FOREVER",
    features: [
      "3 resume scans / month",
      "Basic ATS analysis",
      "1 saved resume",
      "Community support"
    ],
    buttonText: "Start Free",
    buttonLink: "/dashboard",
    footerText: "No credit card required",
    glowColor: "from-blue-500/20 to-transparent",
    borderColor: "border-blue-500/20",
    pillColor: "text-blue-400 border-blue-500/30",
    icon: Circle,
    iconColor: "text-blue-400",
  },
  {
    name: "PRO",
    price: "$19",
    period: "/ MONTH",
    features: [
      "Unlimited resume scans",
      "AI Resume Rewriter",
      "Job tracker (Kanban)",
      "AI Career Coach (chat)",
      "Cover letter generator",
      "Interview prep + feedback"
    ],
    buttonText: "Go Pro",
    buttonLink: "/under-construction",
    footerText: "7 Days Trial Available",
    glowColor: "from-primary/30 to-transparent",
    borderColor: "border-primary/40",
    pillColor: "text-primary border-primary/40",
    icon: Sparkles,
    iconColor: "text-primary",
    featured: true,
  },
  {
    name: "PREMIUM",
    price: "$39",
    period: "/ MONTH",
    features: [
      "Everything in Pro",
      "1-on-1 Expert Review",
      "Unlimited Cover Letters",
      "Priority Support",
      "Custom Domain",
      "Premium Templates"
    ],
    buttonText: "Get Premium",
    buttonLink: "/under-construction",
    footerText: "15 Days Trial Available",
    glowColor: "from-purple-500/20 to-transparent",
    borderColor: "border-purple-500/20",
    pillColor: "text-purple-400 border-purple-500/30",
    icon: Hexagon,
    iconColor: "text-purple-400",
  }
];

const Pricing: React.FC = () => {
    return (
        <section className="bg-background text-foreground py-24 px-6 relative overflow-hidden">
            {/* Background grids/effects */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Heading */}
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full border border-primary/30 text-primary bg-primary/5 mb-4"
                    >
                        Pricing Plans
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold font-heading mb-4"
                    >
                        Simple, <span className="gradient-text">honest</span> pricing
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Start free. Upgrade when you're ready to land the offer.
                    </motion.p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {tiers.map((t, i) => (
                        <motion.div 
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                            className={`relative flex flex-col overflow-hidden rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-md border ${t.borderColor} p-8 shadow-2xl`}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-radial ${t.glowColor} blur-3xl opacity-60 rounded-full pointer-events-none`} />

                            {/* Header: Label & Icon */}
                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${t.pillColor} bg-black/50 backdrop-blur-sm`}>
                                    {t.name}
                                </div>
                                <motion.div 
                                    animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }} 
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: i }}
                                >
                                    <t.icon className={`w-12 h-12 ${t.iconColor} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`} strokeWidth={1.5} />
                                </motion.div>
                            </div>

                            {/* Price */}
                            <div className="mb-8 relative z-10">
                                <div className="flex items-baseline gap-1">
                                    <h3 className="text-5xl font-bold font-heading text-white">{t.price}</h3>
                                    <span className="text-xs font-medium text-gray-500 tracking-wider">{t.period}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-10 flex-1 relative z-10">
                                {t.features.map((f, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                                        <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-white text-black">
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Action Button & Footer */}
                            <div className="mt-auto relative z-10">
                                <Link to={t.buttonLink} className="block w-full">
                                    <button 
                                        className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2
                                        ${t.featured 
                                            ? 'bg-gradient-to-r from-primary to-orange-400 text-primary-foreground shadow-[0_0_20px_rgba(255,115,0,0.3)] hover:shadow-[0_0_30px_rgba(255,115,0,0.5)] hover:scale-[1.02]' 
                                            : 'bg-[#151515] text-white hover:bg-[#222] border border-white/5 hover:border-white/20'}`}
                                    >
                                        {t.buttonText}
                                    </button>
                                </Link>
                                <p className="text-center text-[11px] text-gray-500 mt-4 font-medium uppercase tracking-wider">
                                    {t.footerText}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;