import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useLaunchParams as realUseLaunchParams } from '@telegram-apps/sdk-react';
import { getSession } from '@/api/session';
import { useQuery } from '@tanstack/react-query';
import { setAxiosHeaders } from '@/api/axios';

export type Session = {
  telegramUser?: object | null;
  sessionID?: string | null;
  error?: string | null;
  isGuest?: boolean;
};

export type SessionContextType = {
  session: Session;
};

const SessionContext = createContext<SessionContextType>({
  session: { telegramUser: null, sessionID: null, error: null, isGuest: false },
});

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const launchParams = realUseLaunchParams();

  const telegramUser = launchParams?.tgWebAppData?.user ??
    (import.meta.env.DEV ? {
      id: 123456,
      first_name: 'Dev',
      username: 'dev_user',
    } : null);

  // Fallback: guest session
  const defaultSession: Session = {
    telegramUser: null,
    sessionID: null,
    error: null,
    isGuest: true
  };

  const { data: session = defaultSession } = useQuery({
    queryKey: ['session', telegramUser, launchParams],
    queryFn: async (): Promise<Session> => {
      if (!telegramUser) {
        return defaultSession;
      }

      try {
        const result = await getSession(telegramUser);
        if (result?.error) {
          return {
            telegramUser,
            sessionID: null,
            error: result.error,
            isGuest: false
          };
        }
        return {
          telegramUser,
          sessionID: result.sessionID,
          error: null,
          isGuest: false
        };
      } catch {
        return {
          telegramUser,
          sessionID: null,
          error: 'Failed to get session',
          isGuest: false
        };
      }
    },
    enabled: !!launchParams,
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
  const sessionContext = useContext(SessionContext).session;
  if (!sessionContext) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return sessionContext;
};
