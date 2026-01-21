import type { Debt } from '@/models/debt.model';
import type { Meet } from '@/models/meet.model';
import axios from './axios'

export const getMeets = async (): Promise<Meet[]> => {
  const reponse = await axios.get('/meets');

  return reponse.data;
}

type CreateMeetPayload = {
  name: string;
  date: string;
  members: string[];
}

export const createMeet = async (payload: CreateMeetPayload): Promise<{ID: number}> => {
  const response = await axios.post('/meets', payload);

  return response.data;
}

export const getMeet = async (id: string): Promise<Meet> => {
  const response = await axios.get(`/meets/${id}`);

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

export interface CreateBillData {
  meetId: string;
  name: string;
  amount: number;
  paidBy: number;
  currency?: string;
  splitType?: string;
  members: Array<{
    ID: number;
    name: string;
    amount: number;
  }>;
  images?: File[];
}

export const createBill = async (data: CreateBillData): Promise<void> => {
  // Convert amounts from decimal to integer (cents)
  const totalAmountInCents = Math.round(data.amount * 100);
  
  const response = await axios.post('/bills', {
    currency: data.currency || 'RUB',
    event_id: parseInt(data.meetId),
    name: data.name,
    paid_by: data.paidBy,
    participants: data.members.map(member => ({
      member_id: member.ID,
      amount: Math.round(member.amount * 100), // Convert to cents
    })),
    split_type: data.splitType || 'custom',
    total_amount: totalAmountInCents
  });
  
  return response.data;
}
