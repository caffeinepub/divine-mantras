import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pause, Play, Repeat, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  mantraName: string;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || Number.isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  audioUrl,
  mantraName,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  const handleError = useCallback(() => setError(true), []);

  // Reset state when URL changes
  const prevUrlRef = useRef(audioUrl);
  if (prevUrlRef.current !== audioUrl) {
    prevUrlRef.current = audioUrl;
    setError(false);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }

  // Attach audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
      );
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [handleError]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
  }, [loop]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = Number.parseFloat(speed);
    }
  }, [speed]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setError(true);
      }
    }
  };

  const handleReset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  const handleProgressKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    if (e.key === "ArrowRight")
      audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
    if (e.key === "ArrowLeft")
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
  };

  return (
    <div className="bg-gradient-to-br from-navy to-secondary/90 rounded-2xl p-5 text-white">
      {/* biome-ignore lint/a11y/useMediaCaption: no captions available for Sanskrit chant recordings */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onError={handleError}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white/80">
          🎵 {mantraName}
        </span>
        {error && (
          <span className="text-xs text-orange-300 bg-orange-900/30 px-2 py-0.5 rounded-full">
            Audio unavailable
          </span>
        )}
      </div>

      {error ? (
        <div
          data-ocid="audio.error_state"
          className="flex flex-col items-center justify-center py-6 text-white/50"
        >
          <span className="text-3xl mb-2">🔇</span>
          <p className="text-sm">
            Audio recording unavailable for this mantra.
          </p>
          <p className="text-xs mt-1 text-white/30">
            Try another mantra or check your connection.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div
              className="h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProgressClick}
              onKeyDown={handleProgressKeyDown}
              role="slider"
              tabIndex={0}
              aria-label="Audio progress"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-saffron rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-ocid="audio.play_button"
                onClick={handlePlayPause}
                className="w-11 h-11 rounded-full bg-saffron flex items-center justify-center shadow-md hover:bg-saffron/90 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white fill-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                )}
              </button>

              <button
                type="button"
                data-ocid="audio.reset_button"
                onClick={handleReset}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Reset"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                data-ocid="audio.loop_toggle"
                onClick={() => setLoop((v) => !v)}
                className={`p-2 rounded-lg transition-colors ${
                  loop ? "bg-saffron/40" : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label="Toggle loop"
                aria-pressed={loop}
              >
                <Repeat className="w-4 h-4 text-white" />
              </button>
            </div>

            <Select value={speed} onValueChange={setSpeed}>
              <SelectTrigger
                data-ocid="audio.speed.select"
                className="w-20 h-8 bg-white/10 border-white/20 text-white text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5×</SelectItem>
                <SelectItem value="1">1×</SelectItem>
                <SelectItem value="1.5">1.5×</SelectItem>
                <SelectItem value="2">2×</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loop && (
            <p className="text-xs text-saffron mt-3 text-center animate-pulse">
              🔁 Loop mode active
            </p>
          )}
        </>
      )}
    </div>
  );
}
