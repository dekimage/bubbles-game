"use client";

import { ChevronLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavButtons({ parentId = null, className }) {
  const router = useRouter();

  const handleBack = () => {
    if (parentId) {
      router.push(`/milestones/${parentId}`);
    } else {
      router.back();
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className={cn("fixed top-6 left-6 flex gap-3 z-50", className)}>
      <button
        onClick={handleBack}
        className="group relative p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg 
                 transition-all duration-200 hover:scale-110 hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
        <span
          className="absolute inset-0 rounded-full bg-gray-100/50 scale-0 
                      group-hover:scale-100 transition-transform duration-200"
        />
      </button>

      <button
        onClick={handleHome}
        className="group relative p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg 
                 transition-all duration-200 hover:scale-110 hover:bg-white"
      >
        <Home className="h-5 w-5 text-gray-700" />
        <span
          className="absolute inset-0 rounded-full bg-gray-100/50 scale-0 
                      group-hover:scale-100 transition-transform duration-200"
        />
      </button>
    </div>
  );
}
