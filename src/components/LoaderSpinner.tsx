const LoaderSpinner = ({ text = "Processing..." }: { text?: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
      <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
    </div>
    <p className="text-sm font-medium text-muted-foreground">{text}</p>
  </div>
);

export default LoaderSpinner;
