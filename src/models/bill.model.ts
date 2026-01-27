export interface BillParticipant {
  amount: number;
  member_id: number;
}

export interface Bill {
  id: number;
  name: string;
  event_id: number;
  created_by_user_id: number;
  paid_by: number;
  total_amount: number;
  currency: string;
  split_type: string;
  participants: BillParticipant[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
