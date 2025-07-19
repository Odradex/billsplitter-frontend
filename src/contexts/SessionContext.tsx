import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLaunchParams as realUseLaunchParams, type LaunchParams } from '@telegram-apps/sdk-react';
import { getSession } from '@/api/session';
import { useQuery } from '@tanstack/react-query';

export type Session = {
  telegramUser?: object | null;
  sessionId?: string | null;
  error?: string | null;
  isGuest?: boolean;
};

export type SessionContextType = {
  session: Session;
};

const SessionContext = createContext<SessionContextType>({
  session: { telegramUser: null, sessionId: null, error: null, isGuest: false },
});

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [launchParams, setLaunchParams] = useState<LaunchParams | null>(null);

  // Wrap useLaunchParams in try/catch safely
  useEffect(() => {
    try {
      const params = realUseLaunchParams();
      setLaunchParams(params);
    } catch (e) {
      console.warn('[Telegram SDK] Failed to get launch params:', e);
      setLaunchParams(null);
    }
  }, []);

  const telegramUser = launchParams?.tgWebAppData?.user ??
    (import.meta.env.DEV ? {
      id: 123456,
      first_name: 'Dev',
      username: 'dev_user',
    } : null);

  // Fallback: guest session
  const defaultSession: Session = {
    telegramUser: null,
    sessionId: null,
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
            sessionId: null,
            error: result.error,
            isGuest: false
          };
        }
        return {
          telegramUser,
          sessionId: result,
          error: null,
          isGuest: false
        };
      } catch {
        return {
          telegramUser,
          sessionId: null,
          error: 'Failed to get session',
          isGuest: false
        };
      }
    },
    enabled: !!launchParams,
  });

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
