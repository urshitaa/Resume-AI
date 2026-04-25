import { motion } from "framer-motion";
import { Hammer, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "./Footer";
import GradientButton from "@/components/GradientButton";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">

      <div className="flex-1 flex items-center justify-center container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <Hammer className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-heading mb-4">
            Under <span className="gradient-text">Construction</span>
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            We're working hard to bring you this feature. Check back soon!
          </p>
          <Link to="/">
            <GradientButton>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </GradientButton>
          </Link>
        </motion.div>
      </div>

    </div>
  );
};

export default UnderConstruction;
