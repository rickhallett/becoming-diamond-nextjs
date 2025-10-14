Alright Kai — here’s a tight, end-to-end **project spec** for a **RAG-only** system (no fine-tuning) with **local** and **production** setups that run cleanly inside a Next.js repo. It’s opinionated, modular, and ready to implement.

# Project: Single-Source RAG for a 47-page Book

## 1) Goals & constraints

- **Goal:** Answer questions about a single self-improvement book with high factual fidelity and clear citations.
- **No fine-tuning.** Style comes from prompt scaffolding; facts come from retrieval.
- **Local**: fully offline capable using Ollama + Qdrant via Docker on M3 Max.
- **Prod**: managed vector DB + hosted LLMs for reliability, low latency, and scale.
- **Simplicity:** Keep everything in one Next.js repo; infra declared under `/infra`.

---

## 2) System architecture

### 2.1 Components

- **Next.js (App Router)**: UI, ingestion tools, API routes for ask/ingest/eval.
- **Embedding model**

  - Local: Ollama (`nomic-embed-text` or `bge-m3`).
  - Prod: OpenAI `text-embedding-3-large` (or `-small` if cost-sensitive) or Voyage (`voyage-3`).

- **Vector DB**

  - Local: Qdrant (Docker).
  - Prod: Qdrant Cloud **or** Supabase Postgres + pgvector (choose one).

- **Generator model**

  - Local: Ollama (Llama-3.1-8B / Mistral-7B).
  - Prod: OpenAI GPT-4o-mini / Claude 3.5 Sonnet (streaming).

- **Optional re-ranker** (prod): Cohere Rerank v3 or Voyage re-ranker to refine top-k.

### 2.2 Data flow (Ask)

1. User question → `/api/ask`
2. Embed query → vector search (top-k, MMR)
3. (Optional) Re-rank top-k → top-m
4. Build prompt: system guardrails + **strict context window** + citations
5. Generate streamed answer with **grounding + refusal if off-context**
6. Return answer + cited passages (page/chapter/anchors)

### 2.3 Data flow (Ingest)

1. Upload PDF → `/api/ingest` or CLI script
2. Extract text + metadata → clean → **chunk (≈800–1000 tokens, 12–18% overlap)**
3. Embed chunks → upsert to vector DB with `{bookId, chapter, pageStart, pageEnd, chunkId, hash}`
4. Idempotency via content hash; skip unchanged chunks

---

## 3) Repository layout

```
/app
  /(marketing)           # public pages
  /(playground)          # ask UI + retrieved chunk inspector
  /api
    /ask/route.ts        # RAG endpoint (streaming)
    /ingest/route.ts     # optional HTTP ingest (auth-gated)
    /eval/route.ts       # batch eval runner (auth-gated)
/components
/lib
  /rag
    chunk.ts             # PDF → clean text → chunks
    embed.ts             # embeddings (local/prod provider switch)
    store.ts             # vector store (qdrant | pgvector)
    retrieve.ts          # topK + MMR + optional re-rank
    synth.ts             # generator call (local/prod switch)
    guards.ts            # grounding checks, refusal rules
    prompt.ts            # system + answer template
  env.ts                 # zod-validated env
/scripts
  ingest_pdf.ts          # CLI ingestion
  build_eval_set.ts      # create/maintain eval Q/A set
  eval_run.ts            # nightly eval script
/infra
  docker-compose.yml     # local: ollama + qdrant (+ optional redis)
  qdrant.yaml
/prisma or /sql          # only if using pgvector
/README.md
```

---

## 4) Local environment

### 4.1 Docker services

```yaml
# /infra/docker-compose.yml
services:
  ollama:
    image: ollama/ollama:latest
    ports: ["11434:11434"]
    volumes: ["ollama:/root/.ollama"]
    environment:
      - OLLAMA_MAX_LOADED_MODELS=2

  qdrant:
    image: qdrant/qdrant:latest
    ports: ["6333:6333"]
    volumes: ["qdrant:/qdrant/storage"]

volumes:
  ollama: {}
  qdrant: {}
```

**Local models to pull**

```bash
ollama pull llama3.1:8b
ollama pull mistral:7b
ollama pull nomic-embed-text
# or: ollama pull bge-m3
```

### 4.2 Env (local)

```
# .env.local
NODE_ENV=development
RAG_PROVIDER=local
OLLAMA_URL=http://localhost:11434
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=     # empty local
BOOK_ID=diamond-book-v1
```

---

## 5) Production environment (two options)

### Option A — Vercel + Qdrant Cloud (recommended for pure vector workloads)

- **Next.js** on Vercel (Node runtime for `/api/ask`).
- **Qdrant Cloud**: collection `book__diamond_v1` (cosine; 768/1024 dim depending on embedding).
- **Embeddings**: OpenAI `text-embedding-3-large` (best recall) or `-small` (cheaper).
- **Generator**: OpenAI GPT-4o-mini **or** Anthropic Claude 3.5 Sonnet (both stream well).
- **Re-rank (optional)**: Cohere Rerank v3 on top 32 → keep 8.

### Option B — Supabase (Postgres + pgvector)

- Single control plane for auth, storage, SQL joins.
- Create table `documents` and `chunks` with `vector` columns, HNSW index.
- Slightly more tuning; great if you want analytics over chunks/users.

### 5.1 Env (prod)

```
# .env.production
NODE_ENV=production
RAG_PROVIDER=cloud
QDRANT_URL=...
QDRANT_API_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...     # if using Claude
COHERE_API_KEY=...        # if using re-rank
BOOK_ID=diamond-book-v1
```

---

## 6) Chunking & retrieval

- **Extraction**: `unpdf` or `pdf-parse` → normalize whitespace, keep **page numbers**.
- **Chunk size**: **~800–1000 tokens**, **15% overlap** (compromise of recall & redundancy).
- **Metadata**: `{ bookId, chapter (heuristic), pageStart, pageEnd, chunkId, hash }`.
- **Indexing**: L2 or cosine depending on embedding model default.
- **Query flow**:

  - Embed query → **topK=24**
  - **MMR** (λ≈0.5) → diversify to **keep=10**
  - Optional **re-rank** to **m=6–8**

- **Context build**: cap **total tokens ~2500** for generator; favor coverage across chapters.

---

## 7) Prompting & grounding

**System message (core ideas):**

- “You answer strictly based on the provided book excerpts.”
- “If insufficient, say so and ask a focused follow-up.”
- “Cite each claim with `(Chapter/Page)` using provided metadata.”
- “Be concise, faithful, and practical; no speculation.”

**Answer template:**

- **Summary** (2–4 bullets)
- **Answer** (grounded narrative)
- **Citations**: list of `(ch X, pp Y–Z)` mapped to chunk metadata
- **If insufficient**: state missing info + suggest exact follow-up question.

**Hallucination guardrails:**

- Refuse if **retrieved context score < threshold** (e.g., avg top-m < 0.25 sim).
- Penalize generation if **no citations** inserted.
- Optionally run a **faithfulness check**: compute cosine sim between answer sentences and supporting chunks; if < τ, prepend disclaimer.

---

## 8) API contracts

### 8.1 `POST /api/ask`

**Request**

```json
{
  "question": "How does the book define 'identity-level change'?",
  "options": { "maxContext": 2500, "topK": 24, "keep": 8 }
}
```

**Response (SSE or streamed text)**

```json
{
  "answer": "…streamed…",
  "citations": [
    {
      "chunkId": "c_0123",
      "chapter": "3",
      "pageStart": 42,
      "pageEnd": 44,
      "score": 0.72
    }
  ]
}
```

### 8.2 `POST /api/ingest` (auth-gated; or use CLI)

**Request**

```json
{ "bookId": "diamond-book-v1", "pdfUrl": "...", "rebuild": false }
```

**Response**

```json
{ "status": "ok", "chunksInserted": 612, "skipped": 612 }
```

### 8.3 `POST /api/eval` (auth-gated)

Runs held-out Q/A set; returns metrics.

---

## 9) Data model

### Vector record (Qdrant payload)

```json
{
  "id": "c_000123",
  "vector": [ ... ],
  "payload": {
    "bookId": "diamond-book-v1",
    "chapter": "2",
    "pageStart": 15,
    "pageEnd": 17,
    "chunkId": "c_000123",
    "hash": "sha256:...",
    "text": "chunk body…"
  }
}
```

(If pgvector, mirror this in `chunks` table, with `embedding vector(N)` and GIN/HNSW index.)

---

## 10) Evaluation

- **Eval set**: 80–120 Q/A pairs curated by you (coverage across chapters; difficulty mixes).
- **Metrics**:

  - **Answer quality**: LLM-as-judge with strict rubric (factuality 0–5, helpfulness 0–5, citation coverage %).
  - **Faithfulness**: cosine sim between sentences & supporting chunks (report mean/min).
  - **Latency**: total + stages (embed, search, rerank, generate).
  - **Cost**: per request tokenized.

- **Nightly run** (prod): `scripts/eval_run.ts` → outputs CSV + trend chart.

---

## 11) Observability & telemetry

- **Request log**: `question`, normalized hash, retrieved chunk IDs/scores, model used, latency per stage, token counts, final citations.
- **Playground UI**: show retrieved chunks + highlighting of overlaps with answer sentences.
- **Error handling**: graceful fallbacks (e.g., if reranker down, skip; if vector DB down, return a polite failure with retry-after).

---

## 12) Security

- **Auth** for ingestion & eval; public ask route with **rate limiting** (IP + user).
- **Content hashing** to prevent duplicate ingestion.
- **PII**: none expected; still scrub logs for user emails if later added.
- **Secrets**: all via env; no secrets in client bundles.

---

## 13) Performance & cost knobs

- **TopK/Keep/Re-rank** are tunable per request (defaults in server).
- **Embeddings**: `-small` vs `-large` flips cost/quality.
- **Caching**:

  - Cache embeddings for repeated queries (normalized).
  - Cache vector search results for identical queries (short TTL, e.g., 5–15 min).
  - Enable provider **prompt caching** where available (OpenAI/Anthropic).

- **Batching**: Batch embeddings during ingestion for throughput.

---

## 14) Implementation notes (key files)

- `/lib/rag/chunk.ts`

  - PDF → pages → heuristics for **chapter detection** (look for headings, ToC hints)
  - Clean: hyphenation fix, smart quotes, multiple spaces → single
  - Chunk to target tokens with overlap; attach page ranges

- `/lib/rag/embed.ts`

  - Local: POST to Ollama `/api/embeddings`
  - Prod: OpenAI `/v1/embeddings` (model switch via env)
  - Return `{ vector: number[], dim, model }`

- `/lib/rag/store.ts`

  - Qdrant adapter: upsert, query (topK with payload), MMR utility
  - (Alt) pgvector adapter with SQL for ANN (HNSW/IVFFlat) and rescoring

- `/lib/rag/retrieve.ts`

  - Embed query → search topK → MMR diversify → optional re-rank → return list

- `/lib/rag/synth.ts`

  - Build system + user prompt with **strict instructions** and citations scaffold
  - Call local Ollama (dev) or OpenAI/Anthropic (prod), stream via Web Streams API

- `/lib/rag/guards.ts`

  - If average sim < threshold or no citations → add disclaimer or ask follow-up
  - Strip any content not justified by citations

- `/app/(playground)`

  - Question input, streamed answer view, retrieved chunk list with scores & page links

---

## 15) CLI workflows

**Ingest**

```bash
pnpm tsx scripts/ingest_pdf.ts --pdf ./books/book.pdf --bookId diamond-book-v1
```

**Eval**

```bash
pnpm tsx scripts/eval_run.ts --bookId diamond-book-v1 --report ./reports/eval_YYYYMMDD.json
```

---

## 16) CI/CD

- **Checks**: typecheck, lint, unit tests for chunking & retrieval, e2e for `/api/ask`.
- **Preview deploys** on PRs (Vercel).
- **Secrets** via Vercel envs; block production deploy if eval score drops > X%.

---

## 17) Rollout plan

1. **Local**: stand up Docker services; run ingest; verify playground.
2. **Prod**: create Qdrant Cloud collection; set env; deploy Next.js to Vercel.
3. **Eval**: run baseline; tune topK/keep/overlap; re-run until stable.
4. **UX polish**: citations with page anchors, copy-to-clipboard answers, “show sources” toggle.
5. **Observability**: dashboards for latency, costs, eval trends.

---

## 18) Defaults (you can copy these)

- Chunk size **950 tokens**, overlap **15%**.
- Retrieval: **topK 24 → MMR keep 10 → re-rank keep 6**.
- Embeddings (prod): **`text-embedding-3-large`** (OpenAI).
- Generator (prod): **GPT-4o-mini**, temperature **0.2**, max tokens **600–900**.
- Refusal threshold: **avg sim < 0.25** or **<2 supporting chunks**.

---
