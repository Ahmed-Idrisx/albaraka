import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends the httpOnly auth cookie to the API
});

/** Pulls the Arabic message the API sends, with a readable fallback. */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ?? "تعذر الاتصال بالخادم، حاول مرة أخرى"
    );
  }
  if (error instanceof Error) return error.message;
  return "حدث خطأ غير متوقع";
};
