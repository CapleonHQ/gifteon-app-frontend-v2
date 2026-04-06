import type { Metadata } from 'next'
import ExplorePage from '@/components/LandingPage/Explore/ExplorePage'

export const metadata: Metadata = {
  title: 'Explore Gift Pages',
  description:
    'Discover public Giftseon pages, open stories, and support moments shared with the world.',
}

export default function ExploreRoute() {
  return <ExplorePage />
}
