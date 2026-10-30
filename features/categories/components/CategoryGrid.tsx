"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { useLocalized } from "@/i18n/useLocalized";

/** Round photo tiles, one per category. Scrolls sideways on small screens. */
export function CategoryGrid({ categories }: { categories: Category[] }) {
  const localized = useLocalized();

  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${encodeURIComponent(category.slug)}`}
          className="group flex w-24 shrink-0 flex-col items-center gap-2 text-center"
        >
          <span className="relative size-24 overflow-hidden rounded-full border-4 border-card bg-brand-50 shadow-card transition group-hover:shadow-card-hover">
            <Image
              src={category.image}
              alt=""
              fill
              sizes="96px"
              className="object-cover transition duration-300 group-hover:scale-110"
            />
          </span>
          <span className="text-sm font-medium group-hover:text-primary">
            {localized(category, "name")}
          </span>
        </Link>
      ))}
    </div>
  );
}
