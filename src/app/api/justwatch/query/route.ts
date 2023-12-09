import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { JUSTWATCH_GRAPHQL } from "@/constants/endpoint";

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
    originalReleaseYear
    posterUrl
    fullPath
    __typename
  }
  watchNowOffer(country: $country, platform: WEB) {
    id
    standardWebURL
    __typename
  }
  offers(country: $country, platform: WEB) {
    presentationType
    standardWebURL
    id
    __typename
  }
  __typename
}`;

export async function GET(req: NextRequest) {
  const searchQuery = req.nextUrl.searchParams.get("query");

  try {
    const response = await axios.request({
      method: "POST",
      url: JUSTWATCH_GRAPHQL,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        query,
        variables: {
          country: "ID",
          language: "en",
          first: 10,
          filter: {
            searchQuery,
          },
        },
      }),
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.error();
  }
}
