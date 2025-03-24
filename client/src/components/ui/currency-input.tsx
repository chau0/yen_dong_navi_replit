import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  currency: string;
  className?: string;
}

export function CurrencyInput({
  value,
  onChange,
  currency,
  className,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState(
    value.toLocaleString("en-US")
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    const numericValue = rawValue === "" ? 0 : parseInt(rawValue, 10);
    
    onChange(numericValue);
    setDisplayValue(numericValue.toLocaleString("en-US"));
  };

  const handleBlur = () => {
    setDisplayValue(value.toLocaleString("en-US"));
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`pr-12 font-mono text-xl bg-transparent focus:outline-none w-24 ${className}`}
      />
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <span className="text-gray-500 font-mono">{currency}</span>
      </div>
    </div>
  );
}
