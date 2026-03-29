import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";
import { SkeletonCard, SkeletonGrid } from "../components/SkeletonCard";
import { useAppContext } from "../contexts/AppContext";
import {
  useDailySuggestion,
  useDeities,
  useMantraById,
} from "../hooks/useQueries";

const FEATURE_ITEMS = [
  {
    icon: "🕉️",
    title: "1000+ Mantras",
    desc: "Complete library covering all major Hindu deities and occasions",
    key: "mantras",
  },
  {
    icon: "🔊",
    title: "Audio Recitations",
    desc: "High-quality chanting with loop mode and adjustable speed",
    key: "audio",
  },
  {
    icon: "📿",
    title: "Mala Counter",
    desc: "Traditional 108-bead counter for mantra japa practice",
    key: "mala",
  },
];

function DeityCard({
  deity,
}: {
  deity: {
    id: bigint;
    iconEmoji: string;
    name: { english: string; hindi: string; telugu: string };
    description: { english: string; hindi: string; telugu: string };
  };
}) {
  const { getText } = useAppContext();
  return (
    <Link
      to="/mantras"
      search={{ deity: deity.id.toString() } as never}
      className="bg-card rounded-2xl border border-border p-4 card-hover shadow-card flex flex-col items-center gap-2 text-center cursor-pointer"
      data-ocid={`deity.item.${Number(deity.id)}`}
    >
      <div className="w-14 h-14 rounded-full bg-saffron-light flex items-center justify-center text-2xl shadow-inner">
        {deity.iconEmoji}
      </div>
      <span className="font-semibold text-sm text-foreground leading-tight">
        {getText(deity.name)}
      </span>
      <span className="text-xs text-muted-foreground line-clamp-2">
        {getText(deity.description)}
      </span>
    </Link>
  );
}

function TodayMantraCard() {
  const { data: dailyId } = useDailySuggestion();
  const { data: mantra, isLoading } = useMantraById(dailyId ?? null);
  const { getText } = useAppContext();
  const navigate = useNavigate();

  if (isLoading || dailyId === undefined)
    return <SkeletonCard className="h-48" />;
  if (!mantra) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-navy via-secondary/80 to-navy rounded-2xl p-6 text-white cursor-pointer shadow-card-hover"
      onClick={() =>
        navigate({ to: "/mantras/$id", params: { id: mantra.id.toString() } })
      }
      data-ocid="home.daily_mantra.card"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-saffron" />
        <span className="text-xs font-semibold text-saffron uppercase tracking-wider">
          Today's Mantra
        </span>
      </div>
      <p className="font-devanagari text-xl font-semibold text-white mb-2 leading-relaxed">
        {mantra.sanskritText.slice(0, 80)}
        {mantra.sanskritText.length > 80 ? "..." : ""}
      </p>
      <p className="text-sm text-white/70 italic mb-3">
        {mantra.transliteration.slice(0, 60)}...
      </p>
      <p className="text-sm text-white/80">
        {getText(mantra.meaning).slice(0, 100)}...
      </p>
      <Badge className="mt-3 bg-saffron/20 text-saffron border-saffron/30">
        {mantra.category}
      </Badge>
    </motion.div>
  );
}

export default function HomePage() {
  const { data: deities = [], isLoading: loadingDeities } = useDeities();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
        data-ocid="home.hero.section"
      >
        <div className="inline-flex items-center gap-2 bg-saffron/10 text-saffron px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-saffron/20">
          <span>🪷</span> Sacred Mantras & Stotras
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
          Sacred Mantras for
          <br />
          <span className="text-saffron">Divine Connection</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Explore thousands of Hindu mantras, stotras, and guided meditation
          sessions to deepen your spiritual practice.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          <Link
            to="/mantras"
            data-ocid="home.explore_mantras.button"
            className="px-6 py-2.5 bg-saffron text-white rounded-xl font-semibold shadow-md hover:bg-saffron/90 transition-colors"
          >
            Explore Mantras
          </Link>
          <Link
            to="/meditation"
            data-ocid="home.start_meditation.button"
            className="px-6 py-2.5 bg-secondary text-white rounded-xl font-semibold shadow-md hover:bg-secondary/90 transition-colors"
          >
            Start Meditation
          </Link>
        </div>
      </motion.section>

      <section className="mb-12" data-ocid="home.today.section">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Today's Mantra
        </h2>
        <TodayMantraCard />
      </section>

      <section className="mb-12" data-ocid="home.quick_access.section">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Link
            to="/stotras"
            data-ocid="home.stotras.card"
            className="bg-card rounded-2xl border border-border p-5 card-hover shadow-card text-center"
          >
            <div className="text-3xl mb-2">📖</div>
            <div className="font-semibold text-foreground">Stotras</div>
            <div className="text-xs text-muted-foreground mt-1">
              Full sacred hymns
            </div>
          </Link>
          <Link
            to="/meditation"
            data-ocid="home.meditation.card"
            className="bg-card rounded-2xl border border-border p-5 card-hover shadow-card text-center"
          >
            <div className="text-3xl mb-2">🧘</div>
            <div className="font-semibold text-foreground">Meditation</div>
            <div className="text-xs text-muted-foreground mt-1">
              Guided sessions
            </div>
          </Link>
          <Link
            to="/favorites"
            data-ocid="home.favorites.card"
            className="bg-card rounded-2xl border border-border p-5 card-hover shadow-card text-center"
          >
            <div className="text-3xl mb-2">❤️</div>
            <div className="font-semibold text-foreground">Favorites</div>
            <div className="text-xs text-muted-foreground mt-1">
              Your saved mantras
            </div>
          </Link>
        </div>
      </section>

      <section data-ocid="home.deities.section">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-saffron" />
          <h2 className="text-2xl font-bold text-foreground">
            Explore by Deity
          </h2>
        </div>
        {loadingDeities ? (
          <SkeletonGrid count={8} />
        ) : deities.length === 0 ? (
          <div
            data-ocid="deities.empty_state"
            className="text-center py-12 text-muted-foreground"
          >
            <div className="text-4xl mb-3">🕉️</div>
            <p>Loading sacred deities...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {deities.map((deity) => (
              <DeityCard key={deity.id.toString()} deity={deity} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16 mb-8" data-ocid="home.features.section">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURE_ITEMS.map((f) => (
            <div
              key={f.key}
              className="bg-card rounded-2xl border border-border p-6 shadow-card"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg text-foreground mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="md:hidden text-center text-xs text-muted-foreground mt-8 pb-4">
        © {new Date().getFullYear()} — Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-saffron hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
