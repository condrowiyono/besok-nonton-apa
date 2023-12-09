import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

import { JUSTWATCH_GRAPHQL } from "@/constants/endpoint";

const query = `query GetUrlTitleDetails($fullPath: String!, $country: Country!, $language: Language!, $episodeMaxLimit: Int, $platform: Platform! = WEB) {
  urlV2(fullPath: $fullPath) {
    node {
      id
      __typename
      ... on MovieOrShowOrSeason {
        plexPlayerOffers: offers(
          country: $country
          platform: $platform
          filter: {packages: ["pxp"]}
        ) {
          id
          standardWebURL
          package {
            id
            packageId
            clearName
            technicalName
            shortName
            __typename
          }
          __typename
        }
        disneyOffersCount: offerCount(
          country: $country
          platform: $platform
          filter: {packages: ["dnp"]}
        )
        objectType
        objectId
        offerCount(country: $country, platform: $platform)
        offers(country: $country, platform: $platform) {
          monetizationType
          elementCount
          package {
            id
            packageId
            clearName
            __typename
          }
          __typename
        }
        watchNowOffer(country: $country, platform: $platform) {
          id
          standardWebURL
          __typename
        }
        promotedBundles(country: $country, platform: $platform) {
          promotionUrl
          __typename
        }
        availableTo(country: $country, platform: $platform) {
          availableCountDown(country: $country)
          availableToDate
          package {
            id
            shortName
            __typename
          }
          __typename
        }
        fallBackClips: content(country: "US", language: "en") {
          videobusterClips: clips(providers: [VIDEOBUSTER]) {
            ...TrailerClips
            __typename
          }
          dailymotionClips: clips(providers: [DAILYMOTION]) {
            ...TrailerClips
            __typename
          }
          __typename
        }
        content(country: $country, language: $language) {
          backdrops {
            backdropUrl
            __typename
          }
          fullBackdrops: backdrops(profile: S1920, format: JPG) {
            backdropUrl
            __typename
          }
          clips {
            ...TrailerClips
            __typename
          }
          videobusterClips: clips(providers: [VIDEOBUSTER]) {
            ...TrailerClips
            __typename
          }
          dailymotionClips: clips(providers: [DAILYMOTION]) {
            ...TrailerClips
            __typename
          }
          externalIds {
            imdbId
            __typename
          }
          fullPath
          genres {
            shortName
            __typename
          }
          posterUrl
          fullPosterUrl: posterUrl(profile: S718, format: JPG)
          runtime
          isReleased
          scoring {
            imdbScore
            imdbVotes
            tmdbPopularity
            tmdbScore
            __typename
          }
          shortDescription
          title
          originalReleaseYear
          originalReleaseDate
          upcomingReleases(releaseTypes: DIGITAL) {
            releaseCountDown(country: $country)
            releaseDate
            label
            package {
              id
              packageId
              shortName
              clearName
              __typename
            }
            __typename
          }
          ... on MovieOrShowContent {
            originalTitle
            ageCertification
            credits {
              role
              name
              characterName
              personId
              __typename
            }
            productionCountries
            __typename
          }
          ... on SeasonContent {
            seasonNumber
            __typename
          }
          __typename
        }
        popularityRank(country: $country) {
          rank
          trend
          trendDifference
          __typename
        }
        __typename
      }
      ... on MovieOrShow {
        watchlistEntryV2 {
          createdAt
          __typename
        }
        likelistEntry {
          createdAt
          __typename
        }
        dislikelistEntry {
          createdAt
          __typename
        }
        customlistEntries {
          createdAt
          genericTitleList {
            id
            __typename
          }
          __typename
        }
        __typename
      }
      ... on Movie {
        permanentAudiences
        seenlistEntry {
          createdAt
          __typename
        }
        __typename
      }
      ... on Show {
        permanentAudiences
        totalSeasonCount
        seenState(country: $country) {
          progress
          seenEpisodeCount
          __typename
        }
        tvShowTrackingEntry {
          createdAt
          __typename
        }
        seasons(sortDirection: DESC) {
          id
          objectId
          objectType
          totalEpisodeCount
          availableTo(country: $country, platform: $platform) {
            availableToDate
            availableCountDown(country: $country)
            package {
              id
              shortName
              __typename
            }
            __typename
          }
          content(country: $country, language: $language) {
            posterUrl
            seasonNumber
            fullPath
            title
            upcomingReleases(releaseTypes: DIGITAL) {
              releaseDate
              releaseCountDown(country: $country)
              package {
                id
                shortName
                __typename
              }
              __typename
            }
            isReleased
            originalReleaseYear
            __typename
          }
          show {
            id
            objectId
            objectType
            watchlistEntryV2 {
              createdAt
              __typename
            }
            content(country: $country, language: $language) {
              title
              __typename
            }
            __typename
          }
          __typename
        }
        recentEpisodes: episodes(
          sortDirection: DESC
          limit: 10
          releasedInCountry: $country
        ) {
          id
          objectId
          content(country: $country, language: $language) {
            title
            shortDescription
            episodeNumber
            seasonNumber
            isReleased
            upcomingReleases {
              releaseDate
              label
              __typename
            }
            __typename
          }
          seenlistEntry {
            createdAt
            __typename
          }
          __typename
        }
        __typename
      }
      ... on Season {
        totalEpisodeCount
        episodes(limit: $episodeMaxLimit) {
          id
          objectType
          objectId
          seenlistEntry {
            createdAt
            __typename
          }
          content(country: $country, language: $language) {
            title
            shortDescription
            episodeNumber
            seasonNumber
            isReleased
            upcomingReleases(releaseTypes: DIGITAL) {
              releaseDate
              label
              package {
                id
                packageId
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        show {
          id
          objectId
          objectType
          totalSeasonCount
          customlistEntries {
            createdAt
            genericTitleList {
              id
              __typename
            }
            __typename
          }
          tvShowTrackingEntry {
            createdAt
            __typename
          }
          fallBackClips: content(country: "US", language: "en") {
            videobusterClips: clips(providers: [VIDEOBUSTER]) {
              ...TrailerClips
              __typename
            }
            dailymotionClips: clips(providers: [DAILYMOTION]) {
              ...TrailerClips
              __typename
            }
            __typename
          }
          content(country: $country, language: $language) {
            title
            ageCertification
            fullPath
            genres {
              shortName
              __typename
            }
            credits {
              role
              name
              characterName
              personId
              __typename
            }
            productionCountries
            externalIds {
              imdbId
              __typename
            }
            upcomingReleases(releaseTypes: DIGITAL) {
              releaseDate
              __typename
            }
            backdrops {
              backdropUrl
              __typename
            }
            posterUrl
            isReleased
            videobusterClips: clips(providers: [VIDEOBUSTER]) {
              ...TrailerClips
              __typename
            }
            dailymotionClips: clips(providers: [DAILYMOTION]) {
              ...TrailerClips
              __typename
            }
            __typename
          }
          seenState(country: $country) {
            progress
            __typename
          }
          watchlistEntryV2 {
            createdAt
            __typename
          }
          dislikelistEntry {
            createdAt
            __typename
          }
          likelistEntry {
            createdAt
            __typename
          }
          __typename
        }
        seenState(country: $country) {
          progress
          __typename
        }
        __typename
      }
    }
    __typename
  }
}

fragment TrailerClips on Clip {
  sourceUrl
  externalId
  provider
  name
  __typename
}`;

export async function GET(req: NextRequest) {
  const fullPath = req.nextUrl.searchParams.get("path");

  if (!fullPath) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  try {
    const response = await axios.request({
      method: "POST",
      url: JUSTWATCH_GRAPHQL,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({
        query,
        variables: {
          fullPath,
          platform: "WEB",
          language: "en",
          country: "ID",
          episodeMaxLimit: 120,
        },
      }),
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.error();
  }
}
