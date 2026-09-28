# AI Does Not Eliminate Engineering; It Forces Engineering to Become More Explicit

If you use AI to build software, you may already recognize one of its most attractive promises: **“tell it what you want, and it will build it.”**

And, in one sense, that promise is becoming real: an agent can read your repository, propose an approach, write code, run tests, fix errors, and prepare a deliverable very quickly.

The problem comes next: **producing a result is not the same as demonstrating that the result is acceptable**.

Engineers already know that distance well. An electrical installation is not accepted because the contractor says, “finished”; a system is not released because it looks complete; critical equipment does not enter service because someone says it works. We compare the result with drawings, specifications, acceptance criteria, tests, observations, and evidence.

AI does not remove that logic; it makes it more important, because the faster we can produce a first version, the more important it becomes to define **what it means for that version to be correct**.

## A first delivery is not technical acceptance

This was one of the first lessons I carried from traditional engineering into AI-assisted software work.

In an industrial project, a vendor can deliver a panel, calculation report, drawing, or equipment package that looks perfectly reasonable and still contains a deviation. That is why technical review exists: the deliverable is compared with what was actually required.

AI-generated software deserves the same distinction: the code may compile, existing tests may pass, and the interface may look right. The agent may even report that every item in its plan is complete; even so, we may still have the wrong problem solved beautifully.

[GitHub](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code) makes this explicit in its own guidance for reviewing AI-generated code: automated tests and static analysis come first; reviewers should then check whether the change matches the project’s purpose, requirements, architecture, and design patterns. The question is not only whether the code runs, but whether it solves the right problem under the right constraints.

That gives me a useful distinction: **generation produces a proposal; acceptance demonstrates that the proposal meets a criterion**. The second part is still engineering.

## AI moves the bottleneck toward definition

When writing code was the most expensive part of the process, it made sense for implementation to consume much of our attention; that relationship is changing.

If an agent can produce in minutes what once took hours, the main question is no longer only “How do I implement this?”; other questions become more important:

- What problem are we actually solving?
- Which behavior must remain unchanged?
- Which constraints cannot be violated?
- Which risks matter?
- What evidence would prove the change is complete?
- Which deviations are acceptable, and which are not?

In other words, **AI can make execution cheaper while making ambiguity more expensive**.

A vague instruction can quickly become a large amount of code, a wide diff, and an even larger review problem; speed amplifies a good definition, but it also amplifies a bad one.

The [2025 DORA report](https://dora.dev/research/2025/dora-report/) on AI-assisted software development reaches a similar idea from an organizational perspective: it describes AI primarily as an **amplifier** of the strengths and weaknesses already present in a team and its system.

[Google Cloud’s summary](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) reports that 90% of surveyed technology professionals use AI at work; more than 80% report productivity gains; at the same time, 30% report little or no trust in AI-generated code.

Those are survey results, not a universal law of productivity; still, the combination is useful: **using more AI and trusting it blindly are not the same thing**.

## When the specification becomes part of the system

In engineering, a useful specification is not documentation for its own sake; it reduces incompatible interpretations.

[NASA’s *Systems Engineering Handbook*](https://www.nasa.gov/reference/system-engineering-handbook-appendix/), for example, includes guidance on writing requirements and on defining how those requirements will later be verified; its verification matrix connects each requirement with the method used to demonstrate compliance.

That idea becomes especially useful when agents are doing more of the implementation. It is not enough to say:

> Implement this feature.

The system becomes much easier to direct when it also knows:

- the objective.
- the scope.
- the constraints.
- the interfaces that must not break.
- the acceptance criteria.
- the expected tests.
- the risks that require review.
- what is explicitly out of scope.

This does not mean turning every task into a fifty-page specification; it means making visible whatever would otherwise force the model to guess. And the more autonomous the agent becomes, the less I want important decisions to depend on guesses.

That is why I increasingly see a specification as more than the instruction that starts the work: it can become an **interface between intent and execution**. It can guide implementation, inform tests, and give the audit a stable reference point afterward.

## My workflow looks more like a punch list than a prompt

The analogy that has helped me most comes from inspection and quality control.

When an industrial project is approaching completion, the review is not a conversation about whether the contractor feels confident: we inspect the deliverable, and deviations become specific findings. Those findings enter a punch list; they are then corrected, checked again, and eventually closed.

My AI workflow gradually started to look much more like that:

```text
plan
→ implement with AI
→ audit
→ turn deviations into findings
→ correct
→ verify again
→ accept
```

The value is that every stage leaves evidence. Planning makes the expected result explicit; implementation produces the change; audit compares reality with intent. Findings turn “something feels wrong” into verifiable issues; correction responds to those issues; re-audit checks that we did not merely change things, but actually closed what was pending.

This also explains why using another model as a reviewer can help without solving governance by itself. One model can implement; another can audit; we can even use evaluation-and-refinement loops such as [Anthropic’s *evaluator-optimizer* pattern](https://www.anthropic.com/engineering/building-effective-agents), where one output is evaluated against clear criteria and iterated. But then someone still has to define those criteria and decide when the evidence is sufficient.

## Technical authority does not disappear; it moves

This is the shift I find most important: if AI writes a growing share of the code, human value does not disappear; it moves.

Previously, a large part of the work involved producing each line, calculation, document, or procedure directly; we can now delegate more execution. That frees time, but it also exposes another kind of responsibility: **define, constrain, verify, and accept**.

Someone still has to decide what should be built, what level of risk is acceptable, which architecture should be preserved, which information is trustworthy, which exception needs judgment, and which result can move into production.

[NIST](https://airc.nist.gov/) uses **TEVV—testing, evaluation, verification, and validation—** as a central part of its approach to managing AI risk. The lesson is not that every generative output should be distrusted, but something more practical: when a claim or behavior can be checked, design the check instead of replacing it with confidence.

This connects directly with a question I explored later in [Do We Really Need Another AI Agent—or Should the System Know This Already?](/articles/en/do-we-really-need-another-agent/). Once a decision becomes stable, repeatable, and objectively verifiable, some of that knowledge can move out of conversations and into rules, tests, and deterministic software.

AI can help us get there; technical acceptance, however, needs a reference point that exists outside the model’s own answer.

## Engineering becomes more explicit because implicit knowledge scales poorly

When you work alone, many decisions can live comfortably in your head: you know which part of the system you do not want to touch, and you remember why a strange rule exists. You also recognize which exception matters; you can often tell when a solution “works” while violating the architecture.

An agent does not automatically share that history; if the decision matters, it needs to leave your head and become context, a rule, a test, a contract, an example, or an acceptance criterion.

That can feel like additional work at first, but it creates something valuable: **knowledge stops depending exclusively on one person’s memory or one conversation**.

That is also why my approach to [working better with AI](/articles/en/working-with-ai/) has moved away from the search for the “perfect prompt.” As the task becomes more complex, the challenge is no longer finding one brilliant sentence; instead, it becomes providing enough context and enough controls for the work to move quickly without losing intent.

A specification does not eliminate judgment; it makes judgment visible. A test does not eliminate creativity; it defines what we do not want to break. An audit does not necessarily slow AI down; it prevents us from confusing speed with closure.

## So what should become explicit?

There is no universal template; but, before I delegate an important task to an agent, I try to answer at least five questions:

- **What result do we want?** Not only which file should change, but which behavior should exist afterward.
- **Which constraints matter?** Architecture, security, data, compatibility, scope, cost, or any other real boundary.
- **How will we know it complies?** Tests, observable criteria, comparisons, validators, or human review.
- **What evidence should remain?** Logs, tests, diffs, reports, artifacts, or another trail that makes the work auditable.
- **Who accepts the result?** An agent can declare its task complete; that does not mean the system should declare the result accepted.

The difference seems small, but it changes the conversation we have with AI: we are no longer asking only **“Can you do this?”**; we are defining **“This is what doing it well means.”**

## Speed does not remove responsibility

AI can compress the time between an idea and a first implementation dramatically; that is valuable, and I see no reason to give up that advantage.

But the faster execution becomes, the more expensive an ambiguous objective can become. That is why I do not see engineering and AI as competing forces, but as a redistribution of work. The machine can take on more production, exploration, and repetition; the human can spend more attention on intent, architecture, risk, evidence, and acceptance.

**AI does not eliminate engineering; it makes visible the engineering decisions that once remained implicit: more explicit, more traceable, more verifiable.**

For me, that is one of the most interesting changes in AI-assisted work: we do not stop thinking like engineers; we have to express much more clearly what it means for something to be truly well built.

---

## References

- DORA, **State of AI-assisted Software Development 2025**: https://dora.dev/research/2025/dora-report/
- Google Cloud, **Announcing the 2025 DORA Report: State of AI-Assisted Software Development**: https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
- GitHub Docs, **Review AI-generated code**: https://docs.github.com/en/copilot/tutorials/review-ai-generated-code
- NASA, **Systems Engineering Handbook — Requirements Verification Matrix and Validation Plan**: https://www.nasa.gov/reference/system-engineering-handbook-appendix/
- NIST, **AI Risk Management Framework / AI Resource Center**: https://airc.nist.gov/
- Anthropic, **Building Effective AI Agents — evaluator-optimizer workflow**: https://www.anthropic.com/engineering/building-effective-agents