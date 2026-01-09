# Password Authentication Feature

**Date:** January 9, 2026
**Status:** Live on Production

---

## Summary

Diamond members can now set a password and use it to sign in, as an alternative to magic link authentication.

---

## Problem

Members who add the site to their iPhone home screen were unable to stay logged in. When they clicked the magic link in their email, it opened in Safari, but the home screen app runs in a separate browser context. The two don't share login sessions, so members were stuck in a loop.

---

## Solution

Members can now set a password in their profile settings. Once set, they can sign in using their email and password directly within the home screen app, bypassing the magic link entirely.

---

## How It Works

1. Member signs up or logs in via magic link or Google (as before)
2. In their profile, they can optionally set a password
3. On future visits, they choose between magic link or password on the sign-in page
4. Password login includes a "Remember me" option for 30-day sessions

---

## User-Facing Changes

- Sign-in page now has a toggle between "Magic Link" and "Password" modes
- Profile page has a new "Password Settings" section
- Password requirements: minimum 8 characters, at least one letter and one number

---

## Technical Implementation

### Database

- Migration `007_password_auth.sql` adds `password_hash` column to users table
- Index on email for users with passwords set

### Backend

- `/api/profile/password` - GET (check status) and POST (set password)
- Credentials provider added to NextAuth configuration
- bcryptjs for password hashing (12 rounds)

### Frontend

- Sign-in page: auth mode toggle, password field with visibility toggle
- Profile page: password settings section with set/change form

### Files Changed

| File | Description |
|------|-------------|
| `migrations/007_password_auth.sql` | Database migration |
| `src/lib/password.ts` | Hashing utilities |
| `src/app/api/profile/password/route.ts` | Password API |
| `auth.ts` | Credentials provider |
| `src/app/auth/signin/page.tsx` | Sign-in UI |
| `src/app/app/profile/page.tsx` | Profile password settings |

---

## No Action Required

This is an optional feature. Members who prefer magic links or Google sign-in can continue using those methods. The password option is simply available for those who need it, particularly home screen app users.
