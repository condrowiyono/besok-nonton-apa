import axios, { AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const city_id = req.nextUrl.searchParams.get("city_id") ?? "3";

  const baseUrl = `https://21cineplex.com/`;
  const { headers, data } = await axios.get(baseUrl);
  const cookie = headers["set-cookie"]?.[0]?.split(";")[0];

  const $ = cheerio.load(data);
  const script = $("script").text();
  const reg = /token:\s*"([a-f0-9]{128})"/;
  const token = script.match(reg)?.[1];

  const config: AxiosRequestConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://21cineplex.com/script/ajax-home-nowplaying.php",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie,
    },
    data: `data=getMovNowplaying&city_id=${city_id}&token=${token}`,
  };

  const response = await axios.request<{ msg: string }>(config);

  const $$ = cheerio.load(response.data.msg);
  const movies = $$(".movie")
    .map((i, el) => {
      const link = $$(el)
        .find("a")
        .attr("href")
        ?.replace("https://21cineplex.com/", "");
      const poster = $$(el).find("img").attr("src");
      const title = $$(el).find(".movie-desc>h4").text();

      return { title, poster, link };
    })
    .get();

  return Response.json({ data: movies });
}
