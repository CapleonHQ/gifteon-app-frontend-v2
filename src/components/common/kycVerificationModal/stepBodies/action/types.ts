import type { ChangeEvent, RefObject } from 'react'
import type { KycRequiredAction } from '../../types'

export type FaceCaptureStage = 'idle' | 'preview' | 'scanning' | 'ready'

export type ActionStepBodyProps = {
  action: KycRequiredAction
  documentNumber: string
  utilityBillFile: File | null
  faceFile: File | null
  fileInputRef: RefObject<HTMLInputElement | null>
  faceInputRef: RefObject<HTMLInputElement | null>
  faceCaptureStage: FaceCaptureStage
  faceScanProgress: number
  isPending?: boolean
  isReadOnlyAction?: boolean
  submittedSummary?: string
  statusMessage?: string
  isStatusError?: boolean
  errorMessage?: string
  onDocumentNumberChange: (value: string) => void
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: () => void
  onFaceFileSelect: (event: ChangeEvent<HTMLInputElement>) => void
}
