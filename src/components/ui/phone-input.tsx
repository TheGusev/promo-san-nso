import * as React from "react";
import { Input } from "@/components/ui/input";
import { formatPhoneNumber } from "@/hooks/usePhoneMask";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      onChange(formatted);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // If field is empty, add +7 on focus
      if (!value) {
        onChange("+7 ");
      }
      props.onFocus?.(e);
    };

    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        name="phone"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="+7 (___) ___-__-__"
        className={cn(className)}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
