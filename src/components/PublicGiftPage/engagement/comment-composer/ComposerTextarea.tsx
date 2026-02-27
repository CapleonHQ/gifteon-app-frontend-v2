import { MAX_COMMENT_LENGTH, type ComposerTextareaProps } from './types'

export default function ComposerTextarea({
  receiverName,
  value,
  onChange,
}: ComposerTextareaProps) {
  const characterCount = value.length
  const isCharacterLimitReached = characterCount >= MAX_COMMENT_LENGTH

  return (
    <div className='relative'>
      <textarea
        value={value}
        maxLength={MAX_COMMENT_LENGTH}
        onChange={(event) => onChange(event.target.value)}
        className={`h-[120px] w-full resize-none rounded-[12px] border bg-[#F2F2F366] px-3 py-2.5 pb-7 leading-[145%] text-blackish outline-none placeholder:text-grey-400 ${
          isCharacterLimitReached ? 'border-error-300' : 'border-grey-50'
        }`}
        placeholder={`Write a sweet wish for ${receiverName}`}
      />
      <span
        className={`pointer-events-none absolute bottom-2 right-3 text-xs ${
          isCharacterLimitReached ? 'text-error-500' : 'text-grey-400'
        }`}
      >
        {characterCount}/{MAX_COMMENT_LENGTH}
      </span>
    </div>
  )
}
