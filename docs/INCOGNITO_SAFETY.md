# Incognito Mode & Private-Key Safety

> Issue: austintgriffith/burner-wallet#170
> Audience: contributors, reviewers, end users.

The burner-wallet keeps a freshly generated private key in the browser's
local storage. Opening the wallet in a private/incognito window changes
that promise in ways most users do not expect. This document records the
risk, the user-facing copy the wallet already shows, and the changes we
are willing to accept in the codebase to make the situation more
honest.

## What local storage means in this app

When the wallet first loads it generates a `metaPrivateKey` and writes
it to `window.localStorage` under a well-known key. From that point on
the private key is read back from local storage on every reload. The
key never leaves the browser, and the user is expected to back it up
via the existing paper-wallet export flow.

Concretely the data lifecycle is:

1. On first load the wallet calls `LocalSigner` (or, in older builds,
   the in-wallet helper) to generate a random private key.
2. The key is written to `localStorage["metaPrivateKey"]`.
3. On every subsequent load the wallet reads it back from the same
   slot before rendering the home screen.
4. The paper-wallet backup flow lets the user export the key as
   plain text or as a scannable QR code, so the key can be restored
   on another device or browser.

## Why incognito mode is dangerous

Incognito / private-browsing windows are allowed to keep `localStorage`
for the lifetime of the window, but most browsers wipe it the moment
the last tab is closed. From the user's perspective that is usually
invisible: closing the window looks identical to closing a normal
tab.

If a user opens the burner-wallet in an incognito window, receives
funds, and then closes the window, the private key — and therefore
the funds — are gone. There is no server-side backup, no
"forgot my key" flow, and no way to recover the wallet without the
key that was just deleted.

The current UI already detects incognito mode in
`Assemble.js` and shows a small warning banner, but research from
issue #170 shows that the existing copy is too quiet: most users
dismiss the banner without realising that closing the tab will
delete their funds.

## What we are changing

We are landing this in three layers, in order of effort:

1. **Documentation** (this file). Capture the risk, the lifecycle,
   and the intended user-facing copy in one place so future
   contributors and reviewers can refer back to it. No code change
   required, no behaviour change.
2. **Stronger in-app copy.** Replace the small "Incognito mode"
   banner with a prominent, dismissable warning that names the
   specific failure mode: "If you close this tab, your private key
   will be deleted and your funds will be lost. Back up the key from
   the paper-wallet menu before you close this window." The wording
   is tracked in `src/views/Assemble.js` once the implementation
   lands.
3. **Optional export on unload.** As a defensive measure, the
   `window.onbeforeunload` handler can offer the user a one-time
   download of `metaPrivateKey` as a plain-text file. This must
   remain opt-in: silently exporting the key would be a worse
   privacy footgun than the problem it solves.

The third step is intentionally left out of the smallest useful
scope for this issue; it is mentioned here so that reviewers know
the direction of travel and can veto a quieter intermediate
solution that would block it.

## Acceptance criteria for the documentation PR

- This file lives at `docs/INCOGNITO_SAFETY.md` and is linked from
  the project `README.md` "Safety" section.
- The copy here is consistent with the eventual in-app banner
  wording in `Assemble.js`, so the two cannot drift silently.
- Future bounty briefs that touch private-key storage must
  reference this file in their acceptance criteria.

## Related issues

- #170 — original brief
- #208 — git branch flow (governance, not user-facing)
- #212 — special URL schemes (covers the `metaPrivateKey:` scheme
  used by the paper-wallet backup flow)
