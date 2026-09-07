# Testing Checklist

## 1. Public Site & Reservation Flow

- [ ] `/` loads: video header, booking bar, rooms catalog
- [ ] `/rooms` lists published rooms with pricing and amenities
- [ ] `/reserve` computes nights × rate correctly with concurrency locks
- [ ] Paystack checkout integration loads amount accurately
- [ ] Submitting a reservation creates a confirmed booking reference

## 2. Admin Dashboard

- [ ] Sign-in for staff admin accounts works properly
- [ ] Overview dashboard shows current occupancy and revenue statistics
- [ ] Reservation manager allows checking in, checking out, and updating folios
- [ ] CMS manager allows modifying rates, room details, and branding

## 3. Guest Portal (`/my-stay`)

- [ ] Guests can view their active reservations
- [ ] Guest messaging and requests interface works seamlessly

