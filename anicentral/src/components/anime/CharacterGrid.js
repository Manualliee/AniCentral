import Image from "next/image";
import Link from "next/link";

export default function CharacterGrid({ characters, pageInfo, onLoadMore, loading }) {
  return (
    <>
      <h2 className="text-2xl font-bold mt-8 mb-3 border-b border-accent pb-2">
        Characters & Voice Actors
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {characters?.edges?.map((edge) => (
          <div
            key={edge.node.id}
            className="flex items-stretch justify-between gap-2 p-4 rounded-lg border-1 border-border bg-muted/15 shadow-2xl"
          >
            {/* Character Card - This is one independent group */}
            <Link
              href={`https://anilist.co/character/${edge.node.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-1/2 aspect-[2/3] rounded-md overflow-hidden"
            >
              <Image
                src={edge.node.image?.large}
                alt={edge.node.name.full}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-background to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                <p className="font-bold text-sm">
                  {edge.node.name.full}
                </p>
                <p className="text-xs text-muted">{edge.role}</p>
              </div>
            </Link>

            {/* Voice Actor Card - This is a second, separate group */}
            <div className="w-1/2">
              {edge.voiceActors?.[0] ? (
                <Link
                  href={`https://anilist.co/staff/${edge.voiceActors[0].id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full h-full rounded-md overflow-hidden"
                >
                  <Image
                    src={edge.voiceActors[0].image?.large}
                    alt={edge.voiceActors[0].name.full}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-background to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <p className="font-bold text-sm">
                      {edge.voiceActors[0].name.full}
                    </p>
                    <p className="text-xs text-muted">VA (JP)</p>
                  </div>
                </Link>
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-md bg-muted/15">
                  <p className="text-xs text-muted">No VA</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        {pageInfo?.hasNextPage && (
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-accent rounded-lg disabled:bg-muted disabled:cursor-not-allowed hover:bg-accent-hover cursor-pointer transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </>
  );
}
