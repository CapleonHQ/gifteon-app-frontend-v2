const NotificationHeaderRow = () => {
  return (
    <div className='border-y border-grey-50 px-6 py-2.5 grid grid-cols-[minmax(0,1fr)_96px_96px_96px] xl:grid-cols-[minmax(0,1fr)_160px_160px_160px] text-sm text-grey-500 font-medium'>
      <span>Notification Type</span>
      <span className='text-center'>Email</span>
      <span className='text-center'>In-App</span>
      <span className='text-center'>SMS</span>
    </div>
  )
}

export default NotificationHeaderRow
