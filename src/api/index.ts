import axios from 'axios';


export class Api {
  static baseUrl = 'https://rnthl-45-82-33-43.a.free.pinggy.link';

  static async getSession(telegramUser: {
    first_name?: string;
    last_name?: string;
    id?: number | string;
    username?: string;
  } | null) {
    const payload = {
      firstName: telegramUser?.first_name,
      lastName: telegramUser?.last_name,
      telegramID: telegramUser?.id,
      username: telegramUser?.username
    }
    const response = await axios.post(`${this.baseUrl}/auth/login/telegram`, payload)
    if (response.status !== 200) {
      throw new Error('Failed to get session');
    }
    return response.data;
  }
}