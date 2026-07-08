type IdentityNameFieldProps = {
  value: string
  error: string | null
  onChange: (value: string) => void
}

export default function IdentityNameField({
  value,
  error,
  onChange,
}: IdentityNameFieldProps) {
  return (
    <div className='mt-3'>
      <label
        htmlFor='public-comment-full-name'
        className='mb-1.5 block text-sm text-grey-700'
      >
        Full name
      </label>
      <input
        id='public-comment-full-name'
        type='text'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder='Enter your full name'
        className={`h-10 w-full rounded-[10px] border px-3 text-sm text-blackish outline-none placeholder:text-grey-400 ${
          error ? 'border-error-300' : 'border-grey-100'
        }`}
      />
      {error ? <p className='mt-1 text-xs text-error-500'>{error}</p> : null}
    </div>
  )
}
