import Image from "next/image";

export default function Banner({ anime }) {
  return (
    <div className="relative w-full h-64 md:h-85">
      {anime.bannerImage && (
        <Image
          src={anime.bannerImage}
          alt={`${anime.title?.romaji || "Anime"} banner`}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}