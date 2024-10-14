"use client";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchField() {
  // ROUTER
  const router = useRouter();

  // HANDLE SUBMIT (in TRADITIONAL JAVASCRIPT)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // take the form data
    const form = e.currentTarget;
    // take the search query
    const query = (form.query as HTMLInputElement).value.trim();

    if (!query) return;

    // push to the desired search page while ignoring special url characters
    router.push(`/connect/news?q=${encodeURIComponent(query)}`);
  }

  return (
    // IF JAVASCRIPT IS DISABLED THEN ALSO onSubmit WILL WORK
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="query" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
