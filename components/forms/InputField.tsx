import { cn } from "@/lib/utils";
import React from "react";
import { Label } from "@/components/ui/label";

function InputField({
  name,
  label,
  placeholder,
  disabled,
  type = "text",
  value,
  register,
  error,
  validation,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label block">
        {label}
      </Label>

      <input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn("form-input w-full", {
          "opacity-50 cursor-not-allowed": disabled,
        })}
        {...register(name, validation)}
      />
      

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

export default InputField;
