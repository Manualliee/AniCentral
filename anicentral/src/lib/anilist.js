const LOCAL_ANILIST_API = "/api/anilist";

async function fetchAniListDataProxy(query, variables = {}, options = {}) {
  const response = await fetch(LOCAL_ANILIST_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors.map((e) => e.message).join("\n"));
  }
  return data;
}

export const GET_POPULAR_ANIME = `
    query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            hasNextPage
            currentPage
            total
          }
            media(sort: POPULARITY_DESC, type: ANIME, isAdult: false, genre_not_in: ["hentai"]) {
                id
                relations {
                    edges {
                        relationType
                        node {
                            id
                            format
                            title {
                                romaji
                                english
                            }
                        }
                    }
                }
                title {
                    romaji
                    english
                    native
                }
                coverImage {
                    extraLarge
                    large
                    medium
                }
                status
                episodes
                genres
                startDate {
                    year
                    month
                    day
                }
                endDate {
                    year
                    month
                    day
                }
            }
        }
    }
`;

const GET_ANIME_DETAILS = `
  query ($id: Int, $page:Int) {
    Media(id: $id, type: ANIME) {
      characters(page: $page, perPage: 25, sort: [ROLE, RELEVANCE, ID]) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
          voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      id
      title {
        english
        romaji
        native
      }
      description
      coverImage {
        extraLarge
        large
      }
      bannerImage
      episodes
      duration
      status
      averageScore
      popularity
      season
      seasonYear
      format
      source
      genres
      studios {
        edges {
          isMain
          node {
            name
          }
        }
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      trailer {
        id
        site
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              english
              romaji
            }
            format
            type
            coverImage {
              large
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_ANIME = `
  query ($search: String, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        hasNextPage
        currentPage
        total
      }
        media(search: $search, type: ANIME, isAdult: false, genre_not_in: ["hentai"]) {
          id
          relations {
            edges {
              relationType
              node {
                id
                format
                title {
                  romaji
                  english
                }
              }
            }
          }
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            medium
          }
          status
          episodes
          genres
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
        }
    }
  }
`;

// Shared filter function
// This function filters out sequels and continuations from the anime list
// It checks if the anime has any relations that are of type "PREQUEL" and
// are of format "TV"
function filterOutSequels(animeList) {
  return animeList.filter((anime) => {
    const isSequel = anime.relations.edges.some(
      (edge) => edge.relationType === "PREQUEL" && edge.node?.format === "TV"
    );
    return !isSequel;
  });
}

export async function getAnimeDetails(id, options = {}) {
   const result = await fetchAniListDataProxy(
    GET_ANIME_DETAILS,
    { id: parseInt(id, 10) },
    options
  );
  return result.data.Media;
}

// Async function to search anime by title with pagination
export async function searchAnimeByTitle(searchTerm, page = 1, perPage = 25) {
  try {
    const data = await fetchAniListDataProxy(SEARCH_ANIME, {
      search: searchTerm,
      page: page,
      perPage: perPage,
    });
    const rawAnime = data.data.Page.media;
    const pageInfo = data.data.Page.pageInfo;
    const filteredAnime = filterOutSequels(rawAnime);
    return {
      anime: filteredAnime,
      pageInfo: pageInfo,
    };
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
}

// Async function to fetch popular anime with pagination (with GraphQL defaults)
export async function fetchPopularAnime(page = 1, perPage = 25) {
  try {
    const data = await fetchAniListDataProxy(GET_POPULAR_ANIME, {
      page,
      perPage,
    });
    const rawAnime = data.data.Page.media;
    const pageInfo = data.data.Page.pageInfo;
    const filteredAnime = filterOutSequels(rawAnime);
    return {
      anime: filteredAnime,
      pageInfo: pageInfo,
    };
  } catch (error) {
    console.error("Error fetching popular anime:", error);
    throw error;
  }
}

// Utility function to format AniList date objects
export function formatDate(dateObj, status) {
  // If the status is RELEASING and there's no date, it's currently airing.
  if (status === "RELEASING" && (!dateObj || !dateObj.year)) {
    return "Ongoing";
  }

  if (!dateObj || !dateObj.year) return "Unknown";

  const { year, month, day } = dateObj;

  if (month && day) {
    // Create a proper Date object and format it
    const date = new Date(year, month - 1, day); // month is 1-indexed, Date constructor expects 0-indexed
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else if (month) {
    // Format just month and year
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  } else {
    return year.toString();
  }
}

const CHARACTERS_ONLY_QUERY = `
  query ($id: Int, $page: Int) {
    Media(id: $id, type: ANIME) {
      characters(sort: [ROLE, RELEVANCE, ID], page: $page, perPage: 25) {
        pageInfo {
          currentPage
          lastPage
          hasNextPage
        }
        edges {
          id
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
          voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
    }
  }
`;

export async function getMoreCharacters(id, page) {
  const result = await fetchAniListDataProxy(CHARACTERS_ONLY_QUERY, {
    id: parseInt(id, 10),
    page: page,
  });
  return result.data.Media.characters;
}

export async function fetchTrendingAnime(page = 1, perPage = 5) {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
            native
          }
          bannerImage
          coverImage {
            extraLarge
          }
          description
        }
      }
    }
  `;
  const variables = { page, perPage };
  const data = await fetchAniListDataProxy(query, variables);
  return { anime: data.data.Page.media };
}
