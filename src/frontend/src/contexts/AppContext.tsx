import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { MultilingualText } from "../backend";

export type Language = "en" | "hi" | "te";

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  getText: (text: MultilingualText | undefined) => string;
  favorites: bigint[];
  addFavorite: (id: bigint) => void;
  removeFavorite: (id: bigint) => void;
  isFavorite: (id: bigint) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [favorites, setFavorites] = useState<bigint[]>([]);

  const getText = useCallback(
    (text: MultilingualText | undefined): string => {
      if (!text) return "";
      if (language === "hi") return text.hindi || text.english;
      if (language === "te") return text.telugu || text.english;
      return text.english;
    },
    [language],
  );

  const addFavorite = useCallback((id: bigint) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFavorite = useCallback((id: bigint) => {
    setFavorites((prev) => prev.filter((f) => f !== id));
  }, []);

  const isFavorite = useCallback(
    (id: bigint) => favorites.includes(id),
    [favorites],
  );

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        getText,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
