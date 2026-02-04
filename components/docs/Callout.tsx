import { ReactNode } from "react";
import { AlertCircle, Info, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "lib/utils";

interface CalloutProps {
  type?: "info" | "warning" | "tip" | "danger";
  title?: string;
  children: ReactNode;
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
  danger: AlertCircle,
};

const styles = {
  info: "callout-info",
  warning: "callout-warning",
  tip: "callout-tip",
  danger: "callout-danger",
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const Icon = icons[type];

  return (
    <div className={cn(styles[type], "my-6")}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <div className="font-semibold text-foreground mb-1">{title}</div>
          )}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
