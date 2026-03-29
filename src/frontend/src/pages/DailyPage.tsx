import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Sunrise } from "lucide-react";
import { motion } from "motion/react";
import { SkeletonCard } from "../components/SkeletonCard";
import { useAppContext } from "../contexts/AppContext";
import {
  useDailySuggestion,
  useMantraById,
  useMantras,
} from "../hooks/useQueries";

const DAY_DEITIES: Record<
  number,
  { deity: string; emoji: string; color: string; description: string }
> = {
  0: {
    deity: "Surya (Sun God)",
    emoji: "☀️",
    color: "bg-amber-50 border-amber-200",
    description:
      "Sunday is dedicated to Surya Narayana, the Sun God, source of light and life",
  },
  1: {
    deity: "Shiva",
    emoji: "🔱",
    color: "bg-blue-50 border-blue-200",
    description:
      "Monday (Somavar) is Lord Shiva's day — chant Shiva mantras for blessings and peace",
  },
  2: {
    deity: "Hanuman & Kali",
    emoji: "🚩",
    color: "bg-red-50 border-red-200",
    description:
      "Tuesday (Mangalavar) is dedicated to Hanuman and Kali — for strength and protection",
  },
  3: {
    deity: "Ganesha",
    emoji: "🐘",
    color: "bg-yellow-50 border-yellow-200",
    description:
      "Wednesday (Budhavar) is Lord Ganesha's day — remove obstacles and gain wisdom",
  },
  4: {
    deity: "Vishnu & Guru",
    emoji: "🌸",
    color: "bg-yellow-50 border-yellow-200",
    description:
      "Thursday (Guruvavar) — honor Vishnu and your Guru for knowledge and prosperity",
  },
  5: {
    deity: "Lakshmi",
    emoji: "🌺",
    color: "bg-pink-50 border-pink-200",
    description:
      "Friday (Shukravar) is Goddess Lakshmi's day — seek wealth, beauty, and harmony",
  },
  6: {
    deity: "Shani (Saturn)",
    emoji: "⚫",
    color: "bg-gray-50 border-gray-200",
    description:
      "Saturday (Shanivaar) is for Lord Shani — overcome obstacles and karmic lessons",
  },
};

const FESTIVALS = [
  {
    name: "Maha Shivaratri",
    date: "Feb 26",
    deity: "Shiva",
    emoji: "🔱",
    mantra: "OM Namah Shivaya",
  },
  {
    name: "Ram Navami",
    date: "Apr 6",
    deity: "Vishnu/Rama",
    emoji: "🏹",
    mantra: "Sri Ram Jai Ram",
  },
  {
    name: "Hanuman Jayanti",
    date: "Apr 15",
    deity: "Hanuman",
    emoji: "🚩",
    mantra: "Jai Hanuman",
  },
  {
    name: "Janmashtami",
    date: "Aug 16",
    deity: "Krishna",
    emoji: "🪈",
    mantra: "Hare Krishna",
  },
  {
    name: "Ganesh Chaturthi",
    date: "Aug 27",
    deity: "Ganesha",
    emoji: "🐘",
    mantra: "Jai Ganesha",
  },
  {
    name: "Navratri",
    date: "Oct 2-11",
    deity: "Durga",
    emoji: "⚡",
    mantra: "Jai Mata Di",
  },
  {
    name: "Diwali",
    date: "Oct 20",
    deity: "Lakshmi",
    emoji: "🪔",
    mantra: "Om Shreem Mahalakshmiyei",
  },
];

const WEEK_MANTRAS = [
  {
    title: "Gayatri Mantra",
    deity: "Surya",
    emoji: "☀️",
    text: "ॐ भूर्भुवः स्वः",
    benefit: "Universal prayer for enlightenment",
  },
  {
    title: "Maha Mrityunjaya",
    deity: "Shiva",
    emoji: "🔱",
    text: "ॐ त्र्यम्बकं यजामहे",
    benefit: "Protection and healing",
  },
  {
    title: "Vishnu Sahasranama",
    deity: "Vishnu",
    emoji: "🌸",
    text: "ॐ नमो भगवते वासुदेवाय",
    benefit: "Prosperity and liberation",
  },
];

function DayDeityCard() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayInfo = DAY_DEITIES[dayOfWeek];
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`rounded-2xl border p-6 ${dayInfo.color}`}
      data-ocid="daily.day_deity.card"
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl">{dayInfo.emoji}</div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {dayName}, {dateStr}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Deity of the Day: {dayInfo.deity}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {dayInfo.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function TodayMantra() {
  const { data: dailyId } = useDailySuggestion();
  const { data: mantra, isLoading } = useMantraById(dailyId ?? null);
  const { getText } = useAppContext();

  if (isLoading) return <SkeletonCard className="h-40" />;
  if (!mantra) return null;

  return (
    <Link
      to="/mantras/$id"
      params={{ id: mantra.id.toString() }}
      className="block bg-gradient-to-br from-navy to-secondary/80 rounded-2xl p-6 text-white hover:shadow-card-hover transition-shadow"
      data-ocid="daily.featured_mantra.card"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sunrise className="w-4 h-4 text-saffron" />
        <span className="text-xs font-semibold text-saffron uppercase tracking-wider">
          Featured Mantra Today
        </span>
      </div>
      <h3 className="font-bold text-lg text-white mb-2">
        {getText(mantra.name)}
      </h3>
      <p className="font-devanagari text-base text-white/80 leading-relaxed mb-2">
        {mantra.sanskritText.slice(0, 80)}
        {mantra.sanskritText.length > 80 ? "..." : ""}
      </p>
      <Badge className="bg-saffron/20 text-saffron border-saffron/30 text-xs">
        {mantra.category}
      </Badge>
    </Link>
  );
}

export default function DailyPage() {
  const { data: allMantras = [] } = useMantras();
  const { getText } = useAppContext();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Daily Practice
        </h1>
        <p className="text-muted-foreground">
          Your daily mantra guide and spiritual calendar
        </p>
      </div>

      <DayDeityCard />
      <TodayMantra />

      {/* Festival Calendar */}
      <section data-ocid="daily.festivals.section">
        <h2 className="text-xl font-bold text-foreground mb-4">
          🗓️ Upcoming Festivals
        </h2>
        <div className="space-y-3">
          {FESTIVALS.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
              data-ocid={`daily.festival.item.${i + 1}`}
            >
              <span className="text-2xl">{f.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{f.name}</div>
                <div className="text-xs text-muted-foreground">
                  {f.deity} • {f.date}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-devanagari text-saffron">
                  {f.mantra}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mantra of the Week */}
      <section data-ocid="daily.week_mantras.section">
        <h2 className="text-xl font-bold text-foreground mb-4">
          ⭐ Mantras of the Week
        </h2>
        <div className="grid gap-4">
          {WEEK_MANTRAS.map((m, i) => (
            <div
              key={m.title}
              className="bg-card rounded-xl border border-border p-4"
              data-ocid={`daily.week_mantra.item.${i + 1}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{m.emoji}</span>
                <div>
                  <div className="font-bold text-foreground">{m.title}</div>
                  <div className="text-xs text-teal mb-1">{m.deity}</div>
                  <div className="font-devanagari text-base text-foreground">
                    {m.text}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {m.benefit}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Mantras */}
      {allMantras.length > 0 && (
        <section data-ocid="daily.related_mantras.section">
          <h2 className="text-xl font-bold text-foreground mb-4">
            📿 Explore Mantras
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allMantras.slice(0, 4).map((m, i) => (
              <Link
                key={m.id.toString()}
                to="/mantras/$id"
                params={{ id: m.id.toString() }}
                className="bg-card rounded-xl border border-border p-4 card-hover shadow-card"
                data-ocid={`daily.mantra.item.${i + 1}`}
              >
                <div className="font-semibold text-foreground text-sm">
                  {getText(m.name)}
                </div>
                <div className="font-devanagari text-xs text-muted-foreground mt-1 line-clamp-1">
                  {m.sanskritText}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
