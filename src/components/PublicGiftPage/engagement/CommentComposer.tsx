import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import ComposerErrorMessage from './comment-composer/ComposerErrorMessage'
import ComposerSendButton from './comment-composer/ComposerSendButton'
import ComposerTextarea from './comment-composer/ComposerTextarea'
import IdentityNameField from './comment-composer/IdentityNameField'
import IdentityNotice from './comment-composer/IdentityNotice'
import PreferenceSwitchRow from './comment-composer/PreferenceSwitchRow'
import { MAX_COMMENT_LENGTH } from './comment-composer/types'
import { useCreatePublicPageComment } from '@/hooks/tanstack/publicPage'

type CommentComposerProps = {
  receiverName: string
  pageId: string
  onCommentSent?: () => void
}

export default function CommentComposer({
  receiverName,
  pageId,
  onCommentSent,
}: CommentComposerProps) {
  const { status, user } = useAuth()
  const isAuthenticated = status === 'authenticated' && Boolean(user)
  const profileName =
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    'your profile'

  const [comment, setComment] = useState('')
  const [hideName, setHideName] = useState(false)
  const [ownerOnly, setOwnerOnly] = useState(false)
  const [useDifferentDisplayName, setUseDifferentDisplayName] = useState(false)
  const [fullName, setFullName] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)

  const createCommentMutation = useCreatePublicPageComment(pageId)

  const characterCount = comment.length
  const isCharacterLimitReached = characterCount >= MAX_COMMENT_LENGTH
  const shouldShowNameInput =
    !hideName && (!isAuthenticated || useDifferentDisplayName)
  const isSubmitDisabled =
    comment.trim().length === 0 ||
    createCommentMutation.isPending ||
    isCharacterLimitReached

  const normalizeName = (value: string) =>
    value
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 60)

  const validateName = (value: string): string | null => {
    if (!shouldShowNameInput) return null
    if (!value) return 'Full name is required.'
    if (value.length < 2) return 'Full name must be at least 2 characters.'
    return null
  }

  const handleSubmit = () => {
    const trimmedComment = comment.trim()
    if (!trimmedComment || isCharacterLimitReached) return

    const normalizedFullName = normalizeName(fullName)
    const nextNameError = validateName(normalizedFullName)

    if (nextNameError) {
      setNameError(nextNameError)
      return
    }

    setNameError(null)

    const payload = {
      comment: trimmedComment,
      hideIdentity: hideName,
      private: ownerOnly,
      ...(shouldShowNameInput && normalizedFullName
        ? { fullName: normalizedFullName }
        : {}),
    }

    createCommentMutation.mutate(
      payload,
      {
        onSuccess: () => {
          setComment('')
          setFullName('')
          setUseDifferentDisplayName(false)
          onCommentSent?.()
        },
      }
    )
  }

  return (
    <div className='mt-7'>
      <h3 className='text-xl lg:text-2xl leading-6 lg:leading-8 font-medium text-blackish'>
        Drop a Comment
      </h3>

      <ComposerTextarea
        receiverName={receiverName}
        value={comment}
        onChange={setComment}
      />

      <IdentityNotice
        isAuthenticated={isAuthenticated}
        profileName={profileName}
        hideIdentity={hideName}
        useDifferentDisplayName={useDifferentDisplayName}
        onUseDifferentDisplayNameChange={setUseDifferentDisplayName}
      />

      {shouldShowNameInput ? (
        <IdentityNameField
          value={fullName}
          error={nameError}
          onChange={(value) => {
            setFullName(value)
            if (nameError) setNameError(null)
          }}
        />
      ) : null}

      <div className='mt-2 flex justify-end'>
        <ComposerSendButton
          disabled={isSubmitDisabled}
          isPending={createCommentMutation.isPending}
          onClick={handleSubmit}
        />
      </div>

      <div className='mt-4 rounded-[12px] border border-warning-100 bg-warning-50/50 p-3 flex flex-col gap-3.5'>
        <PreferenceSwitchRow
          value={hideName}
          label='Hide your name from other visitors'
          onChange={setHideName}
        />

        <PreferenceSwitchRow
          value={ownerOnly}
          label='My comment should only be visible to the owner'
          onChange={setOwnerOnly}
        />
      </div>

      <ComposerErrorMessage visible={createCommentMutation.isError} />
    </div>
  )
}
