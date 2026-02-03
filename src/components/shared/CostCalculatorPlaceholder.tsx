import Calculator from "@/components/Calculator";

interface CostCalculatorPlaceholderProps {
  className?: string;
}

export function CostCalculatorPlaceholder({ className }: CostCalculatorPlaceholderProps) {
  return (
    <div id="calculator-section" className={className}>
      {/* Существующий калькулятор из проекта */}
      <Calculator />
    </div>
  );
}
