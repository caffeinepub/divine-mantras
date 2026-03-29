import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { BookOpen, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { SkeletonCard } from "../components/SkeletonCard";
import { useAppContext } from "../contexts/AppContext";
import { useStotras } from "../hooks/useQueries";

export default function StotrasPage() {
  const { data: stotras = [], isLoading } = useStotras();
  const { getText } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Stotras</h1>
        <p className="text-muted-foreground">
          Complete sacred hymns and prayers
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} className="h-24" />
          ))}
        </div>
      ) : stotras.length === 0 ? (
        <div data-ocid="stotras.empty_state" className="text-center py-16">
          <div className="text-5xl mb-4">📖</div>
          <p className="text-muted-foreground text-lg">
            No stotras available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {stotras.map((stotra, i) => (
            <motion.div
              key={stotra.id.toString()}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`stotra.item.${i + 1}`}
            >
              <Link
                to="/stotras/$id"
                params={{ id: stotra.id.toString() }}
                className="flex items-center gap-4 bg-card rounded-2xl border border-border p-5 card-hover shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-saffron" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground">
                    {getText(stotra.title)}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {stotra.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {stotra.verses.length} verses
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
