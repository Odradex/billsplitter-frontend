import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { MainButton } from "@/components/MainButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useSession } from "@/contexts/SessionContext"

export default function ProfilePage() {
  const navigate = useNavigate();
  // const { session } = useSession();
  const userName = "Имя пользователя";

  return (
    <div className="max-w-sm mx-auto mt-4 space-y-6 mb-24 px-4">
      <div
        className="relative cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="absolute inset-0 bg-muted rounded-lg h-12" />
        <div className="flex items-center relative z-10 h-12 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
            tabIndex={-1} // чтобы не было двойного фокуса
          >
            <ArrowLeft className="size-7" />
          </Button>
          <span className="text-xl font-bold text-left ml-12">{ "Настройки" }</span>
        </div>
      </div>

      <div className="w-full text-lg font-semibold mt-2 mb-2 text-left">
        {userName}
      </div>

      <div className="w-full flex justify-start mb-2">
        <Input
          type="text"
          placeholder="Введите имя"
        />
      </div>

      <div className="flex items-center justify-between mt-6 mb-2">
        <h2 className="text-lg font-semibold">Способы оплаты</h2>
        <Button variant="outline" size="icon">
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <div className="bg-secondary rounded-lg p-4 min-h-[80px] text-muted-foreground">
        <span>Нет добавленных способов оплаты</span>
      </div>

      <MainButton onClick={() => navigate("/")}>Готово</MainButton>
    </div>
  );
}
