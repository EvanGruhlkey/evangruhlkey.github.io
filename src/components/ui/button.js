import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ 
  className, 
  children, 
  size = "default",
  ...props 
}, ref) => {
  const sizeClasses = {
    default: "h-12 px-8 text-base",
    sm: "h-10 px-6 text-sm",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex relative uppercase font-mono cursor-pointer items-center font-medium justify-center gap-2 whitespace-nowrap transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none rounded-md",
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };

