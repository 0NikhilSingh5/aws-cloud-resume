# CloudFront Functions

The distribution's routing is **one** viewer-request function, `url-rewrite`, attached to the
default behaviour of `E1PNSO5QUYT69`. Its source of truth lives in the sibling **`apps-landing`
repo** (`url-rewrite.js`): host → prefix routing for the apex, `apps.codenickk.com` and
`fuelmeter.codenickk.com`, the permanent `resume.codenickk.com` 301, and each host's not-found
rule. There is deliberately **no copy in this repo** — a stale pre-host-routing duplicate sat
here until 2026-08-03, and publishing it would have silently broken every host but the apex.

Why a function at all: with Next.js `output: "export"` + `trailingSlash: true`, routes build as
`out/<route>/index.html`, and the OAC'd S3 REST origin returns **403** (not 404) for missing
keys because `ListBucket` is denied — so without the rewrite every subroute 403s.

## Changing it

Edit `apps-landing/url-rewrite.js`, then follow "Changing the routing function" in
`fuel-meter/infra/fuelmeter-domain.md` — `update-function`, then `test-function` against the
DEVELOPMENT stage for **every** host (apex, apps, fuelmeter, the resume 301) before
`publish-function`, then invalidate. `test-function` runs the real engine; a local mock does
not. The runtime is `cloudfront-js-2.0` (ES5 only, sub-millisecond budget).

## First-time attach (already done, kept for reference)

1. `aws cloudfront create-function --name url-rewrite --function-config
   Comment="host routing for the codenickk distribution",Runtime=cloudfront-js-2.0
   --function-code fileb://url-rewrite.js`
2. `describe-function` for the ETag, then `publish-function --if-match "$ETAG"`.
3. Distribution `E1PNSO5QUYT69` → default behaviour → Function associations → Viewer request →
   `url-rewrite`.
4. Invalidate `/*` to flush cached 403s.
