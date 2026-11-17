# PR feedback coordination

Read this for hosted reviewers, bot summaries, inline threads or remote replies. Commands and identifiers come from the target project's forge documentation and selected tool; this reference does not prescribe one GitHub/GitLab mechanism.

When the project has a `review-pr-comments` skill, retain it as the owner of this phase and load its procedure. This reference is a coordination contract for missing details, not a replacement skill or a reason to repeat completed feedback processing. Keep `review-branch` separately responsible for branch assessment.

## Start and observe the selected review

- Reuse the existing task PR when it targets the agreed base and branch. Record its identifier and current head before requesting review. A branch can contain a reviewable commit without the work being approved or ready to merge.
- Follow the configured draft/ready trigger and reviewer assignment procedure. Record the request/run identifier and revision. Do not request every available bot, reassign a reviewer already requested or mark ready merely to guess at a trigger.
- Use the selected tool's completion evidence. Pending, failed, skipped and budget-exhausted runs are distinct from a completed run with no findings. If no explicit completion signal exists, record what was observed and the limitation; elapsed time and silence do not prove completion.
- Use supported waiting/status tools or callbacks without tight repeated polling. Keep working on independent authorized work while a review is pending. A stalled required review needs a concrete blocker/fallback decision rather than an endless wait or silent bypass.

## Collect all feedback

Read inline review threads, top-level review bodies, summary comments and local reports included by the selected workflow. Paginate both the thread list and comments within a thread when the API paginates them. A summary comment can contain findings not represented as inline threads.

Keep source run/review/comment/thread identifiers, author, revision/range, file/line, text and resolved/outdated status. Split several claims in one comment into separate findings linked to the same source. Reconcile duplicates and earlier dispositions without losing provenance. Do not ignore an unresolved finding only because the main agent replied last.

Revalidate older findings against current code. An outdated thread can still describe a real defect; a resolved thread can have been resolved without a verified repair. Preserve human comments awaiting their response as an explicit remote state.

## Repairs, replies and resolutions

Code repairs and branch pushes follow the calling skill's agreed scope and automatic high/medium repair policy. Posting under the user's identity, publishing local OCR findings, requesting reviewers, dismissing reviews and resolving threads have separate meanings. Perform only the remote actions included in the selected authorized workflow; otherwise return drafted text/action references for the user. Existing authorization persists across resumed sessions unless revoked or limited.

After a successful repair and verification, a proposed fixed reply names the actual commit and concise behavior/test evidence. A disputed finding receives technical reasoning and evidence; a deferred one records what remains and the agreed follow-up. Never post "fixed" while a repair is incomplete or before the relevant push succeeds.

Resolve bot threads only when that action is authorized and their findings are actually addressed. Follow project rules for human threads; do not resolve or dismiss a human review merely because the implementation agent considers its reply sufficient. A locally recorded disposition does not assert remote resolution or reviewer approval.

If a push or remote action fails, preserve the successful actions and receipts, report the failure, and retry only the missing action when appropriate. Avoid reposting a successful comment or request after a restart. Keep merge authorization separate.

## Follow-up review

Record each repair's previous and new head, checks, reviewer requests and completion. For incremental review, retain unresolved findings from earlier ranges and the newly reviewed range. Do not call the whole branch reviewed if only its repair diff was assessed.

The report must distinguish: code locally fixed, verification passed, push succeeded, remote replies posted, threads resolved, review completed, human approval received and CI passed. Return the actual combination and any blocker; none of those states implies a merge or deployment.
