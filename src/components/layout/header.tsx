"use client"

import { Button } from "@/components/ui/button";
import { LogoFull } from "@/components/ui/logo";

export default function Header() {

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <LogoFull size="lg" />
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#services"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </a>
            <a
              href="#Membership"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              MemberShip
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </nav>
          <Button
         
            variant="default"
            className="hover:glow-cinnamon"
          >
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
