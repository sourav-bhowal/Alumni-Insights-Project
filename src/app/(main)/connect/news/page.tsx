import { Metadata } from "next";
import { NewsCard } from "./NewsCard";
import { Pagination } from "@/components/shared/pagination";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";

// METADATA
export const metadata: Metadata = {
  title: "News",
  description: "Find jobs refered by your alumni",
};

// NEWS PAGE PROPS INTERFACE
interface NewsPageProps {
  searchParams: {
    q?: string;
    page?: string;
    perPage?: string;
  };
}

// PAGE COMPONENT
export default async function Newspage({
  searchParams: { q = "education+achievements", page, perPage = "11" },
}: NewsPageProps) {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${q}&page=${page}&pageSize=${perPage}&apiKey=${process.env.NEWS_API_KEY}`,
    {
      cache: "default",
    },
  );
  const news = await response.json();
  return (
    <div>
      <div className="mb-3 flex justify-between">
        <h1 className="text-3xl font-semibold uppercase">News</h1>
        <div className="flex gap-10">
          {/* <div className="relative">
            <Input
              name="q"
              id="q"
              placeholder="e.g. web developer, devops"
              className="h-12 rounded-2xl pl-10"
              value={q}
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-primary" />
          </div> */}
          <Pagination page={page} hasNextPage={true} />
        </div>
      </div>
      <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-3">
        {news.articles.map((article: any, index: number) => (
          <NewsCard
            key={article.id}
            article={article}
            className={
              index === 0
                ? "md:col-span-2 md:row-span-2"
                : index === 3
                  ? "md:col-span-2"
                  : ""
            }
          />
        ))}
      </div>
    </div>
  );
}
