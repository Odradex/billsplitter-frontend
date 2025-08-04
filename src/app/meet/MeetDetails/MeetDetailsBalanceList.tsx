import { getDebtsByMeetId } from "@/api/meet";
import { Button } from "@/components/ui/button"
import type { Debt } from "@/models/debt.model"
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router";

const Amount = ({ amount }: { amount: number }) => {
  if (amount === 0) {
    return <span className="ml-auto text-lg font-semibold text-gray-600">В расчёте</span>;
  }

  const isNegative = amount < 0;
  const ArrowIcon = isNegative ? ArrowUp : ArrowDown;
  const color = isNegative ? 'text-red-600' : 'text-green-600';
  const displayAmount = 
    `${Math.abs(amount / 100).toLocaleString('ru-RU')} руб.`;

  return (
    <span className={`ml-auto text-lg font-semibold flex items-center gap-1 ${color}`}>
      <ArrowIcon strokeWidth={3} className={color} />
      <span className={color}>{displayAmount}</span>
    </span>
  );
};


export const MeetDetailsBalanceList = ({ meetId }: { meetId: string }) => {
  const navigate = useNavigate();

  const { data: debts } = useQuery<Debt[]>({
    queryKey: ['debts', meetId],
    queryFn: () => getDebtsByMeetId(meetId),
    enabled: !!meetId,
  });

  return (
    <div className="space-y-2 mx-2">
      {debts?.map((debt) => (
        <Button
          key={debt.id}
          variant="outline"
          className="w-full h-16 justify-start font-medium text-xl flex"
          onClick={() => navigate(`/meet/${meetId}/member/${debt.memberInfo.id}`)}
        >
          {debt.memberInfo.name}
          <Amount amount={debt.amount} />
        </Button>
      ))}
    </div>
  )
}