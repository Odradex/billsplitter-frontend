import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { Plus } from 'lucide-react';
import { getMeet } from '@/api/meet';
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
  });

  if (isLoading || !meet) {
    return null;
  }

  return (
    <div>
      <MeetDetailsHeader {...meet} />

      <div className="flex gap-4 mt-26 m-2">
        <SecondaryButton>Чеки</SecondaryButton>
        <SecondaryButton>Переводы</SecondaryButton>
      </div>

      <hr className="m-4 border-t-2" />

      <MeetDetailsBalanceList meet={meet} />

      <MainButton linkTo={`/meet/${id}/add-bill`}>
        <Plus className="!size-7"/>
        Добавить чек
      </MainButton>
    </div>
  );
};

