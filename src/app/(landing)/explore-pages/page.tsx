"use client";

import { useState } from "react";
import Image from "next/image";

type Category = "all" | "birthday" | "wedding" | "anniversary" | "graduation" | "promotion";

interface Page {
  id: number;
  title: string;
  category: Exclude<Category, "all">;
  description: string;
  image: string;
  author?: string;
  likes?: number;
}

const FILTERS: { label: string; value: Category }[] = [
  { label: "All Celebration Types", value: "all" },
  { label: "Birthday", value: "birthday" },
  { label: "Weddings", value: "wedding" },
  { label: "Anniversaries", value: "anniversary" },
  { label: "Graduations", value: "graduation" },
  { label: "Promotion / Donation", value: "promotion" },
];

const PAGES: Page[] = [
  {
    id: 1,
    title: "It's my birthday!",
    category: "birthday",
    description:
      "Today is all about me spreading joy and kindness to others! Thank you all for the love and support throughout my life.",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    likes: 42,
  },
  {
    id: 2,
    title: "Lisa Krishna",
    category: "anniversary",
    description:
      "We are delighted to tell you that you are welcome to join us to celebrate our anniversary in this special journey together.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
    likes: 87,
  },
  {
    id: 3,
    title: "Purity Church of God",
    category: "promotion",
    description:
      "We are working as volunteers to feed the hungry. The Purity Church of God community serves as a cornerstone sanctuary.",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&q=80",
    likes: 134,
  },
  {
    id: 4,
    title: "Purity Church of God",
    category: "promotion",
    description:
      "We are working as volunteers to feed the hungry. The Purity Church of God community serves as a cornerstone sanctuary.",
    image: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?w=600&q=80",
    likes: 98,
  },
  {
    id: 5,
    title: "It's my birthday!",
    category: "birthday",
    description:
      "Happy Birthday to me! Today is all about creating memories and sharing kindness with everyone around me.",
    image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&q=80",
    likes: 56,
  },
  {
    id: 6,
    title: "Lisa Krishna",
    category: "anniversary",
    description:
      "We are delighted to tell you that you are welcome to join us to celebrate our anniversary in this special journey together.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
    likes: 73,
  },
  {
    id: 7,
    title: "It's my birthday!",
    category: "birthday",
    description:
      "Today is all about spreading joy and kindness! Creating memories and sharing love with everyone around me.",
    image: "https://images.unsplash.com/photo-1558636508-e0969d3e3c6c?w=600&q=80",
    likes: 61,
  },
  {
    id: 8,
    title: "Lisa Krishna",
    category: "anniversary",
    description:
      "We are delighted to tell you that you are welcome to join us to celebrate our anniversary in this special journey together.",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80",
    likes: 44,
  },
  {
    id: 9,
    title: "Purity Church of God",
    category: "promotion",
    description:
      "We are working as volunteers to feed the hungry. The Purity Church of God community is a sanctuary and remarkable cornerstone.",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80",
    likes: 120,
  },
  {
    id: 10,
    title: "Purity Church of God",
    category: "promotion",
    description:
      "We are working as volunteers to feed the hungry. The Purity Church of God community serves as a cornerstone sanctuary.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80",
    likes: 88,
  },
  {
    id: 11,
    title: "It's my birthday!",
    category: "birthday",
    description:
      "Happy Birthday to me! Today is all about creating memories and sharing kindness with everyone around me.",
    image: "https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=600&q=80",
    likes: 33,
  },
  {
    id: 12,
    title: "Lisa Krishna",
    category: "anniversary",
    description:
      "We are delighted to tell you that you are welcome to join us to celebrate our anniversary in this special journey together.",
    image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=600&q=80",
    likes: 67,
  },
  {
    id: 13,
    title: "Class of 2024",
    category: "graduation",
    description:
      "Proud to celebrate this incredible milestone. Years of hard work have led to this beautiful moment of achievement.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
    likes: 91,
  },
  {
    id: 14,
    title: "It's my birthday!",
    category: "birthday",
    description:
      "Today is all about spreading joy and kindness! Creating memories and sharing love with everyone around me.",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&q=80",
    likes: 48,
  },
  {
    id: 15,
    title: "Lisa Krishna",
    category: "anniversary",
    description:
      "We are delighted to tell you that you are welcome to join us to celebrate our anniversary in this special journey together.",
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80",
    likes: 55,
  },
  {
    id: 16,
    title: "Lisa Krishna",
    category: "wedding",
    description:
      "We are delighted to tell you that you are welcome to join us to celebrate our special union and beautiful journey together.",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80",
    likes: 203,
  },
  {
    id: 17,
    title: "Purity Church of God",
    category: "promotion",
    description:
      "We are working as volunteers to feed the hungry. The Purity Church of God community serves as a cornerstone sanctuary.",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&q=80",
    likes: 76,
  },
  {
    id: 18,
    title: "It's my birthday!",
    category: "birthday",
    description:
      "Today is all about me spreading joy and kindness to others! Thank you all for the love and support throughout my life.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80",
    likes: 39,
  },
];

// Pastel bg colors per category for placeholder cards (used when no real image)
const CATEGORY_COLORS: Record<Exclude<Category, "all">, string> = {
  birthday: "#FDE8F0",
  anniversary: "#E8EAF6",
  promotion: "#E8F5E9",
  graduation: "#FFF8E1",
  wedding: "#FCE4EC",
};

const CATEGORY_EMOJI: Record<Exclude<Category, "all">, string> = {
  birthday: "🎂",
  anniversary: "💍",
  promotion: "🙏",
  graduation: "🎓",
  wedding: "💒",
};

function PlaceholderImage({ category }: { category: Exclude<Category, "all"> }) {
  return (
    <div
      className="w-full aspect-[4/3] flex items-center justify-center text-4xl"
      style={{ background: CATEGORY_COLORS[category] }}
    >
      {CATEGORY_EMOJI[category]}
    </div>
  );
}

function CardImage({ page }: { page: Page }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <PlaceholderImage category={page.category} />;
  }

  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden">
      <Image
        src={page.image}
        alt={page.title}
        fill
        className="object-cover"
        onError={() => setErrored(true)}
        sizes="(max-width: 640px) 50vw, 33vw"
      />
    </div>
  );
}

function PageCard({ page, onSeeDetails }: { page: Page; onSeeDetails: (page: Page) => void }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors duration-150 flex flex-col">
      <CardImage page={page} />
      <div className="p-3 flex flex-col flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-500 mb-1">
          {page.category}
        </span>
        <h3 className="text-[14px] font-semibold text-gray-900 mb-1 leading-snug">{page.title}</h3>
        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-3 flex-1 mb-3">
          {page.description}
        </p>
        <button
          onClick={() => onSeeDetails(page)}
          className="text-[12px] font-semibold text-primary-500 hover:underline text-left"
        >
          See Details
        </button>
      </div>
    </div>
  );
}

export default function ExplorePages() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const filtered =
    activeFilter === "all" ? PAGES : PAGES.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            Moments Shared With the World
            <span className="inline-block w-3 h-3 rounded-full bg-primary-500" />
          </h1>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
            Follow the lives of inspired people chose to make public, share home a story, a
            freelance, a passion. You can open up of them to read their message, leave like a
            remark, share or follow so that page is to promote the creator with benefits
            throughout it.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors duration-150 ${
                activeFilter === f.value
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary-500 hover:text-primary-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filtered.map((page) => (
            <PageCard key={page.id} page={page} onSeeDetails={setSelectedPage} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No moments found for this category.</p>
          </div>
        )}

        {/* Pagination / count */}
        <div className="mt-8 text-center text-xs text-gray-400">
          Showing {filtered.length} of {PAGES.length} moments
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPage && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPage(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <CardImage page={selectedPage} />
            <div className="p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-500 mb-1 block">
                {selectedPage.category}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPage.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{selectedPage.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">❤️ {selectedPage.likes} likes</span>
                <button
                  onClick={() => setSelectedPage(null)}
                  className="text-xs font-semibold text-primary-500 border border-primary-500 rounded-full px-4 py-1.5 hover:bg-primary-500 hover:text-white transition-colors duration-150"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}