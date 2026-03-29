import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import AudioPlayer from "../components/AudioPlayer";
import { SkeletonCard } from "../components/SkeletonCard";
import { type Language, useAppContext } from "../contexts/AppContext";
import { useDeities, useMantraById } from "../hooks/useQueries";

const langBtnClass = (active: boolean) =>
  `px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
    active
      ? "bg-saffron text-white"
      : "bg-muted text-muted-foreground hover:text-foreground"
  }`;

export default function MantraDetailPage() {
  const { id } = useParams({ from: "/mantras/$id" });
  const navigate = useNavigate();
  const mantraId = (() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  })();
  const { data: mantra, isLoading } = useMantraById(mantraId);
  const { data: deities = [] } = useDeities();
  const {
    getText,
    language,
    setLanguage,
    isFavorite,
    addFavorite,
    removeFavorite,
  } = useAppContext();

  const deity = deities.find((d) => mantra && d.id === mantra.deityId);
  const fav = mantra ? isFavorite(mantra.id) : false;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: mantra ? getText(mantra.name) : "Mantra",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <SkeletonCard className="h-96" />
      </div>
    );
  }

  if (!mantra) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-16 text-center"
        data-ocid="mantra.error_state"
      >
        <div className="text-5xl mb-4">🕉️</div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Mantra not found
        </h2>
        <button
          type="button"
          onClick={() => navigate({ to: "/mantras" })}
          className="text-saffron hover:underline"
        >
          ← Back to Mantras
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        type="button"
        data-ocid="mantra.back.button"
        onClick={() => navigate({ to: "/mantras" })}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Mantras</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-start justify-between mb-4">
            <div>
              {deity && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{deity.iconEmoji}</span>
                  <Badge
                    variant="outline"
                    className="text-xs text-teal border-teal/30"
                  >
                    {getText(deity.name)}
                  </Badge>
                </div>
              )}
              <h1 className="text-2xl font-bold text-foreground">
                {getText(mantra.name)}
              </h1>
              <Badge className="mt-2 bg-saffron/10 text-saffron border-saffron/20">
                {mantra.category}
              </Badge>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="mantra.share.button"
                onClick={handleShare}
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                data-ocid="mantra.favorite.toggle"
                onClick={() =>
                  fav ? removeFavorite(mantra.id) : addFavorite(mantra.id)
                }
                className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={fav}
              >
                <Heart
                  className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
              </button>
            </div>
          </div>

          <div className="bg-saffron/5 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-saffron mb-2 uppercase tracking-wider">
              Sanskrit
            </p>
            <p className="font-devanagari text-xl leading-relaxed text-foreground">
              {mantra.sanskritText}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
              Transliteration
            </p>
            <p className="text-sm text-foreground italic leading-relaxed">
              {mantra.transliteration}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground">Meaning</h2>
            <div className="flex gap-1">
              {(["en", "hi", "te"] as Language[]).map((lang) => (
                <button
                  type="button"
                  key={lang}
                  data-ocid={`mantra.lang.${lang}.toggle`}
                  onClick={() => setLanguage(lang)}
                  className={langBtnClass(language === lang)}
                >
                  {lang === "en" ? "EN" : lang === "hi" ? "हिं" : "తె"}
                </button>
              ))}
            </div>
          </div>
          <p
            className={`text-foreground leading-relaxed ${
              language === "hi"
                ? "font-devanagari"
                : language === "te"
                  ? "font-telugu"
                  : ""
            }`}
          >
            {getText(mantra.meaning)}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
          <h2 className="font-bold text-foreground mb-3">✨ Benefits</h2>
          <p
            className={`text-foreground leading-relaxed ${
              language === "hi"
                ? "font-devanagari"
                : language === "te"
                  ? "font-telugu"
                  : ""
            }`}
          >
            {getText(mantra.benefits)}
          </p>
        </div>

        <AudioPlayer
          audioUrl={mantra.audioUrl}
          mantraName={getText(mantra.name)}
        />
      </motion.div>
    </div>
  );
}
