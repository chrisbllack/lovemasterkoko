# Production Operation Guide

Banky Hotel & Suites enterprise booking engine powered by TanStack Start and Firebase Firestore.

## 1. Secrets & Environment

| Secret                      | Description                                   |
| --------------------------- | --------------------------------------------- |
| `PAYSTACK_SECRET_KEY`       | Live secret key (`sk_live_...`)               |
| `VITE_PAYSTACK_PUBLIC_KEY`  | Live public key (`pk_live_...`)               |
| `EMAIL_SENDER_DOMAIN`       | Verified production email sending domain      |
| `FRONT_DESK_EMAIL`          | Real front desk inbox                         |
| `VITE_WHATSAPP_NUMBER`      | Real hotel contact number (`2347036905671`)   |

## 2. Verification Checklist

- [ ] Production URL loads without errors
- [ ] Room booking hold and checkout process works
- [ ] Real-time availability returns accurate open units
- [ ] Staff admin login and reservation management operating smoothly

