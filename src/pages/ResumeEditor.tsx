import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, Wand2, Save, FileText, Upload, Eye, Edit3, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";
import GradientButton from "@/components/GradientButton";
import LoaderSpinner from "@/components/LoaderSpinner";
import BulletImproverDialog from "@/components/BulletImproverDialog";
import TemplateSelector, { TEMPLATES } from "@/components/TemplateSelector";
import ResumePreview from "@/components/ResumePreview";
import { parseResumeText } from "@/utils/resumeParser";

// @ts-ignore
import html2pdf from "html2pdf.js";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Footer from "./Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const ResumeEditor = () => {
  const [originalText, setOriginalText] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [improving, setImproving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showImprover, setShowImprover] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const printRef = useRef<HTMLDivElement>(null);
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ name: "", email: "", rating: 0, feedback: "" });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.uploadResume(file);
      setOriginalText(result.text);
      if (result.resume_id) setResumeId(result.resume_id);
      toast.success("Resume uploaded successfully!");
    } catch (err: any) {
      if (err.message?.includes("401") || err.message?.includes("credentials")) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login", { state: { from: location.pathname } });
      } else {
        toast.error(err.message || "Upload failed");
      }
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && text.length > 10) {
      setSelectedText(text);
    } else {
      setSelectedText("");
    }
  };

  const openImprover = () => {
    if (selectedText) {
      if (!jobDesc) {
        toast.error("Please provide a job description first.");
        return;
      }
      setShowImprover(true);
    }
  };

  const handleReplaceBullet = (newText: string) => {
    if (selectedText) {
      setImprovedText(prev => prev.replace(selectedText, newText));
      setShowImprover(false);
      setSelectedText("");
      window.getSelection()?.removeAllRanges();
      toast.success("Bullet point updated!");
    }
  };

  const handleSaveVersion = async () => {
    const textToSave = improvedText || originalText;
    if (!textToSave) return;
    
    if (!resumeId) {
      toast.error("Please upload a resume first to save versions.");
      return;
    }
    
    setSaving(true);
    try {
      await api.saveResumeVersion(resumeId, textToSave);
      toast.success("Resume version saved successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to save version.");
    } finally {
      setSaving(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackData.name || !feedbackData.email || !feedbackData.feedback || feedbackData.rating === 0) {
      toast.error("Please fill in all fields and select a rating.");
      return;
    }
    setSubmittingFeedback(true);
    try {
      await api.submitTestimonial(feedbackData);
      toast.success("Thank you for your feedback!");
      setShowFeedbackModal(false);
      setFeedbackData({ name: "", email: "", rating: 0, feedback: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleDownloadTxt = () => {
    const content = improvedText || originalText;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-ats-friendly.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("ATS-friendly resume downloaded.");
  };

  const handleImprove = async () => {
    if (!originalText.trim() || !jobDesc.trim()) return;
    setImproving(true);
    setError("");
    try {
      const { improved_text } = await api.improveResume(originalText, jobDesc);
      setImprovedText(improved_text);
    } catch (err: any) {
      if (err.message?.includes("401") || err.message?.includes("credentials") || err.message?.includes("Unauthorized")) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login", { state: { from: location.pathname } });
      } else {
        setError(err.message || "Improvement failed");
      }
    } finally {
      setImproving(false);
    }
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    setGenerating(true);

    if (viewMode !== "preview") {
      setViewMode("preview");
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    try {
      const element = printRef.current;
      const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { 
          unit: 'px', 
          format: [element.scrollWidth, element.scrollHeight], 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(opt).from(element).save();
      toast.success("Resume PDF downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container max-w-[1600px] py-6 mx-auto flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-80px)] lg:overflow-hidden">

        {/* Left Sidebar */}
        <div className="w-full lg:w-[320px] xl:w-[380px] flex flex-col gap-4 overflow-y-auto pr-2 pb-8 custom-scrollbar">

          {/* Job Description Card */}
          <GlassCard className="p-4 border border-border !bg-card/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Job Description</h3>
            <div className="relative">
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description you want to optimize for..."
                rows={5}
                maxLength={2000}
                className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none pb-8"
              />
              <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {jobDesc.length} / 2000
              </span>
            </div>
          </GlassCard>

          {/* Choose Template Card */}
          <GlassCard className="p-4 border border-border !bg-card/50">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelect={(template) => {
                setSelectedTemplate(template);
                setViewMode("preview");
              }}
            />
          </GlassCard>

          {/* Upload Resume Card */}
          <GlassCard className="p-4 border border-border !bg-card/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Step 1: Upload Your Resume</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Upload your existing resume and let AI enhance it.
            </p>

            <div
              className="border-2 border-dashed border-primary/30 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-colors hover:bg-primary/5 cursor-pointer relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-pink-500 mb-1" />
              <span className="text-sm font-medium text-foreground">Drag & drop your file here</span>
              <span className="text-xs text-muted-foreground">or</span>
              <button
                disabled={uploading}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-md text-sm font-medium shadow-sm hover:opacity-90 transition-opacity"
              >
                {uploading ? "Uploading..." : "Browse File"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,image/*"
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3">
              Supported: PDF, DOCX, TXT (Max 10MB)
            </p>
          </GlassCard>

          {/* Action Buttons Row */}
          <div className="flex gap-3 mt-2">
            <button
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleImprove}
              disabled={!originalText.trim() || !jobDesc.trim() || improving}
            >
              <Wand2 className="w-4 h-4" />
              {improving ? "Improving..." : "AI Improve Resume"}
            </button>
            <button
              className="flex-1 border border-orange-500 text-orange-500 rounded-lg py-3 flex items-center justify-center gap-2 text-sm font-semibold hover:bg-orange-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDownloadTxt}
              disabled={(!improvedText && !originalText)}
            >
              <FileText className="w-4 h-4" /> Download ATS (.txt)
            </button>
          </div>
        </div>

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0 lg:overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground ml-2">LIVE RESUME PREVIEW</h2>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {(improvedText || originalText) && (
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-primary/50 text-primary rounded-lg text-sm font-medium bg-primary/10 hover:bg-primary/20 transition-colors"
                  onClick={() => setShowFeedbackModal(true)}
                >
                  <Star className="w-4 h-4 fill-primary" /> Rate Us
                </button>
              )}
              <button
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium bg-card hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                onClick={handleSaveVersion}
                disabled={saving || (!improvedText && !originalText)}
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Version"}
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium bg-card hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
                onClick={handleDownload}
                disabled={generating || (!improvedText && !originalText)}
              >
                <Download className="w-4 h-4" /> {generating ? "Exporting..." : "Export PDF"}
              </button>

              <div className="flex bg-card border border-border rounded-lg p-1">
                <button
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'edit' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('edit')}
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'preview' ? 'bg-background shadow-sm text-orange-500' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
              </div>
            </div>
          </div>

          {/* Editor / Preview Area */}
          <div className="flex-1 bg-card rounded-xl border border-border shadow-sm flex flex-col relative min-h-[500px] lg:min-h-0 overflow-hidden">
            {improving && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
                <LoaderSpinner text="AI is enhancing your resume..." />
              </div>
            )}

            {viewMode === 'edit' ? (
              <div className="flex-1 p-6 relative flex flex-col overflow-y-auto custom-scrollbar">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold font-heading">
                    Raw Text Editor
                    {improvedText && <span className="ml-2 text-sm text-green-600 dark:text-green-400">✓ AI Enhanced</span>}
                  </h3>
                </div>
                {error && (
                  <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-destructive text-sm">
                    {error}
                  </div>
                )}
                <div className="flex-1 relative">
                  <textarea
                    value={improvedText || originalText}
                    onMouseUp={handleTextSelection}
                    onChange={(e) => setImprovedText(e.target.value)}
                    placeholder="Paste your resume text here, or let AI enhance it..."
                    className="w-full h-full min-h-[400px] rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono shadow-inner"
                  />
                  {selectedText && (improvedText || originalText) && !improving && (
                    <div className="absolute top-4 right-4 animate-slide-up">
                      <button
                        onClick={openImprover}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      >
                        <Wand2 className="h-3 w-3" /> Improve Selected
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 bg-zinc-100 dark:bg-zinc-900 overflow-y-auto p-4 sm:p-8 flex justify-center rounded-xl relative custom-scrollbar">
                <div className="w-full max-w-[850px] shadow-2xl bg-white mx-auto transform-gpu origin-top flex h-max transition-transform" ref={printRef}>
                  <div className="w-full">
                    <ResumePreview
                      data={parseResumeText(improvedText || originalText)}
                      template={selectedTemplate}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {showImprover && (
        <BulletImproverDialog
          selectedText={selectedText}
          jobDescription={jobDesc}
          onClose={() => setShowImprover(false)}
          onReplace={handleReplaceBullet}
        />
      )}

      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>
              We'd love to hear your feedback on our AI Resume Enhancer.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 cursor-pointer transition-colors ${feedbackData.rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                  onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                />
              ))}
            </div>
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input
                id="name"
                value={feedbackData.name}
                onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="Your Name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                value={feedbackData.email}
                onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="your@email.com"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="feedback" className="text-sm font-medium">Feedback</label>
              <textarea
                id="feedback"
                value={feedbackData.feedback}
                onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                placeholder="How did the AI help you?"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent"
              onClick={() => setShowFeedbackModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              onClick={handleFeedbackSubmit}
              disabled={submittingFeedback}
            >
              {submittingFeedback ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ResumeEditor;
