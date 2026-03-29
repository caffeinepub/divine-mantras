import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { SkeletonCard } from "../components/SkeletonCard";
import { type Language, useAppContext } from "../contexts/AppContext";
import { useStotraById } from "../hooks/useQueries";

export default function StotraDetailPage() {
  const { id } = useParams({ from: "/stotras/$id" });
  const navigate = useNavigate();
  const stotraId = (() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  })();
  const { data: stotra, isLoading } = useStotraById(stotraId);
  const { getText, language, setLanguage } = useAppContext();
  const [verseIndex, setVerseIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <SkeletonCard className="h-96" />
      </div>
    );
  }

  if (!stotra) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-16 text-center"
        data-ocid="stotra.error_state"
      >
        <p className="text-muted-foreground">Stotra not found.</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/stotras" })}
          className="text-saffron hover:underline mt-2"
        >
          ← Back to Stotras
        </button>
      </div>
    );
  }

  const verse = stotra.verses[verseIndex];
  const total = stotra.verses.length;
  const dotCount = Math.min(total, 8);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        type="button"
        data-ocid="stotra.back.button"
        onClick={() => navigate({ to: "/stotras" })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Stotras</span>
      </button>

      <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {getText(stotra.title)}
            </h1>
            <Badge variant="outline" className="mt-2 text-xs">
              {stotra.category}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">{total} verses</span>
        </div>
      </div>

      {verse && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Verse {verseIndex + 1} of {total}
            </span>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-saffron rounded-full transition-all"
                style={{ width: `${((verseIndex + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex gap-1">
            {(["en", "hi", "te"] as Language[]).map((lang) => (
              <button
                type="button"
                key={lang}
                data-ocid={`stotra.lang.${lang}.toggle`}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  language === lang
                    ? "bg-saffron text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "en" ? "EN" : lang === "hi" ? "हिं" : "తె"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={verseIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="bg-saffron/5 rounded-xl p-5 border border-saffron/10">
                <p className="text-xs text-saffron font-semibold mb-2 uppercase tracking-wider">
                  Sanskrit
                </p>
                <p className="font-devanagari text-xl leading-relaxed text-foreground">
                  {verse.sanskritText}
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">
                  Transliteration
                </p>
                <p className="text-sm italic text-foreground leading-relaxed">
                  {verse.transliteration}
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <p className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">
                  Meaning
                </p>
                <p
                  className={`text-foreground leading-relaxed ${
                    language === "hi"
                      ? "font-devanagari"
                      : language === "te"
                        ? "font-telugu"
                        : ""
                  }`}
                >
                  {getText(verse.meaning)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              data-ocid="stotra.pagination_prev"
              onClick={() => setVerseIndex((v) => Math.max(0, v - 1))}
              disabled={verseIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted text-sm font-medium disabled:opacity-40 hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: dotCount }, (_, dotIdx) => {
                const dotKey = `verse-dot-${dotIdx}`;
                const targetVerse = Math.floor(dotIdx * (total / dotCount));
                const isActiveDot =
                  dotIdx ===
                  Math.floor(verseIndex / Math.ceil(total / dotCount));
                return (
                  <button
                    type="button"
                    key={dotKey}
                    onClick={() => setVerseIndex(targetVerse)}
                    aria-label={`Go to verse ${targetVerse + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isActiveDot ? "bg-saffron" : "bg-muted-foreground/30"
                    }`}
                  />
                );
              })}
            </div>
            <button
              type="button"
              data-ocid="stotra.pagination_next"
              onClick={() => setVerseIndex((v) => Math.min(total - 1, v + 1))}
              disabled={verseIndex === total - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted text-sm font-medium disabled:opacity-40 hover:bg-muted/80 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
