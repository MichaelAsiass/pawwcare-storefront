import { SignUp } from "@clerk/nextjs";
import Header from "@/components/layout/header";

export default function SignUpPage() {
  return (
    <div className=" flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center  py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 ">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent",
                  headerTitle: "text-xl font-semibold text-gray-900",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                  formButtonPrimary:
                    "bg-cinnamon hover:bg-cinnamon/90 text-white hover:glow-cinnamon",
                  footerActionLink: "text-cinnamon hover:text-cinnamon/80",
                  formFieldInput:
                    "border-gray-300 focus:border-cinnamon focus:ring-cinnamon",
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
