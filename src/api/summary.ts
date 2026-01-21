import axiosInstance from './axios';

export interface Balance {
  balance: number;
  member_id: number;
  name: string;
  total_paid: number;
  total_share: number;
  user_id: number;
}

export interface Settlement {
  amount: number;
  from_member_id: number;
  to_member_id: number;
}

export interface MeetSummary {
  balances: Balance[];
  settlements: Settlement[];
}

export const getMeetSummary = async (meetId: string): Promise<MeetSummary> => {
  const { data } = await axiosInstance.get<MeetSummary>(`/meets/${meetId}/summary`);
  return data;
};
