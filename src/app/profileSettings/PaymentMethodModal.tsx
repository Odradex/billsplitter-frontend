import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PaymentMethodModalProps {
  trigger: React.ReactNode;
  onSave?: (data: PaymentMethodData) => void;
  isLoading?: boolean;
}

export interface PaymentMethodData {
  title: string;
  description: string;
  details: string;
}

export function PaymentMethodModal({ trigger, onSave, isLoading = false }: PaymentMethodModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<PaymentMethodData>({
    title: "",
    description: "",
    details: "",
  });

  const handleSave = () => {
    onSave?.(formData);
    setFormData({ title: "", description: "", details: "" });
    setOpen(false);
  };

  const handleDelete = () => {
    setFormData({ title: "", description: "", details: "" });
    setOpen(false);
  };

  if (!open) {
    return <div onClick={() => setOpen(true)}>{trigger}</div>;
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0 duration-200"
        onClick={() => setOpen(false)}
      />
      
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-lg border-t p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Поделиться</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              placeholder="Карта"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              placeholder="Перевод на карту Сбера"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Реквизиты (необязательно)</Label>
            <Textarea
              id="details"
              placeholder="Ссылка, номер счета, реквизиты"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="h-12 w-12"
              disabled={isLoading}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Готово"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 
