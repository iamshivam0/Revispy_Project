"use client";
import Image from "next/image";
import Navbar from "@/components/navbar";
import header from "@/components/header";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <header />

      {/* Hero Section with Pattern */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,#FAFAFA_0%,transparent_100%)]" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="px-4 py-1 rounded-full bg-gray-100 text-gray-800 text-sm mb-6">
            ✨ New Collection Available
          </span>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent animate-gradient">
            Elevate Your Lifestyle
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Discover our handpicked selection of premium products designed for
            the modern individual
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all hover:scale-105"
            >
              Shop Collection
            </button>
            <button
              onClick={() => router.push("/login")}
              className="border border-black px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
