export interface Debt {
  id: string;
  amount: number;
  memberInfo: {
    id: string;
    name: string;
  }
}