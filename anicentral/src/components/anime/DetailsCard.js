import Image from "next/image";

export default function DetailsCard({ anime }) {
  // Helper function to format the season and year
  function formatSeason(season, year) {
    if (!season || !year) return "N/A";
    // Capitalize the first letter of the season
    return `${
      season.charAt(0).toUpperCase() + season.slice(1).toLowerCase()
    } ${year}`;
  }

  // Helper function to format the source material
  function formatSource(source) {
    if (!source) return "N/A";
    // Replace underscores with spaces and capitalize each word
    return source.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }

  return (
    <div className="md:col-span-1 space-y-6">
      <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl bg-background -mt-24 md:-mt-40">
        {anime.coverImage?.extraLarge && (
          <Image
            src={anime.coverImage.extraLarge}
            alt={anime.title?.romaji || "Anime cover image"}
            fill
            className="object-cover"
            // Add the 'sizes' prop for responsive optimization
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="space-y-3 text-sm [&>p]:text-muted [&>p>strong]:text-foreground">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 border-b border-accent pb-2 mb-3">
          Details
        </h3>
        <p>
          <strong className="font-semibold">
            Type:
          </strong>{" "}
          {anime.format || "N/A"}
        </p>
        <p>
          <strong className="font-semibold">
            Episodes:
          </strong>{" "}
          {/* If status is RELEASING and episodes is null, show Airing. Otherwise, show episode count or N/A */}
          {anime.status === "RELEASING" && !anime.episodes
            ? "Airing"
            : anime.episodes || "N/A"}
        </p>
        <p>
          <strong className="font-semibold">
            Duration:
          </strong>{" "}
          {anime.duration ? `${anime.duration} min per ep` : "N/A"}
        </p>
        <p>
          <strong className="font-semibold">
            Status:
          </strong>{" "}
          {anime.status || "N/A"}
        </p>
        <p>
          <strong className="font-semibold">
            Aired:
          </strong>{" "}
          {formatSeason(anime.season, anime.seasonYear)}
        </p>
        <p>
          <strong className="font-semibold">
            Score:
          </strong>{" "}
          {anime.averageScore ? `${anime.averageScore} / 100` : "N/A"}
        </p>
        <p>
          <strong className="font-semibold">
            Studio:
          </strong>{" "}
          {anime.studios?.edges?.find((edge) => edge.isMain)?.node?.name ||
            "N/A"}
        </p>
        <p>
          <strong className="font-semibold">
            Source:
          </strong>{" "}
          {formatSource(anime.source)}
        </p>
      </div>
    </div>
  );
}
