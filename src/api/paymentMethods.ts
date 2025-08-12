import axios from './axios'

export interface PaymentMethod {
  id: string
  title: string
  description: string
  details?: string
  created_at: string
}

export interface CreatePaymentMethodData {
  title: string
  description: string
  details?: string
}

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const response = await axios.get('/payment_methods')

  return response.data.paymentMethods
}

export const createPaymentMethod = async (data: CreatePaymentMethodData): Promise<PaymentMethod> => {
  const payload = {
    NAME: data.title,
    DESCRIPTION: data.description,
    RECIPIENT: data.details,
  }

  const response = await axios.post('/payment_methods', payload)
  return response.data
} 