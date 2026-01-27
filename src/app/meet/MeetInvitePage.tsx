import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMeetByInvite, assignUserToMember } from "@/api/meet";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { MainButton } from "@/components/MainButton";
import { ArrowLeft, Users, Calendar } from "lucide-react";
import { Link } from "react-router";

export const MeetInvitePage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const { data: meet, isLoading, error } = useQuery({
    queryKey: ['meet-invite', uuid],
    queryFn: () => getMeetByInvite(uuid!),
    enabled: !!uuid,
  });

  const assignMutation = useMutation({
    mutationFn: ({ meetId, memberId }: { meetId: number; memberId: number }) =>
      assignUserToMember(meetId, memberId),
    onSuccess: () => {
      // Redirect to meet details page after successful assignment
      if (meet) {
        navigate(`/meets/${meet.ID}`);
      }
    },
    onError: (error: any) => {
      console.error('Error assigning user to member:', error);
      alert('Не удалось присоединиться к встрече. Попробуйте еще раз.');
    },
  });

  const handleMemberSelect = (memberId: number) => {
    if (!meet) return;
    assignMutation.mutate({ meetId: meet.ID, memberId });
  };

  if (isLoading) {
    return (
      <>
        <Header>
          <div className="flex items-center gap-2">
            <Users />
            Приглашение
          </div>
        </Header>
        <div className="mt-20 p-4 flex items-center justify-center">
          <p className="text-lg text-gray-600">Загрузка...</p>
        </div>
      </>
    );
  }

  if (error || !meet) {
    return (
      <>
        <Header>
          <div className="flex items-center gap-2">
            <Users />
            Приглашение
          </div>
        </Header>
        <div className="mt-20 p-4 space-y-4">
          <Card className="p-6 bg-red-50 border-red-200">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Ошибка</h2>
            <p className="text-red-600">Приглашение не найдено или недействительно.</p>
          </Card>
          <Link to="/meets">
            <MainButton>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Вернуться к встречам
            </MainButton>
          </Link>
        </div>
      </>
    );
  }

  const unassignedMembers = meet.members.filter(m => !m.user_id);

  if (unassignedMembers.length === 0) {
    return (
      <>
        <Header>
          <div className="flex items-center gap-2">
            <Users />
            {meet.name}
          </div>
        </Header>
        <div className="mt-20 p-4 space-y-4">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Все участники назначены</h2>
            <p className="text-blue-600">Все участники этой встречи уже присоединились.</p>
          </Card>
          <Link to={`/meets/${meet.ID}`}>
            <MainButton>
              Перейти к встрече
            </MainButton>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <Users />
          Присоединиться к встрече
        </div>
      </Header>

      <div className="mt-20 mb-24 p-4 space-y-6">
        {/* Meet Info */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{meet.name}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{new Date(meet.event_date).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
        </Card>

        {/* Instructions */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-700">Выберите себя из списка</h2>
          <p className="text-sm text-gray-600">
            Нажмите на свое имя, чтобы присоединиться к встрече
          </p>
        </div>

        {/* Member List */}
        <div className="space-y-3">
          {unassignedMembers.map((member) => (
            <Card
              key={member.ID}
              className="p-5 bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all shadow-sm hover:shadow-md active:scale-98"
              onClick={() => handleMemberSelect(member.ID)}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">{member.username}</span>
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </Card>
          ))}
        </div>

        {assignMutation.isPending && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-center text-blue-800 font-medium">Присоединяемся...</p>
          </Card>
        )}
      </div>
    </>
  );
};
