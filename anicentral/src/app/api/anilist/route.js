export async function POST(req) {
  const body = await req.json();
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    console.error("AniList error:", text);
  }
  return new Response(text, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}