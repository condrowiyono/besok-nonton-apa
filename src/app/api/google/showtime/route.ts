import axios, { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const city = req.nextUrl.searchParams.get("city");

  const baseUrl = `https://www.google.com/search?q=${q} showtimes`;
  const config: AxiosRequestConfig = {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    },
  };
  const response = await axios.get(baseUrl, config);
  const $ = cheerio.load(response.data);

  const container = $("[data-date]");
  const title = container.attr("data-movie-name");

  const data = container
    .find("[data-theater-name]")
    .map((i, el) => ({
      teather: $(el).attr("data-theater-name"),
      times: $(el)
        .find("[data-st]")
        .map((i, el) => $(el).text())
        .get(),
    }))
    .get();

  console.log(title);
  console.log(data);
  return Response.json({
    data: response.data,
  });
}
