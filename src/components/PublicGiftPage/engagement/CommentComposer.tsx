import { useState } from 'react'
import ComposerErrorMessage from './comment-composer/ComposerErrorMessage'
import ComposerSendButton from './comment-composer/ComposerSendButton'
import ComposerTextarea from './comment-composer/ComposerTextarea'
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
  const [comment, setComment] = useState('')
  const [hideName, setHideName] = useState(true)
  const [ownerOnly, setOwnerOnly] = useState(false)

  const createCommentMutation = useCreatePublicPageComment(pageId)

  const handleCommentSuccess = () => {
    setComment('')
    onCommentSent?.()
  }

  const handleSubmit = () => {
    const value = comment.trim()
    if (!value || isCharacterLimitReached) return

    createCommentMutation.mutate(
      { comment: value },
      {
        onSuccess: () => {
          handleCommentSuccess()
        },
      }
    )
  }

  const characterCount = comment.length
  const isCharacterLimitReached = characterCount >= MAX_COMMENT_LENGTH
  const isSubmitDisabled =
    comment.trim().length === 0 ||
    createCommentMutation.isPending ||
    isCharacterLimitReached

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
