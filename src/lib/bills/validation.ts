import type {
  ClaimGiftBillRequestBody,
  GiftBillPayload,
  GiftBillRecurringBase,
  SendGiftBillRecipientInput,
  SendGiftBillSingleRequestBody,
  SendGiftBillToMultipleRecipientsRequestBody,
} from '@/types/Bills'

export type ValidationErrors = Record<string, string>

const isNonEmpty = (value?: string) => typeof value === 'string' && value.trim().length > 0

const isFutureIsoDate = (value: string) => {
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) && parsed > Date.now()
}

export const validateGiftBillPayload = (bill: GiftBillPayload): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!isNonEmpty(bill.provider)) {
    errors.provider = 'Provider is required.'
  }

  if (!Number.isFinite(bill.amount) || bill.amount <= 0) {
    errors.amount = 'Amount must be greater than zero.'
  }

  if (bill.billType === 'data' || bill.billType === 'cable_tv') {
    if (!isNonEmpty(bill.planCode)) {
      errors.planCode = 'Plan is required for this bill type.'
    }
  }

  if (bill.billType === 'electricity') {
    if (!isNonEmpty(bill.meterType)) {
      errors.meterType = 'Meter type is required for electricity bills.'
    }
  }

  return errors
}

export const validateGiftBillSchedule = (
  input: GiftBillRecurringBase
): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (input.scheduledAt && !isFutureIsoDate(input.scheduledAt)) {
    errors.scheduledAt = 'Scheduled time must be in the future.'
  }

  if (input.isRecurring) {
    if (!input.recurringConfig) {
      errors.recurringConfig = 'Recurring configuration is required.'
      return errors
    }

    if (input.recurringConfig.frequency === 'custom') {
      if (!isNonEmpty(input.recurringConfig.cronExpression)) {
        errors.cronExpression = 'Cron expression is required for custom frequency.'
      }
    }
  }

  return errors
}

export const validateGiftBillRecipientIdentity = (
  recipient: Pick<
    SendGiftBillRecipientInput,
    'recipientTag' | 'recipientPhone' | 'recipientEmail'
  >
): ValidationErrors => {
  const errors: ValidationErrors = {}
  const hasTag = isNonEmpty(recipient.recipientTag)
  const hasPhone = isNonEmpty(recipient.recipientPhone)
  const hasEmail = isNonEmpty(recipient.recipientEmail)

  if (!hasTag && !hasPhone && !hasEmail) {
    errors.recipient = 'Provide recipient tag, phone, or email.'
  }

  return errors
}

export const validateSendGiftBillRecipient = (
  recipient: SendGiftBillRecipientInput
): ValidationErrors => {
  return {
    ...validateGiftBillRecipientIdentity(recipient),
    ...validateGiftBillPayload(recipient.bill),
  }
}

export const validateSendGiftBillSingle = (
  input: SendGiftBillSingleRequestBody
): ValidationErrors => {
  return {
    ...validateSendGiftBillRecipient(input),
    ...validateGiftBillSchedule(input),
  }
}

export const validateSendGiftBillMultiple = (
  input: SendGiftBillToMultipleRecipientsRequestBody
): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!Array.isArray(input.recipients) || input.recipients.length === 0) {
    errors.recipients = 'At least one recipient is required.'
  } else {
    const firstInvalidIndex = input.recipients.findIndex((recipient) => {
      const recipientErrors = validateSendGiftBillRecipient(recipient)
      return Object.keys(recipientErrors).length > 0
    })

    if (firstInvalidIndex >= 0) {
      errors.recipients = `Recipient #${firstInvalidIndex + 1} has invalid bill details.`
    }
  }

  return {
    ...errors,
    ...validateGiftBillSchedule(input),
  }
}

export const validateGiftBillClaim = (
  input: ClaimGiftBillRequestBody
): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!isNonEmpty(input.recipient)) {
    errors.recipient = 'Recipient value is required to claim this gift bill.'
  }

  return errors
}

