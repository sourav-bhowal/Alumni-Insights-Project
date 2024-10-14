import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRelativeDate } from "@/utils/time";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface NewsCardProps {
  article: any;
  className?: string;
}

export const NewsCard = ({ article, className }: NewsCardProps) => (
  <Card className={`overflow-hidden ${className}`}>
    {article.urlToImage && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={article.urlToImage}
        alt={article.title}
        className="h-48 w-full object-cover"
      />
    )}
    <CardContent className="p-4">
      <div className="mb-2 line-clamp-1 text-xl rounded-xl bg-primary px-2 py-1 font-semibold">{article.title}</div>
      <h3 className="mb-2 text-lg font-semibold">{article.description}</h3>
      <p className="mb-4 text-sm text-gray-600">{article.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          {formatRelativeDate(new Date(article.publishedAt))}
        </div>
        <Link href={article.url}>
          <Button variant="ghost" size="sm">
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);
