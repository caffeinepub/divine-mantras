import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Mantra } from "../backend";
import { SkeletonGrid } from "../components/SkeletonCard";
import { useAppContext } from "../contexts/AppContext";
import { useDeities, useMantras } from "../hooks/useQueries";

function MantraCard({ mantra, index }: { mantra: Mantra; index: number }) {
  const { getText, isFavorite, addFavorite, removeFavorite } = useAppContext();
  const fav = isFavorite(mantra.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <div
        className="bg-card rounded-2xl border border-border p-5 card-hover shadow-card relative"
        data-ocid={`mantra.item.${index + 1}`}
      >
        <button
          type="button"
          data-ocid={`mantra.favorite.toggle.${index + 1}`}
          onClick={(e) => {
            e.preventDefault();
            fav ? removeFavorite(mantra.id) : addFavorite(mantra.id);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={fav}
        >
          <Heart
            className={`w-4 h-4 ${fav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
          />
        </button>
        <Link to="/mantras/$id" params={{ id: mantra.id.toString() }}>
          <Badge
            variant="outline"
            className="text-xs mb-2 text-saffron border-saffron/30 bg-saffron/5"
          >
            {mantra.category}
          </Badge>
          <h3 className="font-bold text-foreground mb-1 pr-6">
            {getText(mantra.name)}
          </h3>
          <p className="font-devanagari text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {mantra.sanskritText}
          </p>
          <p className="text-xs text-muted-foreground mt-2 italic line-clamp-1">
            {mantra.transliteration}
          </p>
        </Link>
      </div>
    </motion.div>
  );
}

export default function MantrasPage() {
  const { data: deities = [] } = useDeities();
  const { data: allMantras = [], isLoading } = useMantras();
  const { getText } = useAppContext();
  const [selectedDeity, setSelectedDeity] = useState<string>("all");

  const filtered =
    selectedDeity === "all"
      ? allMantras
      : allMantras.filter((m) => m.deityId.toString() === selectedDeity);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Mantras</h1>
        <p className="text-muted-foreground">
          Sacred chants for every deity and occasion
        </p>
      </div>

      <div className="overflow-x-auto pb-2 mb-6" data-ocid="mantras.filter.tab">
        <div className="flex gap-2 min-w-max">
          <button
            type="button"
            data-ocid="mantras.all.tab"
            onClick={() => setSelectedDeity("all")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              selectedDeity === "all"
                ? "bg-saffron text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All Mantras
          </button>
          {deities.map((deity) => (
            <button
              type="button"
              key={deity.id.toString()}
              data-ocid={`mantras.deity.tab.${Number(deity.id)}`}
              onClick={() => setSelectedDeity(deity.id.toString())}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                selectedDeity === deity.id.toString()
                  ? "bg-saffron text-white shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{deity.iconEmoji}</span>
              <span>{getText(deity.name)}</span>
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <div data-ocid="mantras.empty_state" className="text-center py-16">
          <div className="text-5xl mb-4">🕉️</div>
          <p className="text-muted-foreground text-lg">
            No mantras found for this deity yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mantra, i) => (
            <MantraCard key={mantra.id.toString()} mantra={mantra} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
