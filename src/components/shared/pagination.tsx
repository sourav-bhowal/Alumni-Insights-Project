import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

// PAGINATION PROPS INTERFACE
type PaginationProps = {
  page?: string;
  totalPages?: number;
  hasNextPage?: boolean;
};

// PAGINATION COMPONENT
export const Pagination = (props: PaginationProps) => {
  const { page = 1, totalPages = 0, hasNextPage } = props;

  const currentPage = Number(page);

  const getPagesToShow = () => {
    let startPage = currentPage - 2;
    let endPage = currentPage + 2;

    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
      endPage = totalPages;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  const pages = getPagesToShow();

  return (
    <div className="flex items-center justify-center space-x-6 text-black dark:text-white">
      <Link
        className={cn(
          "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-card",
          currentPage === 1 ? "pointer-events-none bg-muted-foreground" : "",
        )}
        href={`?page=${currentPage - 1}`}
      >
        <ArrowLeft size={16} />
      </Link>

      {/* <nav
        aria-label="Pagination"
        className="relative z-0 hidden gap-2 -space-x-px rounded-md md:inline-flex"
      >
        {pages.map((p, i) => (
          <Link
            key={p}
            className={cn(
              "relative flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-card",
              p === currentPage
                ? "pointer-events-none border-2 border-primary bg-card"
                : "",
            )}
            href={`?page=${p}`}
          >
            {p}
          </Link>
        ))}
      </nav> */}

      <Link
        className={cn(
          "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-card",
          !hasNextPage ? "pointer-events-none bg-muted-foreground" : "",
        )}
        href={`?page=${currentPage + 1}`}
      >
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};
