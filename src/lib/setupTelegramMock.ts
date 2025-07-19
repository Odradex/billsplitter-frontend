import { mockTelegramEnv } from "@telegram-apps/sdk-react";

export const setupTelegramMock = () => {
  if (!import.meta.env.DEV || !import.meta.env.VITE_MOCK_TG ) return;

  const mockUser = {
    id: 123456,
    first_name: "Dev User",
    username: "dev_user",
    language_code: "en",
    is_premium: false
  };

  const authDate = Math.floor(Date.now() / 1000);
  
  const queryParams = new URLSearchParams({
    user: JSON.stringify(mockUser),
    auth_date: authDate.toString(),
    hash: "mock_hash_value",
    signature: "mock_signature_value",
  });

  mockTelegramEnv({
    launchParams: new URLSearchParams({
      tgWebAppData: queryParams.toString(),
      tgWebAppVersion: "6.7",
      tgWebAppPlatform: "web",
      tgWebAppThemeParams: JSON.stringify({
        bg_color: "#ffffff",
        text_color: "#000000",
        hint_color: "#999999",
        link_color: "#168acd",
        button_color: "#40a7e3",
        button_text_color: "#ffffff"
      })
    }),
    resetPostMessage: true
  });

  console.debug("[DEV] Telegram WebApp environment mocked");
};
