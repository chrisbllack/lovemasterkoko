# Deployment Guide

Applies to the Banky Hotel & Suites enterprise booking app.

---

## 1. Environments

| Environment | Purpose     |
| ----------- | ----------- |
| Local       | Development |
| Production  | Live guest reservations & Admin management |

## 2. Configuration & Secrets

Set these environment variables before running:

| Variable                   | Scope    | Description                         |
| -------------------------- | -------- | ----------------------------------- |
| `EMAIL_SENDER_DOMAIN`      | server   | Verified sender domain for vouchers |
| `FRONT_DESK_EMAIL`         | server   | Front desk notification address     |
| `PAYSTACK_SECRET_KEY`      | server   | Live/Test Paystack secret key       |
| `VITE_PAYSTACK_PUBLIC_KEY` | client   | Publishable Paystack public key     |
| `VITE_WHATSAPP_NUMBER`     | client   | Concierge WhatsApp contact number   |

## 3. Payments (Paystack)

Use test keys (`pk_test_...`) during development and production keys (`pk_live_...`) for live operation.

