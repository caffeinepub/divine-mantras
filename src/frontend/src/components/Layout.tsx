import { Input } from "@/components/ui/input";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Brain,
  CalendarDays,
  Heart,
  Home,
  Layers,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { type Language, useAppContext } from "../contexts/AppContext";
import { useSearchMantras } from "../hooks/useQueries";

const navItems = [
  { to: "/", label: "Home", icon: Home, ocid: "nav.home.link" },
  {
    to: "/mantras",
    label: "Mantras",
    icon: BookOpen,
    ocid: "nav.mantras.link",
  },
  { to: "/stotras", label: "Stotras", icon: Layers, ocid: "nav.stotras.link" },
  {
    to: "/meditation",
    label: "Meditate",
    icon: Brain,
    ocid: "nav.meditation.link",
  },
  { to: "/daily", label: "Daily", icon: CalendarDays, ocid: "nav.daily.link" },
];

const langLabels: Record<Language, string> = { en: "EN", hi: "हिं", te: "తె" };

function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { data: results = [] } = useSearchMantras(query);
  const navigate = useNavigate();

  return (
    <div className="relative">
      {open ? (
        <div className="flex items-center gap-2">
          <Input
            data-ocid="header.search_input"
            className="w-48 h-8 text-sm bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            placeholder="Search mantras..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => {
              setTimeout(() => {
                setOpen(false);
                setQuery("");
              }, 200);
            }}
            autoFocus
          />
          {results.length > 0 && query && (
            <div className="absolute top-10 left-0 w-72 bg-white rounded-xl shadow-card-hover border border-border z-50 py-2">
              {results.slice(0, 6).map((m) => (
                <button
                  type="button"
                  key={m.id.toString()}
                  className="w-full text-left px-4 py-2 hover:bg-muted text-sm text-foreground"
                  onMouseDown={() => {
                    navigate({
                      to: "/mantras/$id",
                      params: { id: m.id.toString() },
                    });
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="font-medium">{m.name.english}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {m.sanskritText.slice(0, 40)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          data-ocid="header.search.button"
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setOpen(true)}
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useAppContext();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  };

  const languages: Language[] = ["en", "hi", "te"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-navy sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2"
            data-ocid="header.home.link"
          >
            <span className="text-2xl">🪷</span>
            <span className="text-white font-bold text-lg tracking-tight">
              Divine Mantras
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={item.ocid}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "bg-saffron text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/favorites"
              data-ocid="nav.favorites.link"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive("/favorites")
                  ? "bg-saffron text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Heart className="w-4 h-4" />
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-white/10 p-0.5 gap-0.5">
              {languages.map((lang) => (
                <button
                  type="button"
                  key={lang}
                  data-ocid={`lang.${lang}.toggle`}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    language === lang
                      ? "bg-saffron text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {langLabels[lang]}
                </button>
              ))}
            </div>
            <SearchBar />
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <footer className="hidden md:block bg-navy text-white/60 text-center py-4 text-sm">
        © {new Date().getFullYear()} Divine Mantras — Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-saffron hover:underline"
        >
          caffeine.ai
        </a>
      </footer>

      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden z-40 bottom-nav-safe"
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={`mobile.${item.ocid}`}
                className={`flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                  active
                    ? "text-saffron"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
