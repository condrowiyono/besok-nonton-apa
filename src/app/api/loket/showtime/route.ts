import axios from "axios";
import { NextRequest } from "next/server";
import dayjs from "dayjs";

export async function GET(req: NextRequest) {
  const { nextUrl } = req;

  const city = nextUrl.searchParams.get("city") ?? "Jakarta";
  const date = nextUrl.searchParams.get("date") ?? dayjs().format("YYYY-MM-DD");

  const baseUrl = "https://screen-api-cms.loket.com/v1/web/movie/showtimes";
  const { data } = await axios.get(baseUrl, { params: { city, date } });

  return Response.json(data);
}
