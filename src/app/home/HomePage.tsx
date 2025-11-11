import { MainButton } from "@/components/MainButton"
import { Button } from "@/components/ui/button"
import { useSession } from "@/contexts/SessionContext";
import { Plus } from "lucide-react"
import SettingsBanner from "../profileSettings/settingsBanner";
import { useNavigate } from "react-router";
import { getMeets } from "@/api/meet";
import { useQuery } from "@tanstack/react-query";

export function HomePage() {
  const navigate = useNavigate();

  const { data: meets = [], isLoading } = useQuery({
    queryKey: ['meets'],
    queryFn: getMeets,
  });

  const { session } = useSession();

  return (
    <div className=" max-w-sm mx-auto space-y-4 mt-4 px-4">
      <h1 className="text-3xl font-bold">Билсплиттер</h1>

      <div className="flex gap-4 h-24">
       <SettingsBanner userName={session?.UserInfo?.Username} />
      </div>

      <div>
        <h2 className="mt-2 mb-2 text-2xl font-semibold">Твои миты:</h2>
        <div className="space-y-2 mb-30">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Загрузка...</div>
          ) : (
            meets.map((meet) => (
              <Button
                key={meet.ID}
                variant="outline"
                className="w-full h-14 justify-start font-medium"
                onClick={() => navigate(`/meets/${meet.ID}`)}
              >
                {meet.name}
              </Button>
            ))
          )}
        </div>
      </div>

      <MainButton linkTo="/meet/new">
        <Plus className="!size-7"/>
        Новый мит
      </MainButton>
    </div>
  )
}
