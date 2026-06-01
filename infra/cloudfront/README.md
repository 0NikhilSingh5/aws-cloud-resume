# CloudFront URL rewrite

`url-rewrite.js` handles the index resolution that S3 (REST endpoint) won't do
on its own. With Next.js `output: "export"` + `trailingSlash: true`, routes
build as `out/<route>/index.html`. CloudFront needs to be told to append
`index.html` when a request lands on a directory-style URL — otherwise S3
returns 403 (because OAC denies `ListBucket`, so missing keys 403 instead of
404).

## Attach (AWS Console)

1. CloudFront → Functions → Create function → name `url-rewrite` → runtime
   `cloudfront-js-2.0`. Paste contents of `url-rewrite.js`.
2. Test tab: try `/readywire/` — should rewrite to `/readywire/index.html`.
3. Publish.
4. Distribution `E1PNSO5QUYT69` → Behaviors → edit the default behavior →
   Function associations → Viewer request → Function type `CloudFront
   Functions` → select `url-rewrite` → Save.
5. Invalidate `/*` to flush cached 403s.

## Attach (AWS CLI — one-shot)

```bash
aws cloudfront create-function \
  --name url-rewrite \
  --function-config Comment="Rewrite dir URIs to index.html",Runtime=cloudfront-js-2.0 \
  --function-code fileb://url-rewrite.js

# grab the ETag and publish
ETAG=$(aws cloudfront describe-function --name url-rewrite --query 'ETag' --output text)
aws cloudfront publish-function --name url-rewrite --if-match "$ETAG"

# then in the console, attach to the default behavior on Viewer request
```
