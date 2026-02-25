export const PublicGiftPageLoadingView = () => (
  <main className='min-h-screen bg-primary-50 px-4 py-6'>
    <div className='mx-auto max-w-[924px] bg-white p-6'>
      <div className='h-12 w-52 animate-pulse rounded bg-grey-100' />
      <div className='mt-4 h-[420px] animate-pulse rounded bg-grey-100' />
    </div>
  </main>
)

export const PublicGiftPageErrorView = () => (
  <main className='min-h-screen bg-primary-50 px-4 py-6'>
    <div className='mx-auto max-w-[760px] bg-white p-8 text-center'>
      <p className='text-xl font-semibold text-blackish'>Gift page unavailable</p>
      <p className='mt-2 text-grey-700'>
        This link may be invalid, private, or no longer active.
      </p>
    </div>
  </main>
)
