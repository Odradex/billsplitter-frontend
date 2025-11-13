import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useLaunchParams as realUseLaunchParams } from '@telegram-apps/sdk-react';
import { getSession, type Session } from '@/api/session';
import { useQuery } from '@tanstack/react-query';
import { setAxiosHeaders } from '@/api/axios';

export type SessionType = Session & {
  isGuest?: boolean;
  error?: string | null;
  telegramUser?: object | null;
}

export type SessionContextType = {
  session: SessionType;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const launchParams = realUseLaunchParams();

  const telegramUser = launchParams?.tgWebAppData?.user ??
    (import.meta.env.VITE_MOCK_TG ? {
      id: 123456,
      first_name: 'Dev',
      username: 'dev_user',
    } : null);

  // Fallback: guest session
  const defaultSession: SessionType = {
    UserInfo: {
      ID: '1',
      Username: 'DevUserName',
      FirstName: 'DevFirstName',
      LastName: 'DevLastName',
      Extra: {
        TelegramID: 123456,
      }
    },
    telegramUser: telegramUser || null,
    sessionID: '0c8023a2-0fca-426c-ab61-3ee72e30de60'
  }

  const { data: session = defaultSession } = useQuery({
    queryKey: ['session', telegramUser],
    queryFn: async (): Promise<SessionType> => {
      try {
        const result = await getSession(telegramUser);

        return {
          ...result,
          telegramUser,
          isGuest: false
        };
      } catch (e: any) {
        return {
          ...defaultSession,
          telegramUser,
          sessionID: null,
          error: e?.message || 'Failed to get session',
          isGuest: false
        };
      }
    },
    enabled: launchParams?.tgWebAppData?.user && !import.meta.env.VITE_MOCK_TG,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!session.sessionID) return;

    setAxiosHeaders({ 'X-Session-ID': session.sessionID })
  }, [session])

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
  const sessionContext = useContext(SessionContext);
  if (!sessionContext) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return sessionContext;
};
