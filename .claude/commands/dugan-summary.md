# Daily Development Summary for Dugan

Generate a non-technical summary of today's development work for the product owner (Dugan), formatted for WhatsApp.

## Instructions

1. Check recent git commits from today using `git log --since="midnight" --oneline`
2. Review any invoices or feature docs created today in `docs/invoicing/` and `docs/2_architecture_and_specs/`
3. Summarize in plain English what was accomplished

## Output Format

Use this WhatsApp-friendly format:

```
Hey Dugan! Here's today's dev update:

[WHAT WAS DONE]
• [Item 1 - plain English, no tech jargon]
• [Item 2]
• [etc.]

[WHAT THIS MEANS FOR USERS]
• [User-facing impact 1]
• [User-facing impact 2]

[STATUS]
All changes are live on the site.

[BILLING]
[X] hours today ($XX.00)

Let me know if you have any questions!
```

## Guidelines

- No technical jargon (no "CSS", "grid", "API", etc.)
- Focus on what users will experience
- Keep it brief and scannable
- Friendly but professional tone
- Use simple bullet points
- Include billing summary if invoice exists for today
