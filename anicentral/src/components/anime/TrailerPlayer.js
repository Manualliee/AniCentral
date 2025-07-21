export default function TrailerPlayer({ trailer }) {
  // A map of supported sites and their embed URL templates
  const embedUrlTemplates = {
    youtube: "https://www.youtube.com/embed/",
    dailymotion: "https://www.dailymotion.com/embed/video/",
  };

  // Check if the trailer exists and if its site is one we support
  if (!trailer || !trailer.id || !embedUrlTemplates[trailer.site]) {
    return null;
  }

  // Build the final URL
  const videoUrl = `${embedUrlTemplates[trailer.site]}${trailer.id}`;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-3 border-b border-accent pb-2">
        Trailer
      </h2>
      <div className="aspect-video w-full">
        <iframe
          src={videoUrl}
          title="Anime Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg shadow-lg border-0"
        ></iframe>
      </div>
    </div>
  );
}
