# Kit checkout — setup & operations

Sells `Broke After Payday` at `/kit` with on-domain M-Pesa STK push (IntaSend)
or hosted checkout (Pesapal), stateless signed download links, per-buyer PDF
stamping, and email delivery via Resend. No database required: payment records
live in the provider dashboard; download rights live in HMAC-signed tokens.

## Architecture

```
/kit (sales page)
  └─ KitCheckout.tsx ── POST /api/kit/checkout ─► IntaSend STK push (or Pesapal redirect)
        │                                            │
        └─ polls GET /api/kit/status ◄───────────────┘ payment confirms
                 │  mints HMAC token + sends Resend email
                 ▼
        GET /api/kit/download?token=…  ─► stamps master PDF with buyer email (pdf-lib) ─► streams
POST /api/kit/webhook  ◄─ IntaSend webhook (backup delivery if buyer closed the tab)
/kit/thanks            ◄─ Pesapal callback redirect (polls status by trackingId)
```

## Go-live checklist

1. `cp .env.kit.example` values into `.env.local` (and your host's env settings).
2. `openssl rand -hex 32` → `KIT_DOWNLOAD_SECRET`.
3. **IntaSend**: create account → KYC → API keys → set `INTASEND_SECRET_KEY`.
   Dashboard → Webhooks → URL `https://www.payecalculator.co.ke/api/kit/webhook`,
   challenge = `INTASEND_WEBHOOK_CHALLENGE`. Test on sandbox first
   (`INTASEND_BASE_URL=https://sandbox.intasend.com`, sandbox keys).
4. **Resend**: add + verify the sending domain (DNS records), create API key.
5. Master PDF: keep `private/Broke_After_Payday_Kenya_Kit_2026.pdf` up to date.
   It is outside `/public`, so it is never directly downloadable.
6. `npm install` (adds `pdf-lib`), `npm run build`, deploy.
7. Buy a real copy with your own phone before announcing. Check: STK prompt,
   success page download, email arrival, stamped footer on page 2+.

## Pesapal (optional fallback)

Set `PAYMENT_PROVIDER=pesapal`. One-time IPN registration:

```bash
TOKEN=$(curl -s -X POST $PESAPAL_BASE_URL/api/Auth/RequestToken \
  -H 'Content-Type: application/json' \
  -d '{"consumer_key":"…","consumer_secret":"…"}' | jq -r .token)
curl -s -X POST $PESAPAL_BASE_URL/api/URLSetup/RegisterIPN \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"url":"https://www.payecalculator.co.ke/api/kit/status","ipn_notification_type":"GET"}'
```

Paste the returned `ipn_id` into `PESAPAL_IPN_ID`.

## Operations

- **Resend a link**: tokens are stateless — mint one with
  `node -e "console.log(require('./lib/kit/token').mintToken('buyer@x.com','MANUAL',7))"`
  (run with env loaded) and send `https://…/api/kit/download?token=…`.
- **New edition**: replace the PDF in `private/`, redeploy, email the buyer list
  from Resend/IntaSend export.
- **Price change**: `KIT_PRICE_KES` env + the display constant in
  `components/KitCheckout.tsx` and copy on `app/kit/page.tsx`.
- **Refunds**: issue from the IntaSend/Pesapal dashboard.
- **VAT**: digital services are VATable in Kenya — confirm treatment with your
  accountant before scale.
