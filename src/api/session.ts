import axios from './axios';

export const getSession = async (telegramUser: {
    first_name?: string;
    last_name?: string;
    id?: number | string;
    username?: string;
  } | null) => {
    const payload = {
      firstName: telegramUser?.first_name,
      lastName: telegramUser?.last_name,
      telegramID: telegramUser?.id,
      username: telegramUser?.username
    }

    const response = await axios.post('/auth/login/telegram', payload)

    return response.data;
  }

