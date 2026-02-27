type FeedLoadingStateProps = {
  activeTab: 'comments' | 'activities'
}

export default function FeedLoadingState({ activeTab }: FeedLoadingStateProps) {
  return (
    <div className='w-full bg-white min-h-[160px] flex flex-col items-center justify-center gap-3 px-4 py-12 text-center'>
      <div className='h-6 w-6 animate-spin rounded-full border-2 border-grey-200 border-t-primary-400' />
      <p className='text-sm text-grey-500'>
        {activeTab === 'comments' ? 'Loading wishes...' : 'Loading activities...'}
      </p>
    </div>
  )
}
