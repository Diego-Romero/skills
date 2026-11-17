# Code review

## What it does

Runs Matt Pocock's independent Standards and Spec reviewers first, then the project's/user's configured review process. It collects and verifies findings, presents severity and proposed actions, and handles accepted repairs through verification and follow-up review. Matt's baseline uses pinned, unchanged local source references; it still runs when a project route is defined. If none is defined, no additional review stage is invented.

In the normal full lifecycle it creates/reuses the task PR and follows the project's reviewer triggers. Confirmed high/medium findings within approved scope are repaired, verified, committed and pushed by the main agent after it announces the batch. Reviewers stay read-only. Review-only requests return findings without automatically editing or publishing.

This is an authored draft with no live reviewer/PR repair run yet. It is not included in the plugin's shipping list.

## When to reach for it

Invoke it explicitly for a branch, PR or working-tree review, or let task-driver call it at implementation's existing review boundary. Use a project-defined OCR, hosted-bot or other review procedure when available. The skill discovers that procedure instead of forcing one tool/provider on every team.

## Common questions

**Does this replace review-branch and review-pr-comments?** No. Retain them as separate, directly invokable project skills. The coordinator uses review-branch for branch assessment and review-pr-comments for PR feedback, passing context and collecting results without repeating completed work. Supporting references supplement those skills rather than replace them.

**Does it run Matt and the project review?** Yes, in that order. The two stages are intentional. Run the selected project/user workflow after the baseline, not every available tool. If no additional workflow exists, Matt's review is sufficient. Avoid duplicate invocations within a stage, and retain each stage's actual coverage.

**Does it select a different model automatically?** No. Prefer a configured independent reviewer model/environment and record what actually ran. Fresh context and model diversity are different properties; unavailable or unobservable diversity is disclosed.

**Why commit before review?** Matt and many local tools review committed revisions. Create a reviewable local task commit for the baseline, handle its accepted findings, then push/create or reuse the PR for the project review. A local review-only request can use a complete immutable patch instead. Neither path authorizes merge.

**Does every finding get fixed?** Every finding gets an evidence-backed disposition. Confirmed high/medium in-scope defects are repaired automatically within the agreed lifecycle. Incorrect findings receive reasoning, advisory improvements do not expand scope automatically, and changes to scope or consequential design return to the user.

**Does it reply to reviewers or resolve threads?** Only within the selected authorized workflow. Otherwise it returns drafts. Code fixed, push succeeded, reply posted, thread resolved and human approval received are distinct states. See [PR feedback coordination](../code-review/references/pr-feedback.md).

**Where is the evidence?** In the task's artifact directory, normally `.plans/<TASK>/reviews/` in the main checkout. The driver owns progress/workflow events under the [ledger contract](../task-driver/references/ledger.md). Tokens/cost for hosted or unsupported tools remain unknown when actual runtime data is unavailable.

**What changed from Matt?** Reviewer routing, complete-target/PR preparation, authorization, findings triage, repair orchestration and measurements are our integration layer. The [process basis](../code-review/references/process-basis.md) identifies the adaptations and source hashes.

## It's working if

- It identifies the selected review procedure and actually completed review range rather than assuming a tool launch or silence means success.
- It includes all intended changes and passes usable spec/standards context to independent reviewers.
- It retains raw reports, source identities and a disposition for every finding.
- It verifies and pushes authorized high/medium repairs without repeated batch approvals, while surfacing scope/design decisions.
- It rechecks changed evidence and reports pending human, CI and reviewer requirements accurately.
- It records review/repair/wait measurements with honest usage/cost coverage and returns an evidence-backed status to its caller.
