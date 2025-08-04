import type { Debt } from '@/models/debt.model';
import type { Meet } from '@/models/meet.model';
import axios from "axios";

export const getMeet = async (id: string): Promise<Meet> => {
  return { // Пока что заглушка, нужно будет заменить на реальный запрос
    id: id,
    name: `Покер`,
    date: new Date().toLocaleDateString(),
    members: ['Денис', 'Даник', 'Матвей', 'Кирилл'],
  }

  const response = await axios.get(`/meet/${id}`);
  return response.data;
}

export const getDebtsByMeetId = async (meetId: string): Promise<Debt[]> => {
  // Здесь должен быть реальный запрос к API для получения долгов по meetId
  return [
    {
      id: '1',
      amount: -1923,
      memberInfo: {
        id: '1',
        name: 'Денис'
      }
    },
    {
      id: '2',
      amount: -2300,
      memberInfo: {
        id: '2',
        name: 'Даник'
      }
    },
    {
      id: '3',
      amount: 0,
      memberInfo: {
        id: '3',
        name: 'Матвей'
      }
    },
    {
      id: '4',
      amount: 500,
      memberInfo: {
        id: '4',
        name: 'Кирилл'
      }
    }
  ];

  const response = await axios.get(`/debts?meetId=${meetId}`);
  return response.data;
}