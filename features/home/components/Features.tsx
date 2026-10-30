import { useTranslations } from "next-intl";
import { Banknote, Leaf, Truck } from "lucide-react";

const FEATURES = [
  { icon: Leaf, key: "fresh" },
  { icon: Truck, key: "delivery" },
  { icon: Banknote, key: "cash" },
] as const;

export function Features() {
  const t = useTranslations("home.features");

  return (
    <section className="grid gap-3 sm:grid-cols-3">
      {FEATURES.map(({ icon: Icon, key }) => (
        <div key={key} className="card flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
            <Icon className="size-5" />
          </span>
          <div>
            <p className="font-bold">{t(`${key}.title`)}</p>
            <p className="text-sm text-muted-foreground">{t(`${key}.text`)}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
