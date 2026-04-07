import type { UiStatus } from './types'

export const POLL_INTERVAL_MS = 2500

export const TITLE_BY_STATUS: Record<UiStatus, string> = {
  verifying: 'Verifying Payment',
  success: 'Payment Successful',
  failed: 'Payment Failed',
  canceled: 'Payment Canceled',
  pending: 'Payment Pending',
  invalid: 'Invalid Payment Reference',
  error: 'Unable to Verify Payment',
}

export const DESCRIPTION_BY_STATUS: Record<UiStatus, string> = {
  verifying:
    'Please wait while we confirm your transaction status with our payment provider.',
  success:
    'Your payment has been confirmed. You can continue to complete your flow.',
  failed: 'We could not confirm a successful payment for this transaction.',
  canceled: 'No charge was completed. You can retry whenever you are ready.',
  pending:
    'Your transaction is still processing. We are checking again automatically.',
  invalid:
    'This payment reference is missing, invalid, or does not exist for this payment attempt.',
  error:
    'We couldn’t verify your payment at the moment. Please try again shortly.',
}

export const LOTTIE_BY_STATUS: Record<UiStatus, string> = {
  verifying: '/assets/lottie/activate-lottie.lottie',
  success: '/assets/lottie/success_with_very_early_fireworks.lottie',
  failed: '/assets/lottie/cancelled-lottie.lottie',
  canceled: '/assets/lottie/cancelled-lottie.lottie',
  pending: '/assets/lottie/pending-lottie.lottie',
  invalid: '/assets/lottie/cancelled-lottie.lottie',
  error: '/assets/lottie/cancelled-lottie.lottie',
}
