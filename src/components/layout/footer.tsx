import { Logo } from "@/components/ui/logo";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <Logo variant="full" size="lg" />
            </div>

            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                <Facebook
                  className="h-4 w-4 cursor-pointer"
                  aria-label="Facebook"
                />
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                <Instagram
                  className="h-4 w-4 cursor-pointer"
                  aria-label="Instagram"
                />
              </div>
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
                <Linkedin
                  className="h-4 w-4 cursor-pointer"
                  aria-label="LinkedIn"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 text-sm text-gray-400 mb-4 md:mb-0">
            <a href="#" className="hover:text-white">
              Terms Of Use
            </a>
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
          </div>
          <div className="text-center text-xs text-gray-400 space-y-1">
            <div>© {new Date().getFullYear()} Copyright - PetGromee</div>
            <div>
              <a
                href="https://www.flaticon.com/free-icons/dog"
                title="dog icons"
                className="underline hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Dog icons created by AomAm - Flaticon
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
