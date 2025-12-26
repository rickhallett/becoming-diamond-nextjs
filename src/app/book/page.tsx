"use client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BookSalesSection } from "@/components/BookSalesSection";

export default function BookPage() {
  return (
    <main className="relative bg-black antialiased">
      <Navigation />

      {/* Book Sales Section */}
      <BookSalesSection className="pt-20" />

      <Footer />
    </main>
  );
}
