import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { MainButton } from "@/components/MainButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionContext";
import Header from "@/components/Header";
import { PaymentMethodModal, type PaymentMethodForm } from "./PaymentMethodModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPaymentMethods, createPaymentMethod, type PaymentMethodData, updatePaymentMethod, deletePaymentMethod } from "@/api/paymentMethods";
import { useState } from "react";

export default function ProfilePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session: { UserInfo } } = useSession();

  const userName = UserInfo?.FirstName;

  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: getPaymentMethods,
  });

  const createPaymentMethodMutation = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      // Refetch payment methods after successful creation
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });

  const updatePaymentMethodMutation = useMutation({
    mutationFn: updatePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });

  const deletePaymentMethodMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] });
    },
  });

  const [editModalData, setEditModalData] = useState<PaymentMethodData | null>(null);

  const handleSavePaymentMethod = (data: PaymentMethodForm) => {
    createPaymentMethodMutation.mutate({
      name: data.name,
      description: data.description,
      recipient: data.recipient || undefined,
    });
  };

  const handleEditPaymentMethod = (data: PaymentMethodForm) => {
    if (!editModalData) return;
    updatePaymentMethodMutation.mutate({
      id: editModalData.id,
      name: data.name,
      description: data.description,
      recipient: data.recipient || undefined,
    });
    setEditModalData(null);
  };

  const handleDeletePaymentMethod = () => {
    if (!editModalData?.id) return;

    deletePaymentMethodMutation.mutate(editModalData.id);
    setEditModalData(null);
  };

  const renderPaymentMethods = () => {
    if (isLoading) {
      return <span>Загрузка...</span>;
    }

    if (paymentMethods.length === 0) {
      return <span>Нет добавленных способов оплаты</span>;
    }

    return (
      <div className="space-y-2">
        {paymentMethods.map((method: PaymentMethodData) => (
          <div
            key={method.id}
            className="relative flex items-center justify-between p-3 bg-background border rounded-lg cursor-pointer"
            onClick={() => setEditModalData(method)}
          >
            <div className="flex-1">
              <div className="font-medium">{method.name}</div>
              <div className="text-sm text-muted-foreground">{method.description}</div>
              {method.recipient && (
                <div className="text-xs text-muted-foreground mt-1">{method.recipient}</div>
              )}
            </div>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
              onClick={e => {
                e.stopPropagation(); // Prevents card click
                setEditModalData(method);
              }}
              aria-label="Редактировать"
            >
              <Pencil className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Header>
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft />
          Настройки
        </Link>
      </Header>

      <div className="max-w-sm mx-auto mt-24 space-y-6 mb-24 px-4">
        <div className="w-full text-lg font-semibold mt-2 mb-2 text-left">
          Твоё Имя
        </div>

        <div className="w-full flex justify-start mb-2">
          <Input
            type="text"
            placeholder="Введите имя"
            defaultValue={userName}
          />
        </div>

        <div className="flex items-center justify-between mt-6 mb-2">
          <h2 className="text-lg font-semibold">Способы оплаты</h2>
          <PaymentMethodModal
            trigger={
              <Button variant="outline" size="icon">
                <Plus className="w-6 h-6" />
              </Button>
            }
            onSave={handleSavePaymentMethod}
            isLoading={createPaymentMethodMutation.isPending}
            mode="create"
          />
        </div>

        <div className="bg-secondary rounded-lg p-4 min-h-[80px] text-muted-foreground">
          {renderPaymentMethods()}
        </div>

        <MainButton onClick={() => navigate("/")}>Готово</MainButton>
      </div>

        {editModalData && (
          <PaymentMethodModal
            open={!!editModalData}
            onOpenChange={open => { if (!open) setEditModalData(null); }}
            trigger={null}
            onSave={handleEditPaymentMethod}
            onDelete={handleDeletePaymentMethod}
            isLoading={deletePaymentMethodMutation.isPending || updatePaymentMethodMutation.isPending}
            mode="edit"
            initialData={{
              name: editModalData.name,
              description: editModalData.description,
              recipient: editModalData.recipient || "",
            }}
          />
        )}
    </>
  );
}
