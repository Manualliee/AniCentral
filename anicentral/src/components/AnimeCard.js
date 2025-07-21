"use client";
import Image from "next/image";
import { formatDate } from "@/lib/anilist";
import { useRouter } from "next/navigation";

export default function AnimeCard({ anime, onClick }) {
  return (
    <div
      className="w-[250px] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border border-border relative"
      onClick={(event) => onClick(anime, event)}
    >
      <div className="w-full aspect-[2/3] relative">
        <Image
          src={anime.coverImage.extraLarge}
          alt={anime.title.romaji}
          fill
          sizes="(max-width: 768px) 100vw, 250px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <h2 className="absolute bottom-0 left-0 p-3 font-semibold text-base line-clamp-2">
        {anime.title.english || anime.title.romaji || anime.title.native}
      </h2>
    </div>
  );
}

export function AnimeModal({ anime, animationOrigin, onClose }) {
  const router = useRouter();

  if (!anime) return null;

  const handleReadMore = (e) => {
    e.stopPropagation();
    router.push(`/anime/${anime.id}`);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-modalSlideIn"
        onClick={(e) => e.stopPropagation()}
        style={{
          "--origin-x": `${animationOrigin.x}px`,
          "--origin-y": `${animationOrigin.y}px`,
          "--origin-width": `${animationOrigin.width}px`,
          "--origin-height": `${animationOrigin.height}px`,
        }}
      >

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-[200px] aspect-[2/3] relative flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={anime.coverImage.extraLarge}
              alt={anime.title.romaji}
              fill
              className="object-cover rounded"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {anime.title.english || anime.title.romaji}
            </h1>
            {anime.title.native && (
                <p className="text-md text-muted mb-4">{anime.title.native}</p>
            )}

            <div className="space-y-3 border-t border-accent pt-4 [&>p]:text-muted [&>p>strong]:text-foreground">
              <p>
                <strong className="font-semibold">Date Aired:</strong> {formatDate(anime.startDate)}
              </p>
              <p>
                <strong className="font-semibold">Date Ended:</strong> {formatDate(anime.endDate, anime.status)}
              </p>
              <p>
                <strong className="font-semibold">Episodes:</strong> {anime.status === 'RELEASING' && !anime.episodes ? 'Airing' : anime.episodes || "Unknown"}
              </p>
              {anime.title.romaji !== anime.title.english && (
                <p>
                  <strong className="font-semibold">Romaji Title:</strong> {anime.title.romaji}
                </p>
              )}
          
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleReadMore}
                className="px-6 py-3 bg-accent rounded-lg font-semibold cursor-pointer hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-[0_2px_8px_0_rgba(57,255,20,0.13)] hover:shadow-[0_4px_16px_0_rgba(0,230,118,0.18)]"
              >
                Read More
              </button>
              <button
                onClick={onClose}
                className="bg-border cursor-pointer px-6 py-3 rounded-lg font-semibold hover:bg-border/50  transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}