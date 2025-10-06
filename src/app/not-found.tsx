import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { LogoIcon } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-xl px-4 py-24 text-center">
          <div className="flex items-center justify-center mb-6">
            <LogoIcon size="lg" />
          </div>
          <h1 className="text-3xl font-bold mb-3">
            This page has wandered off
          </h1>
          <p className="text-muted-foreground mb-8">
            The link might be broken or the page may have moved. Let’s get you
            back on track.
          </p>
          <div className="flex items-center justify-center mb-6" aria-hidden>
            <span className="text-6xl">🐶</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" aria-label="Go back home">
              <Button variant="default">
                Go home
              </Button>
            </Link>
            <Link href="/dashboard" aria-label="Go to dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
