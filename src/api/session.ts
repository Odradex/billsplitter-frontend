import axios from './axios';

export type Session = {
  UserInfo: {
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
    firstName: 'aaa',
    lastName: 'bbb',
    telegramID: 12123123,
    username: 'ggdfgfd'
  }

  debugger
  const response = await axios.post('/auth/login/telegram', payload)

  return response.data;
}
