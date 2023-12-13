import axios, { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { nextUrl } = req;
  const city_id = nextUrl.searchParams.get("city_id") ?? "3";
  const date = nextUrl.searchParams.get("date");

  const baseUrl = `https://21cineplex.com/${slug}`;
  const { headers, data } = await axios.get(baseUrl);
  const cookie = headers["set-cookie"]?.[0]?.split(";")[0];

  const $ = cheerio.load(data);
  const script = $("script").text();
  const tokenReg = /token:\s*"([a-f0-9]{128})"/;
  const movieCodeDBReg = /movieCodeDB:\s*"([A-Z0-9]{6})"/;
  const movieIdReg = /movieId:\s*"([0-9]{6})"/;

  const token = script.match(tokenReg)?.[1];
  const movieCodeDB = script.match(movieCodeDBReg)?.[1];
  const movieId = script.match(movieIdReg)?.[1];

  const searchDate = new URLSearchParams();
  searchDate.append("data", "getMovieTheaterList");
  searchDate.append("city_id", city_id);
  searchDate.append("movieCodeDB", movieCodeDB ?? "");
  searchDate.append("movieId", movieId ?? "");
  searchDate.append("token", token ?? "");
  date && searchDate.append("showdate", date ?? "");

  const config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://21cineplex.com/script/ajax-movie-theater-list.php",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie,
    },
    data: searchDate.toString(),
  };

  const response = await axios.request<{ msg: string }>(config);
  const $$ = cheerio.load(`<table> ${response.data.msg} </table>`);
  const showtimes = $$("tr")
    .map((i, el) => {
      const name = $$(el).find("td").eq(0).text();
      const showtimes = $$(el)
        .find("td")
        .eq(1)
        .find("a")
        .map((i, el) => {
          const time = $$(el).text();
          const link = $$(el).attr("data-url");

          return { time, link };
        })
        .get();

      return { name, showtimes };
    })
    .get();

  return Response.json({
    data: showtimes,
  });
}
