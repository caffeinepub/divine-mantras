import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { BookOpen, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../contexts/AppContext";
import { useMantras, useStotras } from "../hooks/useQueries";

export default function FavoritesPage() {
  const { favorites, removeFavorite, getText } = useAppContext();
  const { data: allMantras = [] } = useMantras();
  const { data: allStotras = [] } = useStotras();

  const favMantras = allMantras.filter((m) => favorites.includes(m.id));
  const favStotras = allStotras.filter((s) => favorites.includes(s.id));
  const total = favMantras.length + favStotras.length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Favorites</h1>
        <p className="text-muted-foreground">{total} saved items</p>
      </div>

      {total === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
          data-ocid="favorites.empty_state"
        >
          <div className="text-5xl mb-4">🪷</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No favorites yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Tap the heart icon on any mantra or stotra to save it here.
          </p>
          <Link
            to="/mantras"
            data-ocid="favorites.explore.button"
            className="px-6 py-2.5 bg-saffron text-white rounded-xl font-semibold shadow-md hover:bg-saffron/90 transition-colors"
          >
            Explore Mantras
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {favMantras.length > 0 && (
            <section data-ocid="favorites.mantras.section">
              <h2 className="text-lg font-bold text-foreground mb-3">
                Mantras ({favMantras.length})
              </h2>
              <div className="space-y-3">
                {favMantras.map((mantra, i) => (
                  <motion.div
                    key={mantra.id.toString()}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl border border-border p-4 flex items-start gap-4"
                    data-ocid={`favorites.mantra.item.${i + 1}`}
                  >
                    <Link
                      to="/mantras/$id"
                      params={{ id: mantra.id.toString() }}
                      className="flex-1 min-w-0"
                    >
                      <Badge
                        variant="outline"
                        className="text-xs mb-1 text-saffron border-saffron/30"
                      >
                        {mantra.category}
                      </Badge>
                      <h3 className="font-bold text-foreground">
                        {getText(mantra.name)}
                      </h3>
                      <p className="font-devanagari text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {mantra.sanskritText}
                      </p>
                    </Link>
                    <button
                      type="button"
                      data-ocid={`favorites.mantra.delete_button.${i + 1}`}
                      onClick={() => removeFavorite(mantra.id)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                      aria-label="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {favStotras.length > 0 && (
            <section data-ocid="favorites.stotras.section">
              <h2 className="text-lg font-bold text-foreground mb-3">
                Stotras ({favStotras.length})
              </h2>
              <div className="space-y-3">
                {favStotras.map((stotra, i) => (
                  <motion.div
                    key={stotra.id.toString()}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl border border-border p-4 flex items-start gap-4"
                    data-ocid={`favorites.stotra.item.${i + 1}`}
                  >
                    <Link
                      to="/stotras/$id"
                      params={{ id: stotra.id.toString() }}
                      className="flex-1 min-w-0 flex items-start gap-3"
                    >
                      <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-saffron" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">
                          {getText(stotra.title)}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {stotra.verses.length} verses • {stotra.category}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      data-ocid={`favorites.stotra.delete_button.${i + 1}`}
                      onClick={() => removeFavorite(stotra.id)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                      aria-label="Remove from favorites"
                    >
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
