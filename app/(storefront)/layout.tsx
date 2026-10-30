import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";

export default function StorefrontLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
