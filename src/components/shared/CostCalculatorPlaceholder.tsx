import SimpleCalculator from "@/components/SimpleCalculator";

interface CostCalculatorPlaceholderProps {
  className?: string;
}

export function CostCalculatorPlaceholder({ className }: CostCalculatorPlaceholderProps) {
  return (
    <div id="calculator" className={className}>
      <SimpleCalculator />
    </div>
  );
}
