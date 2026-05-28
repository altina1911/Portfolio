import { NextResponse } from "next/server";
import { getContent, updateProfile } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content.profile);
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json(await updateProfile(body));
}
