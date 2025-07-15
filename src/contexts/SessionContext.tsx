import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { Api } from '@/api';

export type Session = {
  telegramUser?: object | null;
  sessionId?: string | null;
  error?: string | null;
  isGuest?: boolean;
}

export type SessionContextType = {
  session: Session;
  setSession: (session: Session) => void;
}

const SessionContext = createContext<SessionContextType>({
  session: { telegramUser: null, sessionId: null, error: null, isGuest: false },
  setSession: () => {},
});

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session>({});
  const launchParams = useLaunchParams();

  useEffect(() => {
    async function fetchSession() {
      const telegramUser = launchParams.tgWebAppData?.user || null;

      if (!telegramUser) {
        // Fallback: guest session
        setSession({
          telegramUser: null,
          sessionId: null,
          error: null,
          isGuest: true,
        });
        return;
      }

      try {
        const result = await Api.getSession(telegramUser);
        if (result?.error) {
          setSession({ telegramUser, sessionId: null, error: result.error, isGuest: false });
        } else {
          setSession({ telegramUser, sessionId: result, error: null, isGuest: false });
        }
      } catch {
        setSession({ telegramUser, sessionId: null, error: 'Failed to get session', isGuest: false });
      }
    }
    fetchSession();
  }, [launchParams]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => {
  const sessionContext = useContext(SessionContext).session;
  if (!sessionContext) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return sessionContext;
}