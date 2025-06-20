
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = ({ ...props }) => (
  <form {...props} />
);
Form.displayName = "Form";

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
));
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ ...props }, ref) => (
  <Slot ref={ref} {...props} />
));
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-destructive", className)}
    {...props}
  >
    {children}
  </p>
));
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
