import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface WarrantyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WarrantyModal({ open, onOpenChange }: WarrantyModalProps) {
  const conditions = [
    {
      title: "Степень заражения",
      description: "Гарантия распространяется на объекты со стандартным уровнем заражения",
    },
    {
      title: "Отсутствие самолечения",
      description: "Клиент не предпринимал попыток самостоятельной обработки в течение 7 дней до визита",
    },
    {
      title: "Подготовка помещения",
      description: "Помещение подготовлено согласно рекомендациям специалиста",
    },
    {
      title: "Безопасность жильцов",
      description: "Соблюдены сроки проветривания и возвращения в помещение после обработки",
    },
    {
      title: "Документальное оформление",
      description: "Заключён договор на оказание услуг и получен акт выполненных работ",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Условия гарантийного сопровождения</DialogTitle>
          <DialogDescription>
            Мы предоставляем гарантию до 30 дней при соблюдении следующих условий:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {conditions.map((condition, index) => (
            <div key={index} className="flex gap-3">
              <CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground">{condition.title}</h4>
                <p className="text-sm text-muted-foreground">{condition.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Важно:</strong> Гарантия не распространяется на повторное заражение вследствие
            проникновения вредителей от соседей или из других источников после проведения обработки.
          </p>
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full" size="lg">
          Понятно
        </Button>
      </DialogContent>
    </Dialog>
  );
}
