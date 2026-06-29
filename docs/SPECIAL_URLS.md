# Burner Wallet — Special URL Schemes

This document describes all special URL patterns the Burner Wallet supports for
loading a specific view, preloading a private key, requesting a payment, or
claiming funds. It is intended to make the existing implementation discoverable
for integrators and new contributors.

> Reference implementation: `src/App.js`, `componentWillMount()` (the URL
> dispatcher block) — see the section "Pathname dispatcher" below.

## 1. Conventions

All schemes are evaluated against `window.location.pathname` and (falling back)
`window.location.hash`. The order of evaluation in the code matters; later
patterns only match when earlier ones do not.

| # | Pattern                                 | View / Action                         | Code path (src/App.js) |
|---|------------------------------------------|----------------------------------------|------------------------|
| 1 | `/pk<base64-or-hex>`                     | Load a private key                     | `/pk` branch           |
| 2 | `/<42-char-address>`                     | Open "send to address" view            | `pathname.length==43`  |
| 3 | `/<claim-id>;<claim-key>`                | Preload a claim (claim screen)         | `pathname.length==134` |
| 4 | `/<65–67 char private key>` or `#<…>`    | Load a raw private key                 | length 65–67 branch    |
| 5 | `/vendors;<…>`                           | Open vendors list                      | `/vendors;` branch     |
| 6 | `/<address>;<amount>[;<extra>]`          | Open "send to address" pre-filled      | `parts.length>=2`      |

> The leading `/` is included in the dispatcher logic; in practice it is the
> result of `window.location.pathname` so a deployment root behaves as
> `<host>/<pattern>`.

## 2. Pattern 1 — `/pk<encoded>`

The path starts with `/pk` and the hash contains a Base64 (or hex) encoded
private key.

Examples:

```
https://burnerwallet.example/pk#cHJpdmF0ZWtleQ==
https://burnerwallet.example/pk#0x4c3b8e0e2f...
```

Behaviour:

* If the hash is 64 or 66 chars, it is treated as a hex private key directly.
* Otherwise it is decoded from Base64URL (`base64url.toBuffer`) and converted
  to hex via `Web3.utils.bytesToHex`.
* The wallet stores the key into `possibleNewPrivateKey` and rewrites the URL
  to `/` to clear it from the address bar.

## 3. Pattern 2 — bare 42-char address

A path that is exactly 43 characters long (the leading `/` plus a 42-character
Ethereum address) opens the "send to address" view with the address pre-filled.

```
https://burnerwallet.example/0x4c3b8e0e2f1c2a1b9d3e4f5061728394a5b6c7d8
```

## 4. Pattern 3 — claim link

Two segments separated by a semicolon. Total path length is 134.

```
/<32-char-claim-id>;<96-char-claim-key>
```

Behaviour: stores `claimId` and `claimKey` in state and rewrites the URL.

## 5. Pattern 4 — raw private key in path or hash

A path or hash of length 65–67 (without semicolons) is interpreted as a raw
private key. The code first inspects `pathname`, then `hash`; the key is
prefixed with `0x` if needed.

```
https://burnerwallet.example/0x4c3b8e0e2f1c2a1b9d3e4f5061728394a5b6c7d8e9f0
https://burnerwallet.example/#0x4c3b8e0e2f1c2a1b9d3e4f5061728394a5b6c7d8e9f0
```

## 6. Pattern 5 — vendors

Any path beginning with `/vendors;` opens the vendors view.

```
https://burnerwallet.example/vendors;category=merchants
```

## 7. Pattern 6 — send-to-address with amount

`<address>;<amount>` (optionally followed by `;<extra data>`) opens the
"send to address" view with both the recipient and the amount pre-filled.
`extra` is forwarded to the transaction when present.

```
https://burnerwallet.example/0x4c3b8e0e2f1c2a1b9d3e4f5061728394a5b6c7d8;0.5
https://burnerwallet.example/0x4c3b8e0e2f1c2a1b9d3e4f5061728394a5b6c7d8;0.5;ref123
```

The amount is checked via `parseFloat(...) > 0` and the address must be
exactly 42 characters. The check does not validate a `0x` prefix; pattern 2
and pattern 6 share the address-format check.

## 8. Pathname dispatcher (reference)

```javascript
// src/App.js — inside componentWillMount()
if (window.location.pathname) {
  if (window.location.pathname.indexOf("/pk") >= 0) { /* pattern 1 */ }
  else if (window.location.pathname.length == 43) { /* pattern 2 */ }
  else if (window.location.pathname.length == 134) { /* pattern 3 */ }
  else if (pathname/hash length 65..67) { /* pattern 4 */ }
  else if (window.location.pathname.indexOf("/vendors;") == 0) { /* pattern 5 */ }
  else { /* pattern 6 — split by ';' and validate address + amount */ }
}
```

## 9. Security notes

* Loading a private key from a URL is sensitive. The dispatcher always calls
  `window.history.pushState({}, "", "/")` after capture to remove the secret
  from the address bar — except for pattern 2, 5 and 6 which are not
  secret-bearing.
* Pattern 4 (raw private key in path or hash) does **not** call
  `pushState`; an integrator should treat such links as untrusted and never
  embed them in long-lived references.
* The wallet should not be deployed behind a logging reverse proxy without
  scrubbing the URL path.

## 10. Future work

* Move the URL dispatcher out of `componentWillMount` into a dedicated
  module so it can be unit-tested.
* Add a JSON schema describing each pattern so wallets from other vendors
  can interop.
* Centralise the `pathname.length == 43 / 65..67 / 134` magic numbers with
  named constants.
