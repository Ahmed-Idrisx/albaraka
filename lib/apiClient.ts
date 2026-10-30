import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends the httpOnly auth cookie to the API
});

/** The page's current language, taken from <html lang>. */
const pageLocale = () =>
  typeof document !== "undefined" && document.documentElement.lang === "en"
    ? "en"
    : "ar";

// The API answers errors in the language the page is showing.
apiClient.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = pageLocale();
  return config;
});

const FALLBACKS = {
  ar: { network: "تعذر الاتصال بالخادم، حاول مرة أخرى", unknown: "حدث خطأ غير متوقع" },
  en: { network: "Couldn't reach the server, please try again", unknown: "Something went wrong" },
};

/** The message the API sent (already in the page's language), or a readable fallback. */
export const getErrorMessage = (error: unknown): string => {
  const text = FALLBACKS[pageLocale()];
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? text.network;
  }
  if (error instanceof Error) return error.message;
  return text.unknown;
};
