import PublicGiftPageClient from '@/components/PublicGiftPage/PublicGiftPageClient'

type PublicGiftPageProps = {
  params: Promise<{ slug: string }>
}

export default async function PublicGiftPage({ params }: PublicGiftPageProps) {
  const { slug } = await params
  return <PublicGiftPageClient slug={slug} />
}
