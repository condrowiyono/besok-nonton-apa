import { cities } from "@/data/cities.json";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    data: cities,
  });
}
