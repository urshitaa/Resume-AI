import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFileAccepted: (file: File) => void;
  acceptedFile?: File | null;
  isUploading?: boolean;
}

const UploadDropzone = ({ onFileAccepted, acceptedFile, isUploading }: UploadDropzoneProps) => {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) onFileAccepted(accepted[0]);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-primary/5",
        acceptedFile && "border-primary/30 bg-primary/5"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <div className="h-12 w-12 animate-spin-slow rounded-full border-4 border-primary/20 border-t-primary" />
        ) : acceptedFile ? (
          <FileText className="h-12 w-12 text-primary" />
        ) : (
          <Upload className="h-12 w-12 text-muted-foreground" />
        )}
        <div>
          <p className="font-semibold text-foreground">
            {acceptedFile ? acceptedFile.name : "Drop your resume here"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {acceptedFile
              ? `${(acceptedFile.size / 1024).toFixed(1)} KB`
              : "PDF or DOCX, up to 10MB"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadDropzone;
