'use client'

import posthog from 'posthog-js'
import type { UserProfile } from '@/types/Account'

type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>

const hasPostHog = () =>
  typeof window !== 'undefined' && Boolean(process.env.NEXT_PUBLIC_POSTHOG_TOKEN)

const sanitizeProperties = (properties?: AnalyticsProperties) => {
  if (!properties) return undefined

  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean | null>
}

const capture = (event: string, properties?: AnalyticsProperties) => {
  if (!hasPostHog()) return

  try {
    posthog.capture(event, sanitizeProperties(properties))
  } catch {
    // Analytics should not block product flows.
  }
}

const identifyUser = (user: UserProfile) => {
  if (!hasPostHog()) return

  try {
    posthog.identify(
      user.id,
      sanitizeProperties({
        email: user.email,
        account_type: user.accountType,
        country: user.country,
        giftseon_tag: user.giftseonTag ?? null,
        kyc_enabled: user.kycEnabled,
        kyc_level: user.kycLevel ?? 0,
        pin_activated: user.pinActivated,
        status: user.status,
      })
    )
  } catch {
    // Analytics should not block product flows.
  }
}

const resetUser = () => {
  if (!hasPostHog()) return

  try {
    posthog.reset()
  } catch {
    // Analytics should not block product flows.
  }
}

export const analytics = {
  identifyUser,
  resetUser,
  trackAuthLoginSubmitted: (properties: { method: 'email' | 'google' | 'apple' }) =>
    capture('auth_login_submitted', properties),
  trackAuthLoginOtpSubmitted: () => capture('auth_login_otp_submitted'),
  trackAuthLoginSucceeded: () => capture('auth_login_succeeded'),
  trackAuthLoginFailed: (properties: {
    stage: 'request' | 'otp' | 'resend'
    error_message: string
  }) => capture('auth_login_failed', properties),
  trackAuthRegisterSubmitted: (properties: {
    method: 'email' | 'google' | 'apple'
    country?: string
    has_referral_code?: boolean
  }) => capture('auth_register_submitted', properties),
  trackAuthRegisterOtpSubmitted: () => capture('auth_register_otp_submitted'),
  trackAuthRegisterSucceeded: () => capture('auth_register_succeeded'),
  trackAuthRegisterFailed: (properties: {
    stage: 'request' | 'otp' | 'resend'
    error_message: string
  }) => capture('auth_register_failed', properties),
  trackMagicLinkVerificationSucceeded: (properties: {
    action: 'register' | 'login' | 'unknown'
  }) => capture('auth_magic_link_succeeded', properties),
  trackMagicLinkVerificationFailed: (properties: {
    action: 'register' | 'login' | 'unknown'
    error_message: string
  }) => capture('auth_magic_link_failed', properties),
  trackGiftCreateStepViewed: (properties: {
    step: 'category' | 'template' | 'customize'
    has_preselected_category: boolean
    category_id: string | null
    template_id?: string | null
  }) => capture('gift_create_step_viewed', properties),
  trackGiftCreateTemplateSelected: (properties: {
    template_id: string
    category_id: string | null
  }) => capture('gift_create_template_selected', properties),
  trackGiftCreateSubmitted: (properties: {
    category_id: string | null
    template_id: string | null
  }) => capture('gift_create_submitted', properties),
  trackGiftCreateSucceeded: (properties: {
    category_id: string | null
    template_id: string | null
  }) => capture('gift_create_succeeded', properties),
  trackGiftCreateFailed: (properties: {
    category_id: string | null
    template_id: string | null
    error_message: string
  }) => capture('gift_create_failed', properties),
  trackGiftListFiltersApplied: (properties: {
    has_search: boolean
    filter_count: number
    has_date_range: boolean
    status: string | null
    category: string | null
    visibility: string | null
  }) => capture('gift_list_filters_applied', properties),
  trackGiftListFiltersReset: () => capture('gift_list_filters_reset'),
  trackGiftPageViewedFromList: (properties: { gift_id: string }) =>
    capture('gift_list_item_viewed', properties),
  trackGiftShareModalOpened: (properties: {
    gift_id: string | null
    source: 'gifts_list' | 'gift_details'
  }) => capture('gift_share_modal_opened', properties),
  trackGiftDeactivated: (properties: {
    source: 'gifts_list' | 'gift_details'
    gift_count: number
    gift_id: string | null
  }) => capture('gift_deactivated', properties),
  trackGiftReactivated: (properties: { gift_id: string }) =>
    capture('gift_reactivated', properties),
  trackWalletTopUpSubmitted: (properties: { amount: number }) =>
    capture('wallet_topup_submitted', properties),
  trackWalletTopUpRedirectStarted: (properties: { amount: number }) =>
    capture('wallet_topup_redirect_started', properties),
  trackWalletTopUpFailed: (properties: {
    amount: number
    error_message: string
  }) => capture('wallet_topup_failed', properties),
  trackWalletWithdrawPinStepOpened: (properties: {
    amount: number
    currency: string
    bank_id: string
  }) => capture('wallet_withdraw_pin_step_opened', properties),
  trackWalletWithdrawSubmitted: (properties: {
    amount: number
    currency: string
    bank_id: string
  }) => capture('wallet_withdraw_submitted', properties),
  trackWalletWithdrawSucceeded: (properties: {
    amount: number
    currency: string
    bank_id: string
  }) => capture('wallet_withdraw_succeeded', properties),
  trackWalletWithdrawFailed: (properties: {
    amount: number
    currency: string
    bank_id: string
    reason: 'pin' | 'kyc' | 'other'
    error_message: string
  }) => capture('wallet_withdraw_failed', properties),
  trackKycModalOpened: (properties: { source: string }) =>
    capture('kyc_modal_opened', properties),
  trackDashboardRecentGiftActionOpened: (properties: {
    action_type: string
    gift_id: string
  }) => capture('dashboard_recent_gift_action_opened', properties),
  trackDashboardSeeAllGiftPagesClicked: () =>
    capture('dashboard_see_all_gift_pages_clicked'),
  trackDashboardRecentGiftsRetryClicked: () =>
    capture('dashboard_recent_gifts_retry_clicked'),
  trackDashboardAiAssistantClicked: () =>
    capture('dashboard_ai_assistant_clicked'),
  trackKycSubmitted: (properties: {
    action: 'nin' | 'bvn' | 'utility' | 'face'
  }) => capture('kyc_submitted', properties),
  trackKycSubmitFailed: (properties: {
    action: 'nin' | 'bvn' | 'utility' | 'face'
    error_message: string
  }) => capture('kyc_submit_failed', properties),
  trackProfileEditStarted: () => capture('profile_edit_started'),
  trackProfileSaved: () => capture('profile_saved'),
  trackProfileSaveFailed: (properties: { error_message: string }) =>
    capture('profile_save_failed', properties),
  trackProfileTagModalOpened: () => capture('profile_tag_modal_opened'),
  trackProfileTagSaved: () => capture('profile_tag_saved'),
  trackProfileTagSaveFailed: (properties: { error_message: string }) =>
    capture('profile_tag_save_failed', properties),
  trackProfilePhotoUploadStarted: () =>
    capture('profile_photo_upload_started'),
  trackProfilePhotoUploadSucceeded: () =>
    capture('profile_photo_upload_succeeded'),
  trackProfilePhotoUploadFailed: (properties: { error_message: string }) =>
    capture('profile_photo_upload_failed', properties),
  trackProfileInterestsSaved: (properties: { count: number }) =>
    capture('profile_interests_saved', properties),
  trackProfileInterestsSaveFailed: (properties: { error_message: string }) =>
    capture('profile_interests_save_failed', properties),
  trackStoreCategorySelected: (properties: {
    category: string
    enabled: boolean
    source: 'stores_hub'
  }) => capture('store_category_selected', properties),
  trackStoreCategoryComingSoonClicked: (properties: {
    category: string
    source: 'stores_hub'
  }) => capture('store_category_coming_soon_clicked', properties),
  trackBillsVerifySucceeded: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
    verify_type: 'meter' | 'iuc'
  }) => capture('bills_verify_succeeded', properties),
  trackBillsVerifyFailed: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
    verify_type: 'meter' | 'iuc'
    error_message: string
  }) => capture('bills_verify_failed', properties),
  trackBillsSubmitStarted: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
    recipients_count: number
    has_gift: boolean
    has_scheduled: boolean
    has_recurring: boolean
  }) => capture('bills_submit_started', properties),
  trackBillsSubmitSucceeded: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
    recipients_count: number
    has_gift: boolean
    has_scheduled: boolean
    has_recurring: boolean
  }) => capture('bills_submit_succeeded', properties),
  trackBillsSubmitFailed: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
    recipients_count: number
    has_gift: boolean
    has_scheduled: boolean
    has_recurring: boolean
    error_message: string
  }) => capture('bills_submit_failed', properties),
  trackBillsRecurringCreated: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
    recurring_count: number
  }) => capture('bills_recurring_created', properties),
  trackBillsBeneficiaryPickerOpened: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
  }) => capture('bills_beneficiary_picker_opened', properties),
  trackBillsBeneficiarySelected: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
    matched_by: 'tag' | 'phone' | 'none'
  }) => capture('bills_beneficiary_selected', properties),
  trackBillsIdentifierSuggestionSelected: (properties: {
    bill_type: 'airtime' | 'data' | 'electricity' | 'cable_tv'
  }) => capture('bills_identifier_suggestion_selected', properties),
}
