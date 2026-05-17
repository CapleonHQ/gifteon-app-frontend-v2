export const MIN_COMMENT_LENGTH = 5
export const MAX_COMMENT_LENGTH = 500

export type PreferenceSwitchRowProps = {
  value: boolean
  label: string
  onChange: (value: boolean) => void
}

export type ComposerTextareaProps = {
  receiverName: string
  value: string
  onChange: (value: string) => void
}

export type SendButtonProps = {
  disabled: boolean
  isPending: boolean
  onClick: () => void
}
