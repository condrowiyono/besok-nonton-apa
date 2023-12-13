import axios, { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const city_id = req.nextUrl.searchParams.get("city_id") ?? "3";

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

  const config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://21cineplex.com/script/ajax-movie-theater-list.php",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie,
    },
    data: `data=getMovieTheaterList&city_id=${city_id}&movieCodeDB=${movieCodeDB}&movieId=${movieId}&token=${token}`,
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
