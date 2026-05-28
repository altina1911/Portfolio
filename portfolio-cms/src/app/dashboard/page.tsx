import Link from "next/link";
import { getContent } from "@/lib/cms-store";
import { CmsEditor } from "./cms-editor";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const content = await getContent();

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#24211c]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between border-b border-[#d8d0c2] pb-5">
          <Link href="/" className="text-sm font-semibold">
            Portfolio CMS
          </Link>
          <Link
            href="/"
            className="rounded-md border border-[#24211c] px-3 py-2 text-sm font-semibold transition hover:bg-[#24211c] hover:text-white"
          >
            View site
          </Link>
        </nav>

        <CmsEditor initialContent={content} />
      </section>
    </main>
  );
}
