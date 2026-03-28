'use client'

const BillsLandingPage = () => {
  const services = [
    { label: 'Airtime', available: true },
    { label: 'Data', available: true },
    { label: 'Electricity', available: true },
    { label: 'Cable TV', available: true },
    { label: 'Flights', available: false },
    { label: 'Hotels', available: false },
    { label: 'Medical', available: false },
  ]

  return (
    <div className='w-full bg-white lg:rounded-[20px] mt-4 lg:mt-0 flex-1 h-full'>
      <div className='flex flex-col gap-4 lg:gap-5 h-full px-4 lg:px-6 py-4 lg:py-6'>
        <p className='text-sm lg:text-base text-grey-600'>
          Select a service to pay bills and utilities quickly.
        </p>

        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3'>
          {services.map((service) => (
            <div
              key={service.label}
              className='rounded-xl border border-grey-100 bg-base-bg px-4 py-3'
            >
              <p className='text-sm font-medium text-grey-900'>{service.label}</p>
              <p
                className={`mt-1 text-xs font-medium ${
                  service.available ? 'text-success-700' : 'text-grey-500'
                }`}
              >
                {service.available ? 'Available' : 'Unavailable'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BillsLandingPage
