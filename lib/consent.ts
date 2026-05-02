// lib/consent.ts
export type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "cookie_consent_v1";

export const getConsent = (): ConsentPreferences | null => {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setConsent = (prefs: ConsentPreferences) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};

export const hasConsented = () => {
  return !!getConsent();
};