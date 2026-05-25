# WordPress Form Spec (`wp_form_email_crm`)

This spec replaces the custom checkout submission from `src/app/page.tsx` with a WordPress-managed form flow (email-first, CRM optional).

## Scope decision

- Keep lead capture flow in WordPress.
- Do not keep the old AmoCRM Cloudflare worker as a hard dependency for launch.
- Keep two user intents in one form: `Для себя` and `Для компании`.

## Tooling

Recommended plugin: Fluent Forms (or Contact Form 7 if preferred).

For MVP, configure:

- Admin email notification (mandatory)
- Optional webhook action for CRM (can be enabled after MVP)

## Form fields (MVP)

| Field | Type | Required | Validation/Rule |
| --- | --- | --- | --- |
| `request_type` | Radio (`personal`, `company`) | yes | default `personal` |
| `name` | Text | yes | min 2 chars |
| `phone` | Tel | yes | RU format, accept `+7` only |
| `email` | Email | yes | standard email validator |
| `contact_method` | Select (`telegram`, `max`, `phone`, `email`) | yes | default `telegram` |
| `contact_handle` | Text | conditional | required when method = `telegram`; format `^@[a-zA-Z0-9_]{5,32}$` |
| `city` | Text | conditional | required when `request_type=personal` |
| `company` | Text | conditional | required when `request_type=company` |
| `inn` | Text | no | numeric only when filled |
| `ogrn` | Text | no | numeric only when filled |
| `comment` | Textarea | no | free text |
| `logo_file` | File upload | no | JPG/PNG, max 3 MB |
| `seal_color` | Select (`red`, `green`, `white`, `blue`) | no | default `red` |
| `artist` | Select/Text | no | keep placeholder choices |
| `quantity` | Number | yes | min 1, default 3 |
| `product_name` | Hidden/Text | yes | default `Бомбочка для ванны` |
| `unit_price` | Hidden/Number | yes | default `999` |
| `total` | Calculated/Number | yes | `quantity * unit_price` |
| `consent_personal_data` | Checkbox | yes | must be checked |

## Consent text (required near submit)

Use this exact logic from current UI:

- User agrees to personal data processing.
- User confirms privacy policy reading.
- Provide links to uploaded PDFs in WP:
  - `personal-data-consent.pdf`
  - `privacy.pdf`

## Conditional logic

- If `request_type=personal`: show `city`; hide `company`, `inn`, `ogrn`.
- If `request_type=company`: show `company`, `inn`, `ogrn`; city optional/hidden.
- If `contact_method=telegram`: `contact_handle` required and validated.
- For other methods: `contact_handle` optional.

## Notification routing

## 1) Mandatory email notification

Send to site owner mailbox with:

- all form fields
- uploaded logo file link
- timestamp
- source URL

Email subject pattern:

`[Posleslovie] Новая заявка ({request_type}) #{submission_id}`

## 2) Optional CRM webhook (phase 2)

Enable only after email flow is stable.

Payload should include:

- lead type (`personal`/`company`)
- contact data
- order details (`quantity`, `unit_price`, `total`)
- file URL (not base64)

## Anti-spam and reliability

- Enable honeypot.
- Enable basic rate-limiting (plugin-level).
- Log all submissions in WP DB.
- Show success message on submit:
  - `Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.`

## UX parity notes (from current app)

Current custom flow has two steps, city suggestions, and strict validation in `validateCheckout(...)`.
For MVP WP migration:

- keep required fields and consent parity;
- allow single-step form UI;
- city autocomplete is optional (can be added later).

## Data retention

- Keep form entries in WP for operator review.
- Export entries weekly during test phase.

