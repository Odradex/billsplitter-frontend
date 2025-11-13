import axios from './axios';

export type Session = {
  userInfo: {
    ID?: number | string;
    Username?: string;
    FirstName?: string;
    LastName?: string;
    Extra?: {
      TelegramID?: number;
    }
  }
  sessionID?: string | null;
}

export const getSession = async (telegramUser: {
    first_name?: string;
    last_name?: string;
    id?: number | string;
    username?: string;
  } | null) : Promise<Session> => {
  const payload = {
    firstName: telegramUser?.first_name,
    lastName: telegramUser?.last_name,
    telegramID: telegramUser?.id,
    username: telegramUser?.username
  }

  const response = await axios.post('/auth/login/telegram', payload)

  return response.data;
}
