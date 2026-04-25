import { Link, useLocation, useNavigate } from "react-router-dom";
import { FileText, Mail, ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import darklogo from "@/assets/sorry_something_went_wrong.png";
import lightlogo from "@/assets/Icon1.png";
const Footer = () => {
    const dark = localStorage.getItem("theme") === "dark";



    return (

        <footer className="border-t border-border bg-muted/30 pt-16 pb-8">
            <div className="container">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="">
                        <div >
                            {
                                dark ? <img src="./sorry_something_went_wrong.png" alt="logo" className=" h-32" /> : <img src="./Icon1.png" alt="logo" className=" h-32" />
                            }
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            AI-powered resume optimization platform. Build, score, and improve your resume to land your dream job faster.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-heading font-semibold text-foreground">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                            <li><Link to="/chat" className="hover:text-primary transition-colors">AI Assistant</Link></li>
                            <li><Link to="/editor" className="hover:text-primary transition-colors">Resume Editor</Link></li>
                            <li><Link to="/history" className="hover:text-primary transition-colors">History</Link></li>
                            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="font-heading font-semibold text-foreground">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact & Social */}
                    <div className="space-y-4">
                        <h4 className="font-heading font-semibold text-foreground">Connect</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <a href="mailto:hello@resumeai.com" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                                    <Mail className="h-4 w-4" /> hello@resumeai.com
                                </a>
                            </li>
                        </ul>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <FaTwitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <FaLinkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <FaGithub className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between border-t border-border/50 pt-8 gap-4">
                    <p className="text-sm text-muted-foreground">
                        © 2026 ResumeAI. All rights reserved.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                        Back to top <ArrowUp className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
