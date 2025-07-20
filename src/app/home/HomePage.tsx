import { MainButton } from "@/components/MainButton"
import { Button } from "@/components/ui/button"
import { useSession } from "@/contexts/SessionContext";
import { Plus } from "lucide-react"
import SettingsBanner from "../profileSettings/settingsBanner";

export function HomePage() {
  const meets = ["Зоопарк", "Покер", "Кино", "Боулинг", "Кафе", "Пицца"
  , "Квест", "Бильярд", "Картинг", "Пейнтбол", "Дартс", "Теннис", "Бассейн"]

  console.log(meets);
  const session = useSession();
  console.log(session);
  return (
    <div className=" max-w-sm mx-auto space-y-4 mt-4 px-4">
      <h1 className="text-3xl font-bold">Билсплиттер</h1>

      <div className="flex gap-4 h-24">
       <SettingsBanner userName={'Шальной моряк'} />
      </div>

      <div>
        <h2 className="mt-2 mb-2 text-2xl font-semibold">Твои миты:</h2>
        <div className="space-y-2 mb-30">
          {meets.map((meet) => (
            <Button
              key={meet}
              variant="outline"
              className="w-full h-14 justify-start font-medium"
            >
              {meet}
            </Button>
          ))}
        </div>
      </div>

      <MainButton linkTo="/meet/new">
        <Plus className="!size-7"/>
        Новый мит
      </MainButton>
    </div>
  )
}
