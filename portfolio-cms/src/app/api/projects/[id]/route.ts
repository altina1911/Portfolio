import { NextResponse } from "next/server";
import { deleteProject, getProject, upsertProject } from "@/lib/cms-store";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const project = await upsertProject({
    id,
    title: body.title,
    summary: body.summary,
    role: body.role,
    stack: parseStack(body.stack),
    year: body.year,
    url: body.url,
    status: body.status === "draft" ? "draft" : "published",
    featured: Boolean(body.featured),
  });

  return NextResponse.json(project);
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const deleted = await deleteProject(id);

  if (!deleted) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
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
