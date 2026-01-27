import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'react-router';
import { Plus } from 'lucide-react';
import { getMeet, createBill } from '@/api/meet';
import { getMeetSummary } from '@/api/summary';
import { Button } from '@/components/ui/button';
import { MainButton } from '@/components/MainButton';
import { MeetDetailsHeader } from './MeetDetailsHeader';
import { MeetDetailsBalanceList } from './MeetDetailsBalanceList';
import { useSession } from '@/contexts/SessionContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';

const SecondaryButton = ({ children, ...props }: React.ComponentProps<typeof Button>) => (
  <Button variant="outline" className="flex-1 text-xl h-16 font-normal shadow-sm" {...props}>
    {children}
  </Button>
);

export const MeetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useSession();
  const [confirmPayment, setConfirmPayment] = useState<{
    fromMemberId: number;
    toMemberId: number;
    amount: number;
  } | null>(null);

  const { data: meet, isLoading, refetch: refetchMeet } = useQuery({
    queryKey: ['meet', id],
    queryFn: () => getMeet(id!),
    enabled: !!id,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['meet-summary', id],
    queryFn: () => getMeetSummary(id!),
    enabled: !!id,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const createPaymentMutation = useMutation({
    mutationFn: createBill,
    onSuccess: () => {
      setConfirmPayment(null);
      refetchMeet();
      refetchSummary();
    },
    onError: (error: any) => {
      console.error('Error creating payment:', error);
    },
  });

  if (isLoading || !meet || summaryLoading) {
    return null;
  }

  const getMemberName = (memberId: number) => {
    return meet.members?.find(m => m.ID === memberId)?.username || 'Unknown';
  };

  const handlePayClick = (fromMemberId: number, toMemberId: number, amount: number) => {
    setConfirmPayment({ fromMemberId, toMemberId, amount });
  };

  const handleConfirmPayment = () => {
    if (!confirmPayment || !id || !meet) return;

    const currentUserMemberId = session.userInfo?.ID;
    if (!currentUserMemberId) return;

    createPaymentMutation.mutate({
      meetId: id,
      name: 'Перевод',
      amount: confirmPayment.amount / 100,
      paidBy: confirmPayment.fromMemberId,
      currency: 'RUB',
      splitType: 'custom',
      members: [{
        ID: confirmPayment.toMemberId,
        name: getMemberName(confirmPayment.toMemberId),
        amount: confirmPayment.amount / 100,
      }],
    });
  };

  return (
    <div className="pb-32">
      <MeetDetailsHeader {...meet} />

      <div className="flex gap-4 mt-26 m-2">
        <SecondaryButton asChild>
          <Link to={`/meets/${id}/bills`}>Чеки</Link>
        </SecondaryButton>
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
              {summary.settlements.map((settlement, index) => {
                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg">
                          <span className="font-semibold">{getMemberName(settlement.from_member_id)}</span>
                          {' → '}
                          <span className="font-semibold">{getMemberName(settlement.to_member_id)}</span>
                        </div>
                        <div className="text-xl font-bold text-green-600 mt-1">
                          {(settlement.amount / 100).toLocaleString('ru-RU')} руб.
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handlePayClick(
                          settlement.from_member_id,
                          settlement.to_member_id,
                          settlement.amount
                        )}
                        className="ml-2"
                      >
                        Оплатить
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <MainButton linkTo={`/meets/${id}/add-bill`}>
        <Plus className="!size-7"/>
        Добавить чек
      </MainButton>

      <Dialog open={!!confirmPayment} onOpenChange={(open) => !open && setConfirmPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтвердить перевод</DialogTitle>
            <DialogDescription>
              {confirmPayment && (
                <>
                  Вы уверены, что хотите отправить перевод на сумму{' '}
                  <strong>{(confirmPayment.amount / 100).toLocaleString('ru-RU')} руб.</strong>{' '}
                  пользователю{' '}
                  <strong>{getMemberName(confirmPayment.toMemberId)}</strong>?
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmPayment(null)}>
              Отмена
            </Button>
            <Button onClick={handleConfirmPayment} disabled={createPaymentMutation.isPending}>
              {createPaymentMutation.isPending ? 'Отправка...' : 'Подтвердить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

