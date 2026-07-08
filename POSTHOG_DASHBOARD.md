# PostHog Dashboard Spec

This file defines the first product analytics dashboard to build in PostHog for Giftseon.

Scope

- Focus on activation, conversion, and friction across onboarding, gift creation, wallet, KYC, dashboard, and profile.
- Use only the events currently implemented in `src/lib/analytics/events.ts`.
- Do not add charts for sensitive inputs or raw user content.

Recommended dashboard name

- `Giftseon Product Overview`

Global filters

- Date range: last 30 days by default
- Breakdown filters to add when useful:
  - `country`
  - `account_type`
  - `kyc_level`
  - `pin_activated`

## 1. Activation

Insight: Login request volume

- Type: Trends
- Event: `auth_login_submitted`
- Breakdown: `method`

Insight: Login completion rate

- Type: Funnel
- Steps:
  1. `auth_login_submitted`
  2. `auth_login_otp_submitted`
  3. `auth_login_succeeded`

Insight: Register completion rate

- Type: Funnel
- Steps:
  1. `auth_register_submitted`
  2. `auth_register_otp_submitted`
  3. `auth_register_succeeded`

Insight: Magic link success vs failure

- Type: Trends
- Events:
  - `auth_magic_link_succeeded`
  - `auth_magic_link_failed`
- Breakdown: `action`

Insight: Auth failure reasons

- Type: Trends
- Events:
  - `auth_login_failed`
  - `auth_register_failed`
- Breakdown: `stage`

## 2. Gift Creation

Insight: Gift create funnel

- Type: Funnel
- Steps:
  1. `gift_create_step_viewed` where `step = category`
  2. `gift_create_step_viewed` where `step = template`
  3. `gift_create_template_selected`
  4. `gift_create_step_viewed` where `step = customize`
  5. `gift_create_submitted`
  6. `gift_create_succeeded`

Insight: Template selection volume

- Type: Trends
- Event: `gift_create_template_selected`
- Breakdown: `template_id`

Insight: Gift create failures

- Type: Trends
- Event: `gift_create_failed`
- Breakdown: `template_id`

Insight: Category to success

- Type: Funnel
- Steps:
  1. `gift_create_step_viewed` where `step = category`
  2. `gift_create_succeeded`
- Breakdown: `category_id`

## 3. Gifts Management

Insight: Gifts list filter usage

- Type: Trends
- Events:
  - `gift_list_filters_applied`
  - `gift_list_filters_reset`

Insight: Share modal opens

- Type: Trends
- Event: `gift_share_modal_opened`
- Breakdown: `source`

Insight: Deactivate vs reactivate

- Type: Trends
- Events:
  - `gift_deactivated`
  - `gift_reactivated`
- Breakdown: `source`

Insight: List item to details usage

- Type: Trends
- Event: `gift_list_item_viewed`

## 4. Wallet

Insight: Top-up funnel

- Type: Funnel
- Steps:
  1. `wallet_topup_submitted`
  2. `wallet_topup_redirect_started`

Insight: Withdraw funnel

- Type: Funnel
- Steps:
  1. `wallet_withdraw_pin_step_opened`
  2. `wallet_withdraw_submitted`
  3. `wallet_withdraw_succeeded`

Insight: Withdraw failure reasons

- Type: Trends
- Event: `wallet_withdraw_failed`
- Breakdown: `reason`

Insight: Withdraw amount distribution

- Type: Trends
- Event: `wallet_withdraw_submitted`
- Math: average of `amount`
- Breakdown: `currency`

## 5. KYC

Insight: KYC modal entry sources

- Type: Trends
- Event: `kyc_modal_opened`
- Breakdown: `source`

Insight: KYC submission volume

- Type: Trends
- Event: `kyc_submitted`
- Breakdown: `action`

Insight: KYC failure volume

- Type: Trends
- Event: `kyc_submit_failed`
- Breakdown: `action`

Insight: KYC source to submit

- Type: Funnel
- Steps:
  1. `kyc_modal_opened`
  2. `kyc_submitted`
- Breakdown: `source`

## 6. Dashboard Engagement

Insight: Recent gift action usage

- Type: Trends
- Event: `dashboard_recent_gift_action_opened`
- Breakdown: `action_type`

Insight: Dashboard CTA clicks

- Type: Trends
- Events:
  - `dashboard_see_all_gift_pages_clicked`
  - `dashboard_recent_gifts_retry_clicked`
  - `dashboard_ai_assistant_clicked`

## 7. Profile

Insight: Profile edit success rate

- Type: Funnel
- Steps:
  1. `profile_edit_started`
  2. `profile_saved`

Insight: Tag change performance

- Type: Funnel
- Steps:
  1. `profile_tag_modal_opened`
  2. `profile_tag_saved`

Insight: Profile failure events

- Type: Trends
- Events:
  - `profile_save_failed`
  - `profile_tag_save_failed`
  - `profile_photo_upload_failed`
  - `profile_interests_save_failed`

Insight: Profile photo upload success

- Type: Funnel
- Steps:
  1. `profile_photo_upload_started`
  2. `profile_photo_upload_succeeded`

Insight: Interests update usage

- Type: Trends
- Event: `profile_interests_saved`
- Math: average of `count`

## 8. Saved Cohorts

Create these cohorts in PostHog:

- `Completed registration`
  - Users who did `auth_register_succeeded`
- `Created a gift page`
  - Users who did `gift_create_succeeded`
- `Wallet-active users`
  - Users who did `wallet_topup_submitted` or `wallet_withdraw_submitted`
- `KYC-engaged users`
  - Users who did `kyc_modal_opened`
- `Profile-engaged users`
  - Users who did `profile_saved` or `profile_tag_saved` or `profile_photo_upload_succeeded`

## 9. Alerts To Add

- Alert if `wallet_withdraw_failed` with `reason = kyc` spikes day-over-day.
- Alert if `gift_create_failed` increases materially week-over-week.
- Alert if `auth_login_succeeded` drops while `auth_login_submitted` stays stable.

## 10. Build Order

Build the dashboard in this order:

1. Activation funnels
2. Gift creation funnel
3. Wallet and KYC charts
4. Profile charts
5. Dashboard engagement charts
6. Cohorts and alerts

## 11. Notes

- Prefer funnels and breakdowns over raw event counts when making product decisions.
- Keep chart names stable so the team can reference them consistently.
- If you add new analytics events later, extend this file in the same change.
