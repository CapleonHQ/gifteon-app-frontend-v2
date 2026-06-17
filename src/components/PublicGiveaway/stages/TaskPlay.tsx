'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { uploadImage } from '@/api/services/upload'
import { toApiError } from '@/api/errorHelpers'
import type { GiveawayTask, SubmitTaskProofBody } from '@/types/Giveaways'
import { needsUpload } from '@/components/Giveaways/utils'

type TaskStatus = 'idle' | 'submitting' | 'done' | 'error'

type TaskPlayProps = {
  tasks: GiveawayTask[]
  submitProof: (body: SubmitTaskProofBody) => Promise<void>
  onComplete: () => void
}

const TaskPlay = ({ tasks, submitProof, onComplete }: TaskPlayProps) => {
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({})

  const setStatus = (id: string, status: TaskStatus) =>
    setStatuses((prev) => ({ ...prev, [id]: status }))

  const allRequiredDone = useMemo(
    () =>
      tasks.filter((t) => t.isRequired).every((t) => statuses[t.id] === 'done'),
    [tasks, statuses]
  )

  const submit = async (task: GiveawayTask, body: SubmitTaskProofBody) => {
    setStatus(task.id, 'submitting')
    setErrors((prev) => ({ ...prev, [task.id]: '' }))
    try {
      await submitProof(body)
      setStatus(task.id, 'done')
    } catch (err) {
      setStatus(task.id, 'error')
      setErrors((prev) => ({
        ...prev,
        [task.id]: toApiError(err).message || 'Could not submit. Try again.',
      }))
    }
  }

  const handleHonor = (task: GiveawayTask) =>
    submit(task, { taskId: task.id, proofText: task.description })

  const handleFile = async (task: GiveawayTask, file: File) => {
    setStatus(task.id, 'submitting')
    setErrors((prev) => ({ ...prev, [task.id]: '' }))
    try {
      const uploaded = await uploadImage({ file, folder: 'giveaway-proofs' })
      const url = uploaded.data?.url
      if (!url) throw new Error('Upload failed.')
      await submitProof({ taskId: task.id, proofUrl: url })
      setStatus(task.id, 'done')
    } catch (err) {
      setStatus(task.id, 'error')
      setErrors((prev) => ({
        ...prev,
        [task.id]:
          toApiError(err).message || 'Could not upload proof. Try again.',
      }))
    }
  }

  return (
    <div className='flex flex-col gap-4 max-w-xl mx-auto w-full'>
      <div>
        <h2 className='text-xl font-semibold text-grey-900'>
          Complete the tasks
        </h2>
        <p className='text-sm text-grey-600 mt-1'>
          Finish all required tasks to lock in your entry.
        </p>
      </div>

      <div className='flex flex-col gap-3'>
        {tasks.map((task, index) => {
          const status = statuses[task.id] ?? 'idle'
          const done = status === 'done'
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className={`rounded-[14px] border p-4 flex flex-col gap-3 ${
                done
                  ? 'border-success-200 bg-success-50/50'
                  : 'border-grey-100 bg-white'
              }`}
            >
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      done ? 'text-success-700 line-through' : 'text-grey-800'
                    }`}
                  >
                    {task.description}
                  </p>
                  {task.isRequired ? (
                    <span className='text-[11px] text-warning-600'>
                      Required
                    </span>
                  ) : (
                    <span className='text-[11px] text-grey-400'>Optional</span>
                  )}
                </div>
                {done ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className='w-7 h-7 rounded-full bg-success-500 text-white flex items-center justify-center shrink-0'
                  >
                    <Check className='h-4 w-4' strokeWidth={3} />
                  </motion.span>
                ) : null}
              </div>

              {!done ? (
                needsUpload(task) ? (
                  <>
                    <input
                      ref={(el) => {
                        fileInputs.current[task.id] = el
                      }}
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) void handleFile(task, file)
                      }}
                    />
                    <button
                      type='button'
                      disabled={status === 'submitting'}
                      onClick={() => fileInputs.current[task.id]?.click()}
                      className='self-start px-4 py-2 rounded-[10px] bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors disabled:opacity-60'
                    >
                      {status === 'submitting' ? 'Uploading…' : 'Upload proof'}
                    </button>
                  </>
                ) : (
                  <button
                    type='button'
                    disabled={status === 'submitting'}
                    onClick={() => void handleHonor(task)}
                    className='self-start px-4 py-2 rounded-[10px] bg-primary-50 text-primary-600 text-sm font-medium hover:bg-primary-100 transition-colors disabled:opacity-60'
                  >
                    {status === 'submitting' ? 'Submitting…' : 'Mark as done'}
                  </button>
                )
              ) : null}

              {errors[task.id] ? (
                <p className='text-xs text-error-500'>{errors[task.id]}</p>
              ) : null}
            </motion.div>
          )
        })}
      </div>

      <button
        type='button'
        disabled={!allRequiredDone}
        onClick={onComplete}
        className={`mt-2 py-3 rounded-[12px] text-white text-sm font-medium transition-colors ${
          allRequiredDone
            ? 'bg-primary-500 hover:bg-primary-600'
            : 'bg-primary-200 cursor-not-allowed'
        }`}
      >
        Finish entry
      </button>
    </div>
  )
}

export default TaskPlay
