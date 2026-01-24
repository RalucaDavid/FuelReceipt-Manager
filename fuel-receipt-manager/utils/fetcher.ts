import { Dictionary } from "@/dictionaries";

export const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || Dictionary.anErrorHadOccurred);
    throw error;
  }

  return res.json();
};
