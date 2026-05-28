import { NextResponse } from "next/server";
import { getContent, upsertProject } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content.projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const project = await upsertProject({
    title: body.title,
    summary: body.summary,
    role: body.role,
    stack: parseStack(body.stack),
    year: body.year,
    url: body.url,
    status: body.status === "draft" ? "draft" : "published",
    featured: Boolean(body.featured),
  });

  return NextResponse.json(project, { status: 201 });
}

function parseStack(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim());
  }

  return [];
}
