import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

export default function TrendingCarousel({ animeList }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Defensive: loading or empty state
  if (!isClient) return null;
  if (!animeList) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <span>Loading trending anime...</span>
      </div>
    );
  }
  if (!Array.isArray(animeList) || animeList.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <span>No trending anime found.</span>
      </div>
    );
  }

  return (
    <Swiper
      key={isClient ? "client" : "server"}
      modules={[Pagination, Autoplay, EffectFade]}
      effect="fade"
      slidesPerView={1}
      loop
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      className="h-[620px] mb-8 shadow-xl mask-b-from-90%"
    >
      {animeList
        .filter((anime) => anime && anime.id && anime.coverImage?.extraLarge)
        .map((anime) => (
          <SwiperSlide key={anime.id}>
            <div className="relative w-full h-full flex items-center justify-center sm:items-end sm:justify-start overflow-hidden">
              {/* Blurred, darkened banner background */}
              <Image
                src={anime.bannerImage || anime.coverImage.extraLarge}
                alt={anime.title.romaji}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-center blur-md scale-110 brightness-50"
                aria-hidden="true"
                draggable={false}
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              {/* Text and poster */}
              <div className="relative z-10 p-4 pb-8 max-w-xl w-full flex flex-col items-center text-center sm:p-6 sm:pb-10 sm:max-w-2xl sm:flex-row sm:items-end sm:text-left sm:gap-6">
                {/* Poster image */}
                <div className="flex justify-center items-center w-full sm:w-auto mb-4 sm:mb-0">
                  <Image
                    src={anime.coverImage.extraLarge}
                    alt={anime.title.romaji}
                    width={300}
                    height={450}
                    className="rounded-lg shadow-lg object-cover w-full h-auto max-w-[220px] max-h-[50vh] sm:w-[220px] sm:h-[330px]"
                    draggable={false}
                    priority
                  />
                </div>
                <div className="w-full">
                  <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl drop-shadow mb-2">
                    {anime.title.english ||
                      anime.title.romaji ||
                      anime.title.native}
                  </h2>
                  {anime.description && (
                    <p
                      className="text-white/80 text-sm sm:text-base line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{
                        __html: anime.description.replace(/<[^>]+>/g, ""),
                      }}
                    />
                  )}
                  {/* Read More button */}
                  <Link
                    href={`/anime/${anime.id}`}
                    className="inline-block mt-2 px-5 py-2 rounded bg-accent font-semibold shadow hover:bg-accent/90 transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
