import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { Plus } from 'lucide-react';
import { getMeet } from '@/api/meet';
import { getMeetSummary } from '@/api/summary';
import { Button } from '@/components/ui/button';
import { MainButton } from '@/components/MainButton';
import { MeetDetailsHeader } from './MeetDetailsHeader';
import { MeetDetailsBalanceList } from './MeetDetailsBalanceList';

const SecondaryButton = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" className="flex-1 text-xl h-16 font-normal shadow-sm" {...props}>
    {children}
  </Button>
);

export const MeetDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: meet, isLoading } = useQuery({
    queryKey: ['meet', id],
    queryFn: () => getMeet(id!),
    enabled: !!id,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['meet-summary', id],
    queryFn: () => getMeetSummary(id!),
    enabled: !!id,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  if (isLoading || !meet || summaryLoading) {
    return null;
  }

  const getMemberName = (memberId: number) => {
    return meet.members?.find(m => m.ID === memberId)?.username || 'Unknown';
  };

  return (
    <div className="pb-32">
      <MeetDetailsHeader {...meet} />

      <div className="flex gap-4 mt-26 m-2">
        <SecondaryButton>Чеки</SecondaryButton>
        <SecondaryButton>Переводы</SecondaryButton>
      </div>

      <hr className="m-4 border-t-2" />

      <MeetDetailsBalanceList meet={meet} summary={summary} />

      {summary?.settlements && summary.settlements.length > 0 && (
        <>
          <hr className="m-4 border-t-2" />
          <div className="mx-2 mb-4">
            <h3 className="text-xl font-semibold mb-3 px-2">Кто кому должен:</h3>
            <div className="space-y-2">
              {summary.settlements.map((settlement, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="text-lg">
                    <span className="font-semibold">{getMemberName(settlement.from_member_id)}</span>
                    {' → '}
                    <span className="font-semibold">{getMemberName(settlement.to_member_id)}</span>
                  </div>
                  <div className="text-xl font-bold text-green-600 mt-1">
                    {(settlement.amount / 100).toLocaleString('ru-RU')} руб.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <MainButton linkTo={`/meets/${id}/add-bill`}>
        <Plus className="!size-7"/>
        Добавить чек
      </MainButton>
    </div>
  );
};

