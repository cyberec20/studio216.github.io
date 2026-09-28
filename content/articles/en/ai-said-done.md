# AI Said “Done”. The Product Had a Different Opinion

If you work with coding agents on your product, you probably recognize the scene; the hard part is avoiding one deceptively simple trap: visible progress can look like product acceptance. The terminal keeps moving while the agent opens files, analyzes the project, writes code, and runs tests. When it finds errors, it fixes them and moves to the next task. Sometimes it worked for ten minutes; other times, half an hour or more. I could watch for a while, step away, and return to find several files changed, new components created, and another phase marked complete. There was real evidence of progress.

It was difficult not to feel that I was watching the future; it was equally difficult not to think that the product was making enormous progress without constant intervention from me. Technically, it was progressing. What I had not yet learned was how to avoid confusing implementation speed with product closure.

The problem appeared when I opened the application.

I did not find a disaster; in fact, that would have been easier. There were screens, working flows, reasonable components, and green tests. The agent had not done a bad job: it had built a plausible interpretation of what I had asked for. Yet there was still a distance between **“the task is done”** and **“the feature is actually complete inside the product.”** The difference between those two statements changed the way I work with agents.

## “Done” is not a sufficient technical state

An agent can complete its plan, execute every expected step, and return a coherent result; it can even write tests that pass. None of that is useless. The problem begins when we mistake those signals for acceptance.

Engineering offers a distinction that is especially useful here. [NASA separates verification from validation](https://www.nasa.gov/reference/5-4-product-validation/): verification provides evidence that **the product was done right** against defined requirements, while validation asks whether **the right product was done** for the user’s expectations and intended operating environment.

AI-generated software has the same boundary. A test may prove that a function returns the expected value; another may confirm that an endpoint responds correctly. That matters, but a different question remains: **can the user complete the job they needed to complete, in the way the product was meant to support?**

That question rarely fits inside one green CI line.

This distinction deepens something I had already observed when moving [from an idea to a functional product](/articles/en/from-idea-to-functional-product/): a first implementation can be valuable without yet being an accepted product.

## The agent can close its interpretation, not necessarily your intent

In my case, the agent was not starting from a vague request. It had a PRD, documentation, project files, rules, and enough context to understand what we were building. The work was also divided into phases: read the specification, plan, implement, run tests, and mark tasks complete.

On paper, the process made sense; for a while, I trusted that context, planning, and tests would be enough to keep the product aligned.

They helped a great deal, but they did not cover everything.

Some parts of intent only become visible when the product is used. A document can define users, permissions, screens, actions, and rules; once someone walks through the flow, however, different questions appear. Should this action happen here or one step earlier? Will the user understand what to do next? Is the information sufficient? What happens outside the ideal case? Is the feature integrated with what came before or merely sitting beside it? Does it solve the complete problem or only its most obvious part?

A specification reduces ambiguity; use reveals the ambiguity that remains.

That is where I understood something important: **an agent can correctly close the interpretation it built from the available context and still not have reached the product’s full intent.**

## Green tests can be correct and still be insufficient

This does not mean tests have failed as a tool. It means a test can only verify what has been expressed as a verifiable condition.

[GitHub’s guidance for reviewing AI-generated code](https://docs.github.com/en/copilot/tutorials/review-ai-generated-code) recommends starting with automated tests and static analysis; it then asks reviewers to verify that the change fits the project’s purpose, requirements, and architecture. The sequence matters: first, verify that the code does what it claims to do; then, verify that this was actually what the product needed.

The risk becomes clearer when the same loop produces interpretation, implementation, and test. In that setting, the model may read a requirement, interpret it partially, build according to that reading, and then generate tests that prove **its own interpretation** works.

The circle can close perfectly and still be incomplete.

That is why I no longer treat a green test as a synonym for an accepted feature. I treat it as one piece of evidence inside a larger decision.

## The distance between “it works” and “it works as it should”

When I reviewed the product, the gaps were rarely dramatic. Some features reached a certain point and stopped; others covered the basic case but did not reach the depth the real workflow required. Some actions existed technically, yet still did not fit naturally into the full experience.

This class of problem is harder to detect precisely because **almost everything looks reasonable**.

A broken screen demands attention. A flow that works at 80% can survive several cycles before anyone notices what is missing.

That is where functional review becomes different from code review. I do not need to inspect every variable to discover that a user cannot complete a task. I need to open the feature, walk through it as a user, force less comfortable cases, and compare what happens with the original intent.

In another article, I explained why [AI Does Not Eliminate Engineering; It Forces Engineering to Become More Explicit](/articles/en/ai-does-not-eliminate-engineering/). This is the practical reverse side of that idea: the faster an agent can implement, the more important it becomes to decide **what evidence is sufficient to accept what it implemented**.

## Review too late and alignment debt begins to accumulate

The problem grows when several phases are allowed to accumulate before functional review.

Each incomplete feature may leave one or two open points; individually, they look small. The next feature then starts building on previous decisions that have not yet been fully validated. One screen depends on a partial workflow; a new module assumes an earlier rule is already settled; an integration hardens an interpretation we had not actually accepted.

The system keeps growing and, at the same time, the distance between what exists and what we intended keeps growing with it.

I think of that distance as **alignment debt**: not necessarily bad code, but new work built on an understanding that had not yet been validated deeply enough.

Technical debt usually describes implementation decisions that make future change more expensive; alignment debt is different. It can exist alongside clean code, good tests, and a reasonable architecture. Its source is elsewhere: **we kept moving before confirming that the direction was correct**.

Agent speed can amplify it. If a human takes two days to build on a questionable decision, there is more time for the mismatch to become visible. If it builds several layers in an afternoon, more distance can accumulate before the next checkpoint.

## The checkpoint changes where autonomy belongs

My response was not to remove autonomy from the agent; doing that would throw away one of its greatest advantages.

The change was practical, which meant separating two things more clearly: **autonomy to implement** and **authority to accept**.

Inside a feature, the agent can research, plan, write code, run tests, fix errors, and try again. Acceptance, however, does not happen automatically because the plan turned green; it happens when there is enough evidence that the feature behaves as it should inside the product.

In practice, the cycle looks more like this:

```text
intent
→ acceptance criteria
→ agent implementation
→ tests and validators
→ functional review
→ findings / punch list
→ correction
→ revalidation
→ acceptance
```

The important word is not “human” versus “AI”; it is **checkpoint**.

Some checkpoints can be deterministic: tests, schemas, contracts, type checking, linting, security rules, or non-regression checks. Others still require judgment: architecture, user experience, product coherence, ambiguous behavior, or side effects that are difficult to formalize.

OpenAI’s [practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/) recommends combining autonomy with guardrails and human intervention, particularly when failure thresholds are exceeded or actions are sensitive. For more mature workflows, its evaluation guidance also recommends examining traces, tool calls, handoffs, and end-to-end behavior rather than assuming that the final output tells the whole story. ([OpenAI — Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals))

That general principle matches my experience: **autonomy works better when the system knows where to stop and ask for evidence.**

## The human last mile does not mean coding by hand

For a long time, I thought supervising an agent meant reviewing the code it wrote. I now see the job differently.

My main intervention happens at the product level: open it, use it, compare it, exercise uncomfortable cases, and detect what is missing. When I find a gap, I do not need to say, “You programmed this function incorrectly.” I can describe the mismatch in terms of expected behavior. For example:

- this feature still does not let the user complete this action.

- when this condition occurs, the flow should continue this way.

- this information is still missing from the decision.

- this action exists, but it is not yet integrated with the rest of the process.

- these points must be closed before we move forward.

The agent can translate those findings into tasks, implement the corrections, and generate new tests; then the cycle begins again.

Human work is not necessarily writing the missing code. It is **recognizing that something is still missing**.

This matters particularly for domain experts. A person may not know every detail of a framework, yet still recognize an incomplete business rule or a workflow that violates the real operation. They can also detect when the product technically “works” in a way nobody would actually use.

## Acceptance needs evidence, not a final sentence

One of the most useful changes we can make when working with agents is to redefine what “done” means operationally.

Instead of accepting a declaration, we can require evidence proportional to the type of work. The core idea is simple: the greater the impact, the stronger the evidence should be. For example:

- **local change:** clear diff + specific test + no relevant regression.

- **feature:** acceptance criteria + tests + functional walkthrough.

- **integration:** interface, state, and failure validation across components.

- **sensitive change:** deterministic controls + human review + rollback path.

- **product feature:** correct behavior inside the complete user flow, not merely technical existence.

[NASA’s systems engineering guidance](https://www.nasa.gov/reference/system-engineering-handbook-appendix/) treats validation as a planned activity for demonstrating that a system satisfies user and stakeholder expectations. That logic is far more useful to me than treating “done” as an internal label produced by the agent.

The agent may declare that its work is finished; **the engineering system decides whether the result is accepted**.

## Seven questions before moving to the next phase

Before I let one feature become the foundation for the next, I now try to answer seven questions:

1. **What was the user supposed to be able to do at the end?** Not which files had to change, but which capability had to exist.

2. **What evidence proves the main case works?** Tests, validators, a demonstration, or some combination of them.

3. **What happens outside the happy path?** Errors, partial states, permissions, retries, unexpected data.

4. **Is the feature integrated or does it merely exist?** Correct code can still sit outside the real workflow.

5. **Which assumptions did the agent make that we have not yet validated?** Especially around business logic, UX, or architecture.

6. **Which findings remain open?** If there is a punch list, the feature is not accepted even if the original plan is green.

7. **Would I confidently build the next layer on top of this?** If the answer is no, we are not done yet.

Not every task deserves the same level of ceremony; a small local change does not need the same process as payments, permissions, or clinical data. The underlying question remains the same: **what evidence justifies building the next layer on top of this one?**

## Speed needs checkpoints

I still find it impressive how much an agent can do without constant intervention. It can navigate a repository, understand relationships among files, build components, call tools, correct itself, and sustain work for increasingly long periods.

I do not want to lose that capability; I want to use it without confusing movement with direction.

That is why I now try to give agents autonomy inside clear boundaries and reserve acceptance for the points where the product itself needs to be checked. This also connects with another question I have been exploring: [Do We Really Need Another AI Agent—or Should the System Know This Already?](/articles/en/do-we-really-need-another-agent/). The more decisions we can turn into rules, tests, and validators, the less quality depends on someone—human or agent—remembering to check them manually.

AI can travel most of the road, and it can travel it quickly; that is precisely why stopping in the right places matters.

In short, “done” is a declaration; **accepted is a conclusion backed by evidence**.

---

## References

- NASA, **Product Validation**: verification versus validation; requirements compliance versus user expectations and intended environment. https://www.nasa.gov/reference/5-4-product-validation/

- NASA Systems Engineering Handbook, **Verification and Validation Plan / Requirements Verification and Validation Matrices**. https://www.nasa.gov/reference/system-engineering-handbook-appendix/

- GitHub Docs, **Review AI-generated code**: testing, static analysis, context, intent, and architecture. https://docs.github.com/en/copilot/tutorials/review-ai-generated-code

- OpenAI, **A practical guide to building agents**: guardrails, human intervention, and escalation criteria. https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/

- OpenAI API, **Evaluate agent workflows**: traces, graders, and end-to-end agent workflow evaluation. https://developers.openai.com/api/docs/guides/agent-evals