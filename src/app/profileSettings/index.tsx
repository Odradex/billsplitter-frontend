import { ArrowLeft, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { MainButton } from "@/components/MainButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionContext";
import Header from "@/components/Header";
// import { useSession } from "@/contexts/SessionContext"

export default function ProfilePage() {
  const navigate = useNavigate();
  const { session: { UserInfo } } = useSession();

  const userName = UserInfo?.FirstName;

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
          <Button variant="outline" size="icon">
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        <div className="bg-secondary rounded-lg p-4 min-h-[80px] text-muted-foreground">
          <span>Нет добавленных способов оплаты</span>
        </div>

        <MainButton onClick={() => navigate("/")}>Готово</MainButton>
      </div>
    </>
  );
}
