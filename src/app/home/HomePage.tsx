import { MainButton } from "@/components/MainButton"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

export function HomePage() {
  const userName = "Артем"
  const meets = ["Зоопарк", "Покер", "Кино", "Боулинг", "Кафе", "Пицца"
  , "Квест", "Бильярд", "Картинг", "Пейнтбол", "Дартс", "Теннис", "Бассейн"]

  return (
    <div className=" max-w-sm mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center">Билсплиттер</h1>

      <Card className="flex items-center justify-between px-4 py-2">
        <span className="text-lg">{userName}</span>
      </Card>

      <div>
        <h2 className="mt-2 mb-1 text-md font-semibold">Твои миты:</h2>
        <div className="space-y-2 mb-30">
          {meets.map((meet) => (
            <Button
              key={meet}
              variant="outline"
              className="w-full h-12 justify-start font-medium"
            >
              {meet}
            </Button>
          ))}
        </div>
      </div>

      <MainButton>
        <Plus/>
        Создать новый мит
      </MainButton>
    </div>
  )
}
