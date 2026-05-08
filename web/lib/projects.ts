export interface Project {
  slug: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  tags: string[];
  accent: string;
  githubUrl?: string;
  story: {
    context: string;
    challenge: string;
    approach: string;
    approachDetails?: string[];
    architectureLead: string;
    impact: string;
  };
  workflowSteps: { label: string; detail: string }[];
  workflowAscii?: string;
  diagramImage?: string;
  engineeringNotes?: { title: string; body: string }[];
  codeSnippets?: { title: string; language: string; code: string; note?: string }[];
}

export const projects: Project[] = [
  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "cognito-auth-platform",
    diagramImage: "/images/diagrams/cognito-auth-platform.png",
    title: "Cognito Auth Platform",
    highlightWord: "Cognito",
    subtitle:
      "Multi-environment OIDC auth with custom JWT claims and local RS256 verification",
    tags: ["AWS Cognito", "OIDC", "Lambda", "JWKS", "RS256", "Terraform"],
    accent: "#fd5200",
    story: {
      context:
        "A multi-tenant SaaS platform serves several customer organizations across four isolated environments — dev, sandbox, beta, and production. Each tenant's users need to authenticate against an identity provider that's both centrally operated and tenant-aware: a backend service handling a request must be able to read the caller's tenant id, role, and employee id directly from the bearer token, without hitting the IdP on every call.",
      challenge:
        "Out-of-the-box Cognito issues JWTs with a fixed claim set (sub, email, cognito:username, aud, exp). The platform needs additional claims that originate from the application database, kept in sync with every token. The auth design must also be consistent across all four pools (any policy change must roll out everywhere), and backends must verify tokens locally — going back to Cognito on every API call would add a round-trip per request and crush p99 latency.",
      approach:
        "Provisioned four Cognito user pools through a single Terraform module so password policy, recovery rules, OAuth scopes, and schema attributes stay in lockstep across environments. Wired a pre-token-generation Lambda into each pool that fires on every token issuance and overrides the JWT's claim set with values pulled from the application database. On the consumer side, every backend service implements RS256 verification locally against the pool's published JWKS (JSON Web Key Set), with key material cached for an hour after first fetch.",
      approachDetails: [
        "Authorization Code OAuth flow (with PKCE on public clients) for the hosted UI — Implicit flow is deprecated by OAuth 2.1 and forbidden for new clients.",
        "Token lifetimes: 60-minute access/ID tokens, 5-day refresh tokens. Short access reduces blast radius on token leaks; long refresh keeps the user signed in across the work week.",
        "Password policy enforced via Terraform: min 8 chars, requires upper / lower / number / symbol; account recovery via verified email then verified phone.",
        "Pre-token Lambda is idempotent and side-effect-free — Cognito retries on 5xx, so a non-idempotent claim source could double-write. The Lambda only reads.",
        "JWKS cache TTL is 1 hour. Cognito publishes its rotation cadence in years; an hour is a safe upper bound for staleness with negligible memory cost.",
      ],
      architectureLead:
        "Authentication is a request-time path with strict latency budgets. The flow keeps the IdP off the hot path: Cognito issues, the pre-token Lambda enriches, the backend verifies locally with cached keys.",
      impact:
        "All four environments authenticate users in the same way; one Terraform apply rolls a policy or schema change across the entire footprint. Backend services verify a token in well under a millisecond, fully offline from Cognito — token verification is no longer a measurable contributor to API latency. Adding a new claim is a one-file change to the pre-token Lambda; downstream services pick it up the next time their token rotates, without any service redeploy.",
    },
    workflowAscii: `
   Frontend ───sign-in───▶  Cognito  ──invokes──▶  Pre-Token Lambda
                                │                   adds custom claims
                                │                   (role, tenant_id,
                                │                    employee_id)
                                ▼
                        ┌─ ID token   ┐
                        ├─ Access     │ ──▶ Frontend stores
                        └─ Refresh    ┘
                                │
                                │  Authorization: Bearer <access>
                                ▼
                          Backend API
                                │
                                │  fetch JWKS once, cache 1h
                                ▼
                        Verify RS256 signature
                        + audience + expiry
                                │
                                ▼
                        Trust the claims
`,
    workflowSteps: [
      {
        label: "User authenticates",
        detail:
          "Frontend calls Cognito's hosted UI (Authorization Code + PKCE) or the InitiateAuth API directly with email and password. Cognito performs the credential check.",
      },
      {
        label: "Pre-token Lambda enriches",
        detail:
          "On every token issuance Cognito invokes the pre-token-generation trigger, which looks up the user in the application database and overrides the outgoing JWT's claim set with role, tenant_id, and employee_id.",
      },
      {
        label: "Cognito returns three tokens",
        detail:
          "ID token (identity), access token (authorization — sent to APIs), refresh token (5-day lifetime, used to obtain new access tokens without re-prompting credentials).",
      },
      {
        label: "API call with bearer",
        detail:
          "Each request to the backend carries the access token in the Authorization header. The token is opaque to the network — verification is the consumer's responsibility.",
      },
      {
        label: "Local RS256 verification",
        detail:
          "Backend reads the kid from the token header, looks up the matching public key in the cached JWKS, verifies the RS256 signature, then checks aud equals the app client id and exp is in the future.",
      },
      {
        label: "Trust the claims",
        detail:
          "Once all four checks pass, the service treats role / tenant_id / employee_id as authoritative for that request — no further lookups needed.",
      },
    ],
    engineeringNotes: [
      {
        title: "Why RS256, not HS256",
        body: "RS256 is asymmetric: Cognito signs with a private key, services verify with the corresponding public key from JWKS. Services never possess Cognito's signing key, so a compromised service can't forge tokens. HS256 is symmetric — services would need the shared secret, multiplying the attack surface.",
      },
      {
        title: "Why a pre-token Lambda, not custom user attributes",
        body: "Cognito custom user attributes (custom:role) are stored on the user record and only updated when the user record is mutated. The pre-token Lambda runs on every token issuance, so claims always reflect the current state of the source-of-truth database, not a stale snapshot.",
      },
      {
        title: "Why JWKS caching with a 1-hour TTL",
        body: "Cognito documents that key rotation happens infrequently and gives a long-lived JWKS endpoint. Caching for an hour means at most one extra Cognito call per service-process per hour — round-trip cost amortized to effectively zero. Without caching, JWKS would be fetched on every API call.",
      },
      {
        title: "Why lifecycle ignore_changes on the schema attribute",
        body: "Cognito's user-pool schema is append-only — the API accepts AddCustomAttributes but rejects deletes. Without `lifecycle { ignore_changes = [schema] }`, an attempt to remove an attribute via Terraform would fail every plan/apply forever. The lifecycle rule lets us add freely and treat removals as silent no-ops.",
      },
    ],
    codeSnippets: [
      {
        title: "Pre-token-generation Lambda — inject custom claims",
        language: "python",
        note: "Simplified illustrative example",
        code: `import boto3, os
ddb = boto3.resource("dynamodb")
profiles = ddb.Table(os.environ["PROFILES_TABLE"])

def lambda_handler(event, _ctx):
    """Cognito Pre-Token-Generation trigger.
    Runs on every JWT issuance — claims always reflect current DB state."""
    sub = event["request"]["userAttributes"]["sub"]
    profile = profiles.get_item(Key={"sub": sub}).get("Item", {})

    event["response"] = {
        "claimsOverrideDetails": {
            "claimsToAddOrOverride": {
                "tenant_id":   profile.get("tenant_id", ""),
                "role":        profile.get("role", "viewer"),
                "employee_id": profile.get("employee_id", ""),
            },
            # Drop sensitive defaults if present
            "claimsToSuppress": ["custom:debug"],
        }
    }
    return event`,
      },
      {
        title: "Local JWT verification with cached JWKS",
        language: "python",
        note: "Simplified illustrative example",
        code: `import time, jwt, requests
from jwt.algorithms import RSAAlgorithm

JWKS_URL = (
    f"https://cognito-idp.{REGION}.amazonaws.com"
    f"/{POOL_ID}/.well-known/jwks.json"
)
_keys: dict = {}
_fetched_at: float = 0
_TTL = 3600  # 1 hour

def _load_keys():
    global _keys, _fetched_at
    if _keys and (time.time() - _fetched_at) < _TTL:
        return _keys
    raw = requests.get(JWKS_URL, timeout=2).json()["keys"]
    _keys = {k["kid"]: RSAAlgorithm.from_jwk(k) for k in raw}
    _fetched_at = time.time()
    return _keys

def verify(token: str) -> dict:
    kid = jwt.get_unverified_header(token)["kid"]
    key = _load_keys().get(kid)
    if key is None:
        # Possible key rotation — force refresh once, then fail loud
        _keys.clear()
        key = _load_keys()[kid]
    return jwt.decode(
        token,
        key=key,
        algorithms=["RS256"],
        audience=APP_CLIENT_ID,   # rejects tokens issued for other apps
    )`,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "terraform-multi-stack",
    diagramImage: "/images/diagrams/terraform-multi-stack.png",
    title: "Terraform Multi-Stack IaC",
    highlightWord: "Multi-Stack",
    subtitle:
      "Modular AWS infrastructure with S3-backed state and DynamoDB locking",
    tags: ["Terraform", "AWS", "S3 State", "DynamoDB Lock", "VPC", "RDS"],
    accent: "#1A3DE8",
    story: {
      context:
        "The AWS footprint had grown organically across multiple engineers and several years — Cognito user pools, VPCs, EC2 fleets, RDS clusters, observability infrastructure. Almost everything was created through the console. State drift was constant: a security group manually patched in production wouldn't match the (already-out-of-date) sketch a teammate had in a private repo. Reproducing an environment from scratch was effectively impossible.",
      challenge:
        "Codify the entire footprint as Terraform with three guardrails: strict isolation between layers (an auth change must not touch RDS); remote state with locking so two engineers can't apply against the same stack at the same time; and per-environment variable files so the same module can produce dev, sandbox, beta, and prod with one diff.",
      approach:
        "Split the footprint into five stacks — auth, networking, shared, compute, observability — each with its own root module, its own S3-backed state file, and a shared DynamoDB lock table. Configuration that's identical across environments lives in `locals.tf` files; configuration that differs lives in `environments/<env>.tfvars`. Long-running blast-radius operations (compute, RDS) are deliberately separate from frequently-changing operations (auth, observability) so the latter can iterate without putting the former at risk.",
      approachDetails: [
        "S3 backend with bucket versioning enabled — every state change is recoverable; a corrupted state file can be rolled back to a known-good revision.",
        "S3 server-side encryption (SSE-S3) on the state bucket — state files contain resource attributes that may include secrets references.",
        "DynamoDB lock table is single-region (ap-south-1) and shared across all stacks. Lock contention is per-stack-key, so cross-stack work runs in parallel.",
        "`locals.tf` per stack drives the for_each over environments — one schema attribute added in locals propagates to all four user pools on the next apply.",
        "lifecycle { ignore_changes = [...] } applied surgically on append-only AWS APIs (Cognito user-pool schema, RDS final_snapshot_identifier) to avoid Terraform fighting AWS limitations on every plan.",
      ],
      architectureLead:
        "Five independently-applicable stacks, each with its own state, sharing a single lock table. The stack you change is the stack you risk — auth changes can't accidentally rebuild RDS.",
      impact:
        "Adding a new environment-scoped variable is one diff and one `terraform apply`. Drift is detected on the next plan rather than discovered during an outage. Onboarding a new engineer takes minutes — they `terraform init` against the right S3 backend and they have read access to whatever they have IAM rights for. The DynamoDB lock has prevented at least one prod-impact race condition where two engineers were independently iterating on the same compute stack.",
    },
    workflowAscii: `
       ┌─────────┐   ┌──────────┐   ┌─────────┐   ┌──────────────┐
       │  auth   │   │networking│   │ compute │   │observability │
       │ Cognito │   │   VPC    │   │  EC2    │   │  OpenObserve │
       │  (×4)   │   │   NAT    │   │  RDS    │   │  Lambda + ALB│
       │         │   │  API GW  │   │  Valkey │   │              │
       └────┬────┘   └────┬─────┘   └────┬────┘   └──────┬───────┘
            │             │              │               │
            └─────────────┼──────────────┼───────────────┘
                          ▼              ▼
                   ┌────────────┐  ┌─────────────┐
                   │  S3 state  │  │  DynamoDB   │
                   │ per-stack  │  │  lock table │
                   │ versioned  │  │  (shared)   │
                   │ encrypted  │  │             │
                   └────────────┘  └─────────────┘
`,
    workflowSteps: [
      {
        label: "Engineer edits a stack",
        detail:
          "Change goes into the relevant root module — auth, networking, compute, observability, or shared. Each stack is a self-contained Terraform project.",
      },
      {
        label: "terraform plan",
        detail:
          "Terraform reads the stack's state from S3, queries AWS for actual resource state, and prints a diff: what will be created, updated, or destroyed.",
      },
      {
        label: "DynamoDB lock acquired",
        detail:
          "Before any write to S3 state, Terraform writes a lock record into the DynamoDB lock table. Any other engineer running plan/apply against the same stack-key blocks here until the lock releases.",
      },
      {
        label: "terraform apply",
        detail:
          "AWS API calls executed in dependency order. State file in S3 rewritten — bucket versioning means the previous state is preserved as an old version.",
      },
      {
        label: "Lock released",
        detail:
          "On apply success or failure, the DynamoDB lock record is deleted. Other engineers can now plan/apply against this stack.",
      },
      {
        label: "lifecycle ignores append-only API quirks",
        detail:
          "For resources whose AWS API forbids deletion (Cognito user-pool schema, certain RDS attributes), lifecycle { ignore_changes = [...] } makes Terraform treat manual or accidental removals as silent no-ops rather than failing forever.",
      },
    ],
    engineeringNotes: [
      {
        title: "Why per-stack state, not a monolithic state file",
        body: "A monolithic state means every plan reads and re-evaluates every resource. With ~thousands of resources across the footprint, plan time becomes minutes and the blast radius of a botched apply touches everything. Per-stack state means an auth change reads only the auth resources — fast plan, contained risk.",
      },
      {
        title: "Why DynamoDB for state locking, not S3 conditional writes",
        body: "DynamoDB has a sub-50ms put-with-condition primitive purpose-built for this. Terraform's S3 backend integrates with DynamoDB natively — `dynamodb_table` is the documented locking mechanism. S3-only locking via conditional writes is slower and more failure-modes-prone.",
      },
      {
        title: "Why lifecycle { ignore_changes = [schema] } on Cognito",
        body: "Cognito's user-pool API supports adding schema attributes but not removing or modifying them. Without ignore_changes, any Terraform plan that tries to remove a custom attribute fails forever. The lifecycle rule makes Terraform treat schema as 'I'll add via this resource, AWS will handle the rest' — deletes are silently skipped.",
      },
      {
        title: "Why locals over module variables for environment fan-out",
        body: "When a value is identical across all four environments (a schema attribute, a password policy), it's a property of the module — locals.tf. When a value differs per environment (CIDR block, instance size), it's a property of the call — environments/<env>.tfvars. This split makes the diff for 'add a new claim to all pools' a one-file change.",
      },
    ],
    codeSnippets: [
      {
        title: "Remote backend configuration",
        language: "hcl",
        code: `terraform {
  required_version = ">= 1.5"

  backend "s3" {
    bucket         = "terraform-<account-id>"
    key            = "auth/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-state-locking"
    encrypt        = true               # SSE on state at rest
  }
}`,
      },
      {
        title: "Shared locals — one diff updates all four envs",
        language: "hcl",
        code: `locals {
  envs = ["dev", "sandbox", "beta", "prod"]

  schema_attributes = [
    { name = "tenant_id",   data_type = "String", mutable = true,
      string_attribute_constraints = { min_length = 0, max_length = 256 } },
    { name = "role",        data_type = "String", mutable = true,
      string_attribute_constraints = { min_length = 0, max_length = 64 } },
    { name = "employee_id", data_type = "String", mutable = true,
      string_attribute_constraints = { min_length = 0, max_length = 64 } },
  ]
}

resource "aws_cognito_user_pool" "this" {
  for_each = toset(local.envs)
  name     = "userpool-\${each.key}"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = true
  }

  dynamic "schema" {
    for_each = local.schema_attributes
    content {
      name                = schema.value.name
      attribute_data_type = schema.value.data_type
      mutable             = schema.value.mutable
    }
  }

  lifecycle {
    ignore_changes = [schema]   # Cognito API is append-only on schema
  }
}`,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "ecr-ecs-fargate-cicd",
    diagramImage: "/images/diagrams/ecr-ecs-fargate-cicd.png",
    title: "ECR / ECS Fargate CI/CD",
    highlightWord: "Fargate",
    subtitle:
      "Branch-gated container delivery with environment-scoped secrets and a manual prod approval",
    tags: ["Docker", "ECR", "ECS Fargate", "Bitbucket Pipelines", "boto3"],
    accent: "#10b981",
    story: {
      context:
        "Service deploys were a manual ritual: build the Docker image on a developer laptop, log into ECR through the AWS console, push, click through to ECS, force a redeploy, hope nothing breaks. Deploys took 20+ minutes per environment, the same image often shipped to dev and prod without re-validation, and accidental tag promotion (pushing the wrong build to prod) happened more than once.",
      challenge:
        "Build a delivery pipeline that takes a git branch, maps it to a target environment, bakes in environment-scoped secrets at build time, pushes the image to a per-env ECR repo, and rolls ECS Fargate tasks. Production must require an explicit human approval — never auto-promote from sandbox without a click.",
      approach:
        "Authored `ecr_deploy.sh` as the single source of truth for build-and-push, parameterized by environment. The script: (1) maps env name to a Bitbucket variable group, (2) validates required secrets exist and are non-empty, (3) builds a linux/amd64 Docker image with build-args for runtime config, (4) authenticates with ECR via short-lived password, (5) pushes :latest to the per-env ECR repo. After push, a Python boto3 helper (`fargate_cluster_update.py`) calls `ecs.update_service(forceNewDeployment=True)` — the ECS service pulls :latest and rotates tasks gracefully. Wired into Bitbucket Pipelines with branch mapping and a `changesets` filter so unrelated services don't rebuild.",
      approachDetails: [
        "Branch → environment mapping is explicit, not inferred: develop → dev, beta → beta, main → sandbox → manual approval gate → prod.",
        "Changesets filter (`changesets: { includePaths: [...] }`) means a pure-Streamlit change rebuilds only the Streamlit zip pipeline — not the API container.",
        "linux/amd64 build platform is explicit. Mac M-series defaults to arm64 which doesn't match Fargate's amd64 runtime; without `--platform linux/amd64`, the image fails to start.",
        "Secrets are baked at build time (--build-arg) for runtime config that doesn't change between deploys; truly secret values stay in Bitbucket repository variables and are read at deploy time, never committed.",
        "forceNewDeployment is required because pushing :latest doesn't change the ECS task definition — without it, ECS would keep running old tasks indefinitely.",
      ],
      architectureLead:
        "A push to a branch deterministically lands an image in the matching environment, with production gated behind a click that a human must take.",
      impact:
        "A push to `develop` reaches dev in under five minutes, fully hands-off. The manual prod gate has caught at least one accidental tag promotion. Multi-service repo behavior is correct: a Streamlit-only change doesn't waste CI minutes rebuilding the API container, and the API change in the same PR redeploys only the API service.",
    },
    workflowAscii: `
                  Branch → Environment mapping
   ┌─────────┐
   │ develop │ ──────────────────────────────▶  dev
   │ beta    │ ──────────────────────────────▶  beta
   │ main    │ ───▶ sandbox ──▶ [MANUAL] ───▶  prod
   └─────────┘                    gate

                          git push
                              │
                              ▼
              Bitbucket Pipelines (changeset filter)
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
       ecr_deploy.sh                  fargate_cluster_update.py
              │                               │
   ┌──────────┴──────────┐                    │
   │ resolve secrets     │                    │ boto3:
   │ validate vars       │                    │ ecs.update_service(
   │ docker build        │                    │   forceNewDeployment=True
   │   --platform        │                    │ )
   │   linux/amd64       │                    │
   │ push to ECR         │                    │
   └──────────┬──────────┘                    │
              ▼                               ▼
            ECR ◀────── service pulls :latest ─── ECS Fargate
                        rotates tasks
`,
    workflowSteps: [
      {
        label: "git push <branch>",
        detail:
          "Branch determines target environment, secret group, and ECR repo. The mapping lives in bitbucket-pipelines.yml — explicit, auditable.",
      },
      {
        label: "Pipeline triggered with changeset filter",
        detail:
          "Bitbucket Pipelines runs only the steps whose `changesets: includePaths` matches the diff. A doc-only commit triggers nothing; an API-only change rebuilds only the API.",
      },
      {
        label: "ecr_deploy.sh runs",
        detail:
          "Resolves env-specific secrets from Bitbucket variables, validates required vars are non-empty (fails fast on missing secrets), authenticates with ECR via aws ecr get-login-password, then `docker build --platform linux/amd64`.",
      },
      {
        label: "Push to ECR",
        detail:
          "Image tagged as <repo>:latest and pushed to the per-env ECR repository. ECR's image scanner runs in the background.",
      },
      {
        label: "Force ECS redeploy",
        detail:
          "fargate_cluster_update.py calls ecs.update_service(forceNewDeployment=True). ECS pulls the new :latest, starts fresh tasks, and gracefully drains the old ones via the configured deployment policy.",
      },
      {
        label: "Manual prod gate (main branch only)",
        detail:
          "After sandbox deploys cleanly, the prod step is queued but doesn't run — it requires a human to click 'Run' in the Bitbucket UI. This has caught accidental promotions more than once.",
      },
    ],
    engineeringNotes: [
      {
        title: "Why force-new-deployment, not a tag bump",
        body: "Bumping to a unique tag (e.g., :git-sha) and updating the ECS task definition would also work, but requires a task-def rev per deploy and additional plumbing. Pushing :latest + forceNewDeployment is simpler and cheaper, and ECS's deployment policy handles drain/replace correctly.",
      },
      {
        title: "Why explicit linux/amd64",
        body: "Fargate runs on amd64. Without `--platform linux/amd64`, a build on Mac M-series produces an arm64 image. The image pushes successfully (ECR doesn't care), then fails to start in Fargate with 'exec format error'. Explicit platform ensures the image and the runtime match.",
      },
      {
        title: "Why a manual prod gate, not auto-promote",
        body: "Sandbox passing doesn't mean prod is the right time to ship — there's an investor demo running, on-call just changed, customer escalation in flight. A human gate keeps deployment control with someone who knows what's happening operationally, while sandbox deployment stays auto and frictionless for testing.",
      },
      {
        title: "Why changeset filtering",
        body: "Without changeset filters, every push to main would rebuild every container in the monorepo. With six services, that's six redundant builds for what's often a one-service change. `changesets: { includePaths }` reads the git diff and skips steps whose paths weren't touched.",
      },
    ],
    codeSnippets: [
      {
        title: "Branch → environment mapping (bitbucket-pipelines.yml)",
        language: "yaml",
        code: `pipelines:
  branches:
    develop:
      - step:
          name: Deploy to dev
          if: { changesets: { includePaths: ["api/**"] } }
          services: [docker]
          script:
            - ./deploy/ecr_deploy.sh dev
            - python3 deploy/fargate_cluster_update.py dev

    main:
      - step:
          name: Deploy to sandbox
          script: [ "./deploy/ecr_deploy.sh sandbox",
                    "python3 deploy/fargate_cluster_update.py sandbox" ]
      - step:
          name: Approve prod
          trigger: manual                       # human gate
          script: [ "echo Sandbox OK, awaiting approval" ]
      - step:
          name: Deploy to prod
          script: [ "./deploy/ecr_deploy.sh prod",
                    "python3 deploy/fargate_cluster_update.py prod" ]`,
      },
      {
        title: "Force ECS Fargate to pull the new image",
        language: "python",
        code: `import sys, boto3

env = sys.argv[1]                                # dev | beta | sandbox | prod
cluster = f"app-cluster-{env}"
service = f"app-service-{env}"

ecs = boto3.client("ecs", region_name="ap-south-1")
resp = ecs.update_service(
    cluster=cluster,
    service=service,
    forceNewDeployment=True,                     # pulls :latest, rotates tasks
)
deployment = resp["service"]["deployments"][0]
print(f"Redeploy started: {deployment['id']} "
      f"(rollout={deployment['rolloutState']})")`,
      },
      {
        title: "Multi-arch build with secret validation",
        language: "bash",
        code: `#!/usr/bin/env bash
# ecr_deploy.sh — builds and pushes per environment
set -euo pipefail

env="$1"                                          # dev | beta | sandbox | prod
case "$env" in
  dev)     repo="api-dev"     ;;
  beta)    repo="api-beta"    ;;
  sandbox) repo="api-sandbox" ;;
  prod)    repo="api"         ;;
  *) echo "unknown env: $env"; exit 2 ;;
esac

# Validate required env-specific secrets are set
for v in DB_HOST OPENAI_API_KEY OTEL_EXPORTER_OTLP_ENDPOINT; do
  k="\${env^^}_$v"                                # e.g. DEV_DB_HOST
  : "\${!k:?missing required secret: $k}"
done

# Authenticate with ECR
aws ecr get-login-password --region ap-south-1 \\
  | docker login --username AWS --password-stdin \\
    "$AWS_ACCOUNT.dkr.ecr.ap-south-1.amazonaws.com"

docker build \\
  --platform linux/amd64 \\
  --build-arg "DB_HOST=\${!env^^}_DB_HOST" \\
  -t "$repo:latest" .

docker tag "$repo:latest" "$AWS_ACCOUNT.dkr.ecr.ap-south-1.amazonaws.com/$repo:latest"
docker push "$AWS_ACCOUNT.dkr.ecr.ap-south-1.amazonaws.com/$repo:latest"`,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "cloud-resume",
    diagramImage: "/images/diagrams/cloud-resume.png",
    title: "Cloud Resume",
    highlightWord: "Cloud",
    subtitle:
      "Serverless portfolio site with visitor counter — this site, in fact",
    tags: ["S3", "CloudFront", "Lambda", "API Gateway", "DynamoDB", "GitHub Actions"],
    accent: "#06b6d4",
    githubUrl: "https://github.com/0NikhilSingh5/aws-cloud-resume",
    story: {
      context:
        "Forrest Brazeal's Cloud Resume Challenge — host a personal resume entirely on AWS using only serverless services, with end-to-end CI/CD and a real visitor counter that survives deploys. I used the project as my own AWS scratchpad: every service in the stack got touched, and every deployment edge case got hit.",
      challenge:
        "Static frontend on S3 + CloudFront with HTTPS via ACM. Serverless visitor counter (Lambda + DynamoDB + API Gateway) that can't lose count under concurrent load. Push-to-deploy via GitHub Actions, including a CloudFront invalidation so visitors see the new content immediately.",
      approach:
        "Built the frontend as a Next.js app with `output: 'export'` so the entire site is static HTML/JS/CSS — no Lambda@Edge, no SSR runtime. Origin is an S3 bucket; CloudFront sits in front with an ACM-issued cert for HTTPS and route-53 resolving resume.codenickk.com. Visitor counter is a Python Lambda that increments an atomic counter in DynamoDB using a single UpdateItem call with `ADD :one` — no read-modify-write, so concurrent traffic can't double-count or skip. CI: a push to master triggers `aws s3 sync --delete` then `aws cloudfront create-invalidation /*`.",
      approachDetails: [
        "Static export means every URL is a real HTML file in S3. No cold start, no compute charges, no version-skew between server and client.",
        "DynamoDB UpdateItem with `ADD :one` is atomic — DynamoDB's API guarantees no read-modify-write race even under thousands of concurrent visitors.",
        "ACM cert is issued via DNS validation — auto-renews indefinitely with no manual touch.",
        "CloudFront invalidation is `/*` because the entire site is small. For larger sites you'd be more selective to stay within the 1000 free invalidations/month.",
        "S3 bucket policy restricts access to the CloudFront origin access identity only — direct S3 URL access is blocked.",
      ],
      architectureLead:
        "The site is two independent paths: the static-content path (S3 → CloudFront → browser) and the API path (browser → API Gateway → Lambda → DynamoDB). Neither blocks the other.",
      impact:
        "Live at resume.codenickk.com with sub-second loads worldwide via CloudFront's edge. Visitor counter persists across deploys. Every commit to master auto-deploys without me touching anything. The site you're reading right now is the project.",
    },
    workflowAscii: `
   git push master
        │
        ▼
   GitHub Actions (deploy.yml)
        │
        ├──▶  npm ci ──▶ next build ──▶ web/out/
        │                                  │
        ├──▶  aws s3 sync web/out/  ───────┘
        │           │
        │           ▼
        │         S3 bucket ──▶ CloudFront ──▶ ACM cert ──▶ Visitors
        │                          │             (HTTPS)
        │                          ▼
        └──▶  aws cloudfront create-invalidation /*

   Visitor counter (separate path)

        Browser  ──▶  API Gateway  ──▶  Lambda  ──▶  DynamoDB
                                                     UpdateItem
                                                     ADD visits :one
                                                     (atomic)
`,
    workflowSteps: [
      {
        label: "git push master",
        detail:
          "GitHub Actions workflow `deploy.yml` triggers automatically on push to the master branch.",
      },
      {
        label: "npm ci + next build",
        detail:
          "Action sets up Node 22, installs locked dependencies via `npm ci`, then runs `next build` which produces a static export in `web/out/`.",
      },
      {
        label: "aws s3 sync --delete",
        detail:
          "Static output synced to the S3 bucket. The --delete flag removes any S3 objects no longer present in the build, so old artifacts don't accumulate.",
      },
      {
        label: "CloudFront invalidation",
        detail:
          "An invalidation is issued for /* so CloudFront edge caches purge their copy of every object. Visitors see the new content within ~30 seconds.",
      },
      {
        label: "Visitor counter on page load",
        detail:
          "On every page load the browser fetches /visits from API Gateway. The Lambda calls DynamoDB's UpdateItem with `ADD visits :one` — an atomic increment that's safe under any concurrency. The new total comes back and renders in the top-right toolbar.",
      },
    ],
    engineeringNotes: [
      {
        title: "Why DynamoDB ADD over GetItem then UpdateItem",
        body: "ADD performs the increment server-side as an atomic operation — no read-modify-write race. Two concurrent visitors arriving in the same millisecond both get correctly counted. A naive GetItem-then-PutItem implementation would lose updates under any real concurrency.",
      },
      {
        title: "Why static export, not Next.js server",
        body: "A portfolio site has no per-user logic, no auth, no dynamic data. Every page is the same for every visitor. Static export means every URL is a real S3 object served from a CloudFront edge — no cold starts, no compute bill, sub-second TTFB worldwide.",
      },
      {
        title: "Why CloudFront invalidation /* (not selective)",
        body: "The site is a few hundred KB. A blanket /* invalidation is simple and well within the 1000 free invalidations/month. For larger sites you'd invalidate only changed paths to stay free-tier; for this size, simplicity wins.",
      },
      {
        title: "Why API Gateway in front of Lambda, not Lambda Function URL",
        body: "Function URLs work too, but API Gateway gives easy CORS configuration, request validation, throttling, and a custom domain — features that make the visitor-counter endpoint feel like a proper API, not a one-off shortcut.",
      },
    ],
    codeSnippets: [
      {
        title: "Visitor counter Lambda (atomic DynamoDB increment)",
        language: "python",
        code: `import json, boto3

ddb = boto3.resource("dynamodb")
table = ddb.Table("visitor-count")

def lambda_handler(_event, _ctx):
    res = table.update_item(
        Key={"id": "site"},
        UpdateExpression="ADD visits :one",
        ExpressionAttributeValues={":one": 1},
        ReturnValues="UPDATED_NEW",
    )
    visits = int(res["Attributes"]["visits"])
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        "body": json.dumps({"visits": visits}),
    }`,
      },
      {
        title: "GitHub Actions deploy workflow (excerpt)",
        language: "yaml",
        code: `- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'
    cache: 'npm'
    cache-dependency-path: web/package-lock.json

- name: Build
  working-directory: web
  run: npm ci && npm run build

- name: Sync to S3
  run: aws s3 sync web/out/ s3://nikhilsresumebucket --delete

- name: Invalidate CloudFront
  run: |
    aws cloudfront create-invalidation \\
      --distribution-id E1PNSO5QUYT69 \\
      --paths "/*"`,
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "acumatica-cicd",
    diagramImage: "/images/diagrams/acumatica-cicd.png",
    title: "Acumatica CI/CD",
    highlightWord: "Acumatica",
    subtitle:
      "Jenkins automation for Acumatica ERP customization deployments with auto-rollback",
    tags: ["Jenkins", "Groovy", "PowerShell", "Python", "REST APIs"],
    accent: "#a855f7",
    githubUrl: "https://github.com/0NikhilSingh5/acumatica_autoamted_build_publish",
    story: {
      context:
        "Acumatica ERP customizations were deployed entirely by hand: open the ERP admin portal, upload the customization package, click publish, click confirm, watch logs, hope nothing breaks. Rolling back was even more painful — re-upload an older package by hand. A typical deploy took 30 minutes per environment, and humans regularly fat-fingered package versions, env selections, or skipped the backup step.",
      challenge:
        "Build a Jenkins pipeline that picks up customization source from version control, packages it via MSBuild, takes a pre-deployment backup of the current state, deploys via Acumatica's REST APIs, runs a post-deploy health check, and automatically rolls back on health-check failure.",
      approach:
        "Authored a Jenkinsfile (declarative pipeline, Groovy) orchestrating the full flow: source checkout → MSBuild → snapshot existing customization via Acumatica REST → REST upload + import + publish via PowerShell → post-deploy probe → automatic restore from snapshot if the probe fails. Credentials are stored in Jenkins's credential store and injected as masked env vars at runtime — never in config files, never in version control.",
      approachDetails: [
        "MSBuild package step compiles the customization project and produces a versioned .zip — output filename includes the git short SHA so you can trace any deployed package back to source.",
        "Backup is via Acumatica's exportCustomization REST endpoint — creates a snapshot of the currently-deployed customization that can be re-uploaded as-is.",
        "Deploy is upload → import → publish, three REST calls in sequence. Each call validates Acumatica's response status before proceeding.",
        "Post-deploy probe hits a known-good ERP endpoint (login + a representative read query). If the response is non-200 or takes longer than the budgeted timeout, the pipeline declares failure.",
        "Automatic rollback re-uploads the backup .zip taken in step 3 and republishes — restores the exact pre-deploy state.",
      ],
      architectureLead:
        "Every deploy produces a recoverable snapshot before it changes anything. If the new package breaks the post-deploy probe, the snapshot is restored automatically and the pipeline reports failure.",
      impact:
        "Deployments dropped from ~30 min manual to under 5 min hands-off. Rollback is automatic and exercised on every release that fails the probe — the recovery path is no longer untested. Zero manual config-file edits; zero accidental cross-environment package uploads.",
    },
    workflowAscii: `
   Jenkins job triggered (manual or webhook)
              │
              ▼
       Source checkout (git)
              │
              ▼
       MSBuild package ────▶ <project>-<sha>.zip
              │
              ▼
       Backup current customization (Acumatica REST)
              │                    │
              │                    ▼
              │              snapshot.zip (kept on Jenkins agent)
              │
              ▼
       Upload + import + publish (Acumatica REST, PowerShell)
              │
              ▼
       Post-deploy health check
              │
        ┌─────┴─────┐
        ▼           ▼
       PASS        FAIL
        │           │
        ▼           ▼
       Done    Restore snapshot
                automatically
                (re-upload + publish)
                    │
                    ▼
                Pipeline → red
`,
    workflowSteps: [
      {
        label: "Job triggered",
        detail:
          "Manual run from the Jenkins UI or webhook from the customization source repo (push or merge).",
      },
      {
        label: "Build the package",
        detail:
          "MSBuild compiles the customization project and produces a versioned .zip — filename includes the git short SHA so deployed packages are always traceable to source.",
      },
      {
        label: "Snapshot the live customization",
        detail:
          "Acumatica's exportCustomization REST endpoint produces a .zip snapshot of the currently-deployed customization. Stored on the Jenkins agent for the duration of the pipeline.",
      },
      {
        label: "Deploy: upload → import → publish",
        detail:
          "Three sequential REST calls, scripted in PowerShell. Each call validates the response status; any failure halts the pipeline before publishing.",
      },
      {
        label: "Probe post-deploy health",
        detail:
          "Hit a representative ERP endpoint (login + a known-good read). If response is non-200 or exceeds the timeout, declare failure.",
      },
      {
        label: "Rollback or done",
        detail:
          "On probe pass, the pipeline goes green and the snapshot is discarded. On probe fail, the snapshot is re-uploaded and republished automatically — the system is restored to its pre-deploy state.",
      },
    ],
    engineeringNotes: [
      {
        title: "Why Acumatica's REST API, not UI automation",
        body: "UI scripting (Selenium against the Acumatica admin) was the prior path — and it broke on every Acumatica UI tweak. The REST API is contract-stable: as long as Acumatica's documented endpoints exist, the pipeline works. UI scripts are brittle by definition.",
      },
      {
        title: "Why pre-deploy snapshots, not just version control",
        body: "Source control has the old code, but a deployed Acumatica customization includes generated bindings, screen IDs, and project state that aren't fully reproducible from source. A REST snapshot captures the runtime state exactly — restoring from snapshot is byte-equivalent to the pre-deploy state.",
      },
      {
        title: "Why automatic rollback on probe failure",
        body: "The most expensive error is 'deploy succeeded, system is broken, no one notices for 20 minutes'. An automatic rollback on probe failure means broken deploys self-revert in seconds — the worst case is a red pipeline, not a broken production ERP.",
      },
      {
        title: "Why Jenkins credential store, not config files",
        body: "Acumatica admin credentials must never live in a build artifact or version control. Jenkins's credential store injects them as masked env vars at job runtime — they exist only inside the running pipeline, masked in logs, gone when the job finishes.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  {
    slug: "rds-performance-monitor",
    diagramImage: "/images/diagrams/rds-performance-monitor.png",
    title: "RDS Performance Monitor",
    highlightWord: "Performance",
    subtitle:
      "CloudWatch + Performance Insights driven slow-query digests with dynamic log toggle",
    tags: ["AWS Lambda", "CloudWatch", "Performance Insights", "RDS", "SES"],
    accent: "#ec4899",
    githubUrl: "https://github.com/0NikhilSingh5/aws-rds-kpi-monitor",
    story: {
      context:
        "Application teams were noticing intermittent latency spikes; CloudWatch had the raw RDS metrics but nobody was looking at them, and slow queries were buried in MySQL slow-query logs that engineers had to SSH into the RDS instance and grep through. Mean time to identify which query caused last week's outage: hours.",
      challenge:
        "Build a serverless monitor that watches RDS CPU, connection, and I/O metrics, surfaces top slow queries to engineers in real time, and emails a digest of the worst offenders — without requiring anyone to log into the RDS console or SSH into a host.",
      approach:
        "AWS Lambda runs on a CloudWatch Events schedule. On each tick it queries RDS Performance Insights for top-N slow queries by total execution time, joins those against CloudWatch CPU + connection-count metrics for the same window, and applies threshold logic. If thresholds breach, the Lambda builds an HTML digest and emails it via Amazon SES to the on-call distribution list. The Lambda also has authority to flip the slow-query log on or off via the RDS parameter group — useful when a regression is in flight and engineers want more detail temporarily without paying the storage cost permanently.",
      approachDetails: [
        "Performance Insights API returns structured top-SQL results — execution count, average latency, total wait time, plan hint. No log parsing required.",
        "Threshold logic uses percentile-based comparison (p95 of last 24h) rather than absolute values — reduces false positives during legitimate spikes like morning ETL.",
        "Digest is HTML-formatted via SES so engineers see formatted top-N tables in their inbox, not a JSON blob.",
        "Dynamic slow-query log toggle: when CPU breaches threshold, the Lambda calls ModifyDBParameterGroup with slow_query_log=1 for the next monitoring window, then disables it on the following tick. Avoids permanent log storage.",
        "All Lambda IAM permissions are scoped down to specific RDS instance ARNs and a single SES sender identity — least-privilege, auditable.",
      ],
      architectureLead:
        "A scheduled Lambda fans out to two metric sources, applies threshold logic, builds a digest, and pages humans via email. No persistent infrastructure beyond the Lambda itself.",
      impact:
        "Engineers see slow-query offenders within minutes of a regression instead of finding out from a customer ticket. Mean time to identify a regression dropped from hours to single-digit minutes. Memory and I/O optimization moved from reactive (after the customer complains) to proactive (we already have the digest).",
    },
    workflowAscii: `
   CloudWatch event ─cron schedule─▶ Lambda
                                       │
                  ┌────────────────────┼────────────────────┐
                  ▼                    ▼                    ▼
         Performance Insights    CloudWatch metrics    RDS parameter
         API: top SQL by        (CPU, conns, IOPS)    group
         total exec time              │                    │
                  │                    │                    │
                  └──────────┬─────────┘                    │
                             ▼                              │
                    Threshold check                         │
                    (percentile-based)                      │
                             │                              │
                       ┌─────┴─────┐                        │
                       ▼           ▼                        │
                      OK         BREACH                     │
                       │           │                        │
                       ▼           ▼                        │
                     Done    Build HTML digest              │
                                   │                        │
                                   ├──▶ Toggle slow_query_log=1
                                   │    (for next window) ──┘
                                   │
                                   ▼
                              SES email ──▶ on-call distribution
`,
    workflowSteps: [
      {
        label: "Scheduled tick",
        detail:
          "CloudWatch Events fires on a configurable schedule (every 5 / 15 / 60 min) and invokes the monitoring Lambda.",
      },
      {
        label: "Pull top SQL via Performance Insights",
        detail:
          "DescribeDimensionKeys on the db.sql.tokenized_id dimension returns the top-N slow queries by total execution time for the last window, with average latency, execution count, and plan info.",
      },
      {
        label: "Pull CloudWatch metrics",
        detail:
          "GetMetricData fetches CPUUtilization, DatabaseConnections, ReadIOPS, WriteIOPS for the same window — context for whether the slow queries are causing or being caused by load.",
      },
      {
        label: "Threshold evaluation",
        detail:
          "Percentile-based comparison against the last 24h baseline. A query that's slow because the DB is generally under load reads differently than a query that's pathologically slow on a quiet DB.",
      },
      {
        label: "Build digest, optionally enable slow log",
        detail:
          "If thresholds breach, build an HTML digest of the top offenders. Optionally call ModifyDBParameterGroup to enable slow_query_log for the next window — gives engineers more detail without paying log storage permanently.",
      },
      {
        label: "Email via SES",
        detail:
          "SendEmail with the formatted HTML body to the on-call distribution list. Engineers see structured top-N tables, not raw log blobs.",
      },
    ],
    engineeringNotes: [
      {
        title: "Why Performance Insights, not slow-query log parsing",
        body: "Performance Insights is structured: every entry has tokenized SQL, execution count, average latency, total wait time, plan hint. Slow-query log is unstructured text that requires regex parsing and is brittle to MySQL version differences. PI is the right interface for programmatic consumption.",
      },
      {
        title: "Why percentile-based thresholds, not absolute",
        body: "Absolute thresholds (e.g., 'alert if CPU > 80%') generate false positives during legitimate spikes like morning ETL or end-of-month batch jobs. Percentile-based thresholds (e.g., 'alert if p95 of last hour > p95 of last 24h * 2') catch genuine regressions and ignore expected spikes.",
      },
      {
        title: "Why dynamic slow-query log toggle",
        body: "Slow-query logging at full volume is expensive — log storage cost grows linearly with traffic. Toggling logging on for the next monitoring window only when a regression is in flight gives engineers the detail they need without committing to the permanent log-storage bill.",
      },
      {
        title: "Why SES email, not SNS or Slack webhook",
        body: "Engineers triage from email; the digest needs structured HTML (top-N tables, query text, latency stats). SES handles formatted HTML cleanly. SNS is short-text-only; Slack would work but adds an integration dependency for a reporting workflow that should survive infrastructure changes.",
      },
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectNeighbors(slug: string) {
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: idx > 0 ? projects[idx - 1] : undefined,
    next: idx < projects.length - 1 ? projects[idx + 1] : undefined,
  };
}
