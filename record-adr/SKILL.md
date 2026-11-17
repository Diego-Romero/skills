---
name: record-adr
description: Draft and save a concise architecture decision record for a decision the maintainer has already made. Use when asked to document an architectural choice, its rationale, and its consequences.
---

# Record an architecture decision

Turn a decision the maintainer has made into a record that a future contributor can understand without this conversation.

## Establish the decision

Identify what was decided, the problem or constraint that prompted it, and why the maintainer chose it. Use the conversation first. If the choice or rationale is missing, ask a focused question before drafting an accepted decision. Do not choose an architecture on the maintainer's behalf or invent reasons from the resulting code.

Read the repository's instructions and find its ADR directory, naming convention, template, and index. Read related decisions and enough code or documentation to ground the context and consequences. Distinguish a decision already accepted from implementation still pending. If an earlier ADR is being replaced, preserve its history and propose a supersession link.

## Draft the record

Follow the existing convention. If there is none, suggest `docs/decisions/` and the next available numbered filename with a short descriptive title. Use this small fallback structure:

```markdown
# <number>. <decision title>

Date: <decision date, if known>
Status: <accepted, or the repository's equivalent>

## Context
<The problem and constraints that explain the choice.>

## Decision
<What was chosen and where it applies.>

## Consequences
<What this enables, what it costs, and the obligations it creates.>
```

Use the decision date when known; do not imply that the draft date was the decision date. Include alternatives only when they explain the rationale. Link source files and related records where they help substantiate the decision. Keep implementation procedures in the relevant guide or task.

## Review and save

Show the draft and exact destination. Ask the maintainer to confirm the rationale and any tradeoffs inferred from repository evidence. Honor confirmation already supplied in the conversation; otherwise wait for review before saving the ADR.

After confirmation, save the record and update the existing index or supersession links if the repository uses them. Verify the links and report the saved path. Recording a decision does not authorize implementing it.
