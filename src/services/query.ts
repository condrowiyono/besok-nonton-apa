import axios from "axios";
import { JUSTWATCH_GRAPHQL } from "@/constants/endpoint";
import { QueryResponse } from "@/interfaces/justwatch";

const query = `query GetSuggestedTitles($country: Country!, $language: Language!, $first: Int!, $filter: TitleFilter) {
  popularTitles(country: $country, first: $first, filter: $filter) {
    edges {
      node {
        ...SuggestedTitle
        __typename
      }
      __typename
    }
    __typename
  }
}

fragment SuggestedTitle on MovieOrShow {
  id
  objectType
  objectId
  content(country: $country, language: $language) {
    fullPath
    title
    originalTitle
    originalReleaseYear
    shortDescription
    ageCertification
    runtime
    fullPosterUrl: posterUrl(profile: S332, format: WEBP)
    fullBackdrops: backdrops(profile: S640, format: WEBP) {
      backdropUrl
    }
    genres {
      translation(language: $language)
    }
    credits {
      name
    }
    scoring {
      imdbScore,
      imdbVotes
    }
  }
  watchNowOffer(country: $country, platform: WEB) {
    id
    standardWebURL
    package {
      clearName
    }
  }
  offers(country: $country, platform: WEB) {
    standardWebURL
    package {
      clearName
    }
  }
  __typename
}`;

export function querySuggestedTitles(searchQuery?: string) {
  return axios.request<QueryResponse>({
    method: "POST",
    url: JUSTWATCH_GRAPHQL,
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify({
      query,
      variables: {
        country: "ID",
        language: "en",
        first: 16,
        filter: {
          searchQuery,
        },
      },
    }),
  });
}
