import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export const getTelegramLaunchParams = () => {
  try {
    return retrieveLaunchParams();
  } catch {
    console.warn('Failed to retrieve launch parameters, using mock data in development');
    return {
      tgWebAppData: {
        user: {
          id: 123456,
          first_name: 'Dev',
          username: 'dev_user',
        },
      },
    };
  }
}