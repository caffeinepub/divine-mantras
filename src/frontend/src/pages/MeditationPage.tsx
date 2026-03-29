import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pause, Play, Square, Volume2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import MalaBeads from "../components/MalaBeads";
import { useAppContext } from "../contexts/AppContext";
import { useMantras } from "../hooks/useQueries";

type TimerOption = 5 | 11 | 21 | 0;
type SoundOption = "temple" | "river" | "om" | "silence";

const TIMER_OPTIONS: { value: TimerOption; label: string }[] = [
  { value: 5, label: "5 min" },
  { value: 11, label: "11 min" },
  { value: 21, label: "21 min" },
  { value: 0, label: "Custom" },
];

const SOUND_OPTIONS: { value: SoundOption; label: string; icon: string }[] = [
  { value: "temple", label: "Temple Bells", icon: "🔔" },
  { value: "river", label: "River Flow", icon: "🌊" },
  { value: "om", label: "Om Chanting", icon: "🕉️" },
  { value: "silence", label: "Silence", icon: "🤫" },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function MeditationPage() {
  const [timerMin, setTimerMin] = useState<TimerOption>(11);
  const [customMin, setCustomMin] = useState(10);
  const [sound, setSound] = useState<SoundOption>("temple");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(11 * 60);
  const [completed, setCompleted] = useState(false);
  const [selectedMantraId, setSelectedMantraId] = useState<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { data: mantras = [] } = useMantras();
  const { getText } = useAppContext();

  const totalSeconds = (timerMin === 0 ? customMin : timerMin) * 60;
  const beadsCompleted = Math.floor(
    ((totalSeconds - secondsLeft) / totalSeconds) * 108,
  );

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const secs = (timerMin === 0 ? customMin : timerMin) * 60;
    setSecondsLeft(secs);
    setCompleted(false);
  }, [timerMin, customMin]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            stopTimer();
            setRunning(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [running, stopTimer]);

  const handleStop = () => {
    stopTimer();
    setRunning(false);
    setSecondsLeft((timerMin === 0 ? customMin : timerMin) * 60);
    setCompleted(false);
  };

  const selectedMantra = mantras.find(
    (m) => m.id.toString() === selectedMantraId,
  );
  const progress =
    totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Meditation</h1>
        <p className="text-muted-foreground">
          Guided mantra meditation with mala bead counter
        </p>
      </div>

      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-navy to-secondary/80 rounded-3xl p-8 text-white text-center"
            data-ocid="meditation.success_state"
          >
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
            <p className="text-white/80 mb-2">
              You completed a {timerMin === 0 ? customMin : timerMin}-minute
              meditation session.
            </p>
            <p className="text-saffron font-devanagari text-2xl mb-6">
              ॐ शान्तिः
            </p>
            <button
              type="button"
              data-ocid="meditation.restart.button"
              onClick={handleStop}
              className="px-6 py-2.5 bg-saffron text-white rounded-xl font-semibold hover:bg-saffron/90 transition-colors"
            >
              Start New Session
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="session"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {!running && (
              <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
                <h2 className="font-bold text-foreground">Session Setup</h2>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Duration
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {TIMER_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        data-ocid={`meditation.timer.${opt.value}.button`}
                        onClick={() => setTimerMin(opt.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                          timerMin === opt.value
                            ? "bg-saffron text-white"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {timerMin === 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id="custom-time"
                        type="number"
                        data-ocid="meditation.custom_time.input"
                        min="1"
                        max="120"
                        value={customMin}
                        onChange={(e) => setCustomMin(Number(e.target.value))}
                        className="w-20 px-3 py-1.5 rounded-lg border border-border text-sm text-center"
                      />
                      <span className="text-sm text-muted-foreground">
                        minutes
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                    <Volume2 className="w-4 h-4" /> Background Sound
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {SOUND_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        data-ocid={`meditation.sound.${opt.value}.button`}
                        onClick={() => setSound(opt.value)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                          sound === opt.value
                            ? "bg-saffron text-white"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Mantra to Chant (optional)
                  </p>
                  <Select
                    value={selectedMantraId}
                    onValueChange={setSelectedMantraId}
                  >
                    <SelectTrigger
                      data-ocid="meditation.mantra.select"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select a mantra..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {mantras.slice(0, 20).map((m) => (
                        <SelectItem
                          key={m.id.toString()}
                          value={m.id.toString()}
                        >
                          {getText(m.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="bg-card rounded-2xl border border-border p-6 shadow-card text-center">
              <MalaBeads
                total={108}
                completed={Math.min(beadsCompleted, 108)}
                size={260}
              />
              <div className="mt-4">
                <div className="text-4xl font-bold text-foreground font-devanagari">
                  {formatTime(secondsLeft)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {running ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                      Meditating •{" "}
                      {SOUND_OPTIONS.find((s) => s.value === sound)?.icon}{" "}
                      {SOUND_OPTIONS.find((s) => s.value === sound)?.label}
                    </span>
                  ) : (
                    "Ready to begin"
                  )}
                </div>
              </div>
              {selectedMantra && (
                <div className="mt-4 bg-saffron/5 rounded-xl p-3">
                  <p className="text-xs text-saffron font-semibold mb-1">
                    Chanting
                  </p>
                  <p className="font-devanagari text-sm text-foreground">
                    {selectedMantra.sanskritText.slice(0, 60)}
                  </p>
                </div>
              )}
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-saffron rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                data-ocid="meditation.play_pause.button"
                onClick={() => setRunning((v) => !v)}
                className="w-16 h-16 rounded-full bg-saffron flex items-center justify-center shadow-lg hover:bg-saffron/90 transition-colors"
                aria-label={running ? "Pause" : "Start"}
              >
                {running ? (
                  <Pause className="w-7 h-7 text-white fill-white" />
                ) : (
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                )}
              </button>
              <button
                type="button"
                data-ocid="meditation.stop.button"
                onClick={handleStop}
                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                aria-label="Stop"
              >
                <Square className="w-5 h-5 text-muted-foreground fill-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
