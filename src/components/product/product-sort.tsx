"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS: Array<{ value: string; label: string }> = [
  { value: "date-desc", label: "Newest" },
  { value: "popularity-desc", label: "Popularity" },
  { value: "rating-desc", label: "Highest rated" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "title-asc", label: "Name: A → Z" },
];

export function ProductSort() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("sort") ?? "date-desc";

  function onChange(value: string) {
    const sp = new URLSearchParams(params.toString());
    if (value === "date-desc") sp.delete("sort");
    else sp.set("sort", value);
    sp.delete("page");
    router.push(`?${sp.toString()}`);
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="sort"
        className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:inline-block"
      >
        Sort
      </label>
      <Select value={current} onValueChange={onChange}>
        <SelectTrigger id="sort" className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
