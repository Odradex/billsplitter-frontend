import { ArrowLeft, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { MainButton } from "@/components/MainButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionContext";
import Header from "@/components/Header";
import { PaymentMethodModal, type PaymentMethodData } from "./PaymentMethodModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPaymentMethods, createPaymentMethod, type PaymentMethod } from "@/api/paymentMethods";

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

  const handleSavePaymentMethod = (data: PaymentMethodData) => {
    createPaymentMethodMutation.mutate({
      title: data.title,
      description: data.description,
      details: data.details || undefined,
    });
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
        {paymentMethods.map((method: PaymentMethod) => (
          <div key={method.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
            <div className="flex-1">
              <div className="font-medium">{method.title}</div>
              <div className="text-sm text-muted-foreground">{method.description}</div>
              {method.details && (
                <div className="text-xs text-muted-foreground mt-1">{method.details}</div>
              )}
            </div>
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
          Имя
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
          />
        </div>

        <div className="bg-secondary rounded-lg p-4 min-h-[80px] text-muted-foreground">
          {renderPaymentMethods()}
        </div>

        <MainButton onClick={() => navigate("/")}>Готово</MainButton>
      </div>
    </>
  );
}
