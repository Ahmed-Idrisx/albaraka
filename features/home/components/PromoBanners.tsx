import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { STORE_IMAGES } from "@/constant/images";

const BANNERS = [
  { image: STORE_IMAGES.fruits, key: "fruits" },
  { image: STORE_IMAGES.vegetables, key: "vegetables" },
] as const;

export function PromoBanners() {
  const t = useTranslations("home.banners");

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {BANNERS.map((banner) => (
        <Link
          key={banner.key}
          href="/products"
          className="group relative isolate flex h-44 items-end overflow-hidden rounded-2xl p-5 text-white"
        >
          <Image
            src={banner.image}
            placeholder="blur"
            alt=""
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="-z-10 object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 to-black/0" />
          <div>
            <h3 className="text-xl font-bold">{t(`${banner.key}.title`)}</h3>
            <p className="text-sm text-white/85">{t(`${banner.key}.text`)}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
