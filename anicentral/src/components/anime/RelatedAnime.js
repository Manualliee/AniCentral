import Image from "next/image";
import Link from "next/link";

// Helper to format relation types like "SEQUEL" into "Sequel"
function formatRelationType(type) {
  if (!type) return "";
  return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function RelatedAnime({ relations }) {
  // Don't render the component if there are no relations
  if (!relations || !relations.edges || relations.edges.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-3 border-b border-accent pb-2">
        Related Media
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {relations.edges.map(({ node, relationType }) => {
          // Determine the correct link based on the media type
          const isAnime = node.type === "ANIME";
          const href = isAnime
            ? `/anime/${node.id}`
            : `https://anilist.co/manga/${node.id}`;
          const target = isAnime ? "_self" : "_blank"; // Open external links in a new tab

          return (
            <Link
              href={href}
              key={node.id}
              target={target}
              rel={!isAnime ? "noopener noreferrer" : undefined}
              className="group space-y-2"
            >
              <div className="aspect-[2/3] relative rounded-md overflow-hidden">
                {node.coverImage?.large && (
                  <Image
                    src={node.coverImage.large}
                    alt={node.title?.romaji || "Related media cover"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
                <div className="absolute top-0 right-0 bg-background/70 text-xs font-semibold px-2 py-1 rounded-bl-md">
                  {formatRelationType(relationType)}
                </div>
              </div>
              <p className="text-sm font-semibold group-hover:text-accent-hover transition-colors">
                {node.title?.english || node.title?.romaji}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
