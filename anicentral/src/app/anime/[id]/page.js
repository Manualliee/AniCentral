"use client";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Banner from "@/components/anime/Banner";
import DetailsCard from "@/components/anime/DetailsCard";
import CharacterGrid from "@/components/anime/CharacterGrid";
import TrailerPlayer from "@/components/anime/TrailerPlayer";
import RelatedAnime from "@/components/anime/RelatedAnime";
import { useAnimeDetails } from "@/hooks/useAnimeDetails";

export default function AnimeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { anime, isLoading, error, characters, loadMoreCharacters, loadingMore } = useAnimeDetails(id);

 
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  // If loading is done and there's no error, but anime is still null,
  // it means something went wrong, but we can show a generic error.
  if (!anime) return <ErrorMessage message="Could not load anime data." />;

  return (
    <div className="min-h-screen">
      <Banner anime={anime} />

      <div className="relative max-w-5xl mx-auto p-4 sm:p-8 -mt-20">
        <div className="bg-card rounded-xl shadow-xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <DetailsCard anime={anime} />

            {/* Right Column: Title, Description, and Genres */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold">
                  {anime.title?.english || anime.title?.romaji}
                </h1>
                <button
                  onClick={() => router.back()}
                  className="flex-shrink-0 ml-4 px-4 py-2 bg-accent rounded-lg font-semibold cursor-pointer hover:bg-accent-hover transition-colors"
                >
                  &larr; Back
                </button>
              </div>

              {anime.title?.native && (
                <p className="text-lg text-muted mb-6 -mt-2">
                  {anime.title.native}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                {anime.genres?.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-3 border-b border-accent pb-2">
                Description
              </h2>
              <div
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    anime.description || "<p>No description available.</p>",
                }}
              />

              <TrailerPlayer trailer={anime.trailer} />
              <CharacterGrid 
                characters={characters} 
                pageInfo={characters?.pageInfo}
                onLoadMore={loadMoreCharacters}
                loading={loadingMore}
              />
              <RelatedAnime relations={anime.relations} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
