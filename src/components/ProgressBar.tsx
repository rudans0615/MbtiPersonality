interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full bg-neutral-200 rounded-full h-3">
      <div 
        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300 animate-progress"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
