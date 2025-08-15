import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(1, "Введите название"),
  description: z.string().min(1, "Введите описание"),
  recipient: z.string().min(1, "Введите реквизиты"),
});

export type PaymentMethodForm = z.infer<typeof schema>;

interface PaymentMethodModalProps {
  trigger: React.ReactNode;
  onSave?: (data: PaymentMethodForm) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  initialData?: PaymentMethodForm;
  onDelete?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PaymentMethodModal({
  trigger,
  onSave,
  isLoading = false,
  mode = "create",
  initialData,
  onDelete,
  open: controlledOpen,
  onOpenChange,
}: PaymentMethodModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentMethodForm>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: "",
      description: "",
      recipient: "",
    },
  });

  // Optionally reset form when modal closes
  useEffect(() => {
    if (!open) {
      // reset form here if needed
    }
  }, [open]);

  const closeAndReset = () => {
    setOpen(false);
    reset(initialData || { name: "", description: "", recipient: "" });
  };

  const onSubmit = (data: PaymentMethodForm) => {
    onSave?.(data);
    closeAndReset();
  };

  const handleDelete = () => {
    onDelete?.();
    closeAndReset();
  };

  if (!open) {
    return trigger ? <div onClick={() => setOpen(true)}>{trigger}</div> : null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0 duration-200"
        onClick={closeAndReset}
      />
      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-lg border-t p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {mode === "edit" ? "Редактировать" : "Добавить"}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeAndReset}
            className="h-8 w-8"
            type="button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название</Label>
            <Input
              id="title"
              placeholder="Карта"
              {...register("name")}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              placeholder="Перевод на карту Сбера"
              {...register("description")}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="details">Реквизиты</Label>
            <Textarea
              id="details"
              placeholder="Пользователи смогут скопировать для быстрого перевода"
              {...register("recipient")}
              disabled={isLoading}
            />
            {errors.recipient && (
              <p className="text-xs text-red-500">{errors.recipient.message}</p>
            )}
          </div>
          <div className="flex items-center gap-4 pt-4">
            {mode === "edit" && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="h-12 w-12"
                type="button"
                disabled={isLoading}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Готово"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
} 
