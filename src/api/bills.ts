import instance from './axios'
import type { Bill } from '../models/bill.model'

export async function getBills(eventId: number): Promise<Bill[]> {
  const response = await instance.get<Bill[]>('/bills', {
    params: {
      event_id: eventId,
    },
  })
  return response.data
}
