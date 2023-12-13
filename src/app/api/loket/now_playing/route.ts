import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "Jakarta";

  const baseUrl = "https://screen-api-cms.loket.com/v4/web/movie/now_playing";
  const { data } = await axios.get(baseUrl, { params: { city } });

  return Response.json(data);
}
