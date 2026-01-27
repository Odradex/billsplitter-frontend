import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { getBills } from '@/api/bills';

export const BillsPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: bills, isLoading } = useQuery({
    queryKey: ['bills', id],
    queryFn: () => getBills(Number(id)),
    enabled: !!id,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  if (isLoading || !bills) {
    return null;
  }

  // Sort bills by created_at date (newest first)
  const sortedBills = [...bills].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${(amount / 100).toLocaleString('ru-RU')} ${currency}`;
  };

  return (
    <div className="pb-8 px-4">
      <h1 className="text-2xl font-bold mb-6 mt-4">Чеки</h1>
      
      {sortedBills.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Чеков пока нет</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBills.map((bill) => (
            <div
              key={bill.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{bill.name}</h3>
                <span className="text-xl font-bold text-green-600">
                  {formatAmount(bill.total_amount, bill.currency)}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>Тип: {bill.split_type}</p>
                <p>Участников: {bill.participants.length}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(bill.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
