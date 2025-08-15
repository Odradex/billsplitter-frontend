import axios from './axios'

export interface PaymentMethodData {
  id?: number,
  name: string
  description: string
  recipient?: string
}

export const getPaymentMethods = async (): Promise<PaymentMethodData[]> => {
  const response = await axios.get('/payment_methods')

  return response.data.paymentMethods
}

export const createPaymentMethod = async (data: PaymentMethodData): Promise<PaymentMethodData> => {
  const payload = {
    NAME: data.name,
    DESCRIPTION: data.description,
    RECIPIENT: data.recipient,
  }

  const response = await axios.post('/payment_methods', payload)
  return response.data
}

export const updatePaymentMethod = async ({
    id,
    name,
    description,
    recipient,
  }: PaymentMethodData) => {
    const response = await axios.put(`/payment_methods/${id}`, {
      name,
      description,
      recipient,
    });
    return response.data;
  };

  export const deletePaymentMethod = async (id: number) => {
    const response = await axios.delete(`/payment_methods/${id}`);
    return response.data;
  };
