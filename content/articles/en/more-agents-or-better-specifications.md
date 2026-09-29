# More Agents or Better Specifications? What Changed After Trying Both

Once one coding agent starts working well, the next idea feels almost inevitable: if one agent helps, several properly coordinated agents should help even more. The pattern is tempting for teams trying to accelerate a result without losing control; for a while, that was exactly how I worked. I split responsibilities across different roles and let an orchestrator decide who should implement, audit, or review security.

The logic was attractive, and the early evidence seemed to support it; the problem was not whether agents could produce a result, but whether the intent survived each handoff. The workflow had grown naturally from [Roo Code](https://github.com/RooCodeInc/Roo-Code) inside Visual Studio Code; later, more of the work moved into the terminal, PowerShell, [Claude Code](https://github.com/anthropics/claude-code), [Codex](https://github.com/openai/codex), and other models. The interfaces changed, but the underlying instinct stayed the same for a while: specialize agents, delegate, coordinate.

The deeper issue appeared somewhere less visible than the code: **every handoff moved work, but it also moved an interpretation of the context**. The result could still be good; the risk was that every boundary created another opportunity for intent to drift.

An agent might spend hours accumulating decisions, corrections, exceptions, and project constraints; when it delegates, it has to reconstruct part of that history for another agent. The second agent receives whatever the first one considered relevant, at the level of detail the first one chose, and then interprets the task again inside a different context window. The result eventually returns to the main agent and goes through yet another interpretation before it is integrated back into the whole.

That does not mean multi-agent work fails. Sometimes it works extremely well. The uncomfortable part was different: I had built an architecture in which **coordination also meant translation**, and every translation created another place where intent could drift.

That experience changed the question. It was no longer only about how to distribute work more effectively; it was about how to make the intent survive the distribution.

## A handoff is not a neutral channel

Adding another actor to a multi-agent system does not add only capacity; it adds a boundary. Across that boundary must travel the objective, constraints, dependencies, acceptance criteria, prior decisions, and enough context for the new execution to remain part of the same problem.

Anthropic describes a related tension from a different domain. In its production multi-agent research system, subagents perform especially well when they can pursue **independent directions in parallel**; at the same time, the architecture introduces coordination, evaluation, and reliability challenges. In separate guidance, Anthropic recommends parallelization when a task can genuinely be divided into independent subtasks or when separate perspectives are useful. ([How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system); [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents)).

The boundary of that evidence matters: a research system is not a universal benchmark for software development. It does, however, support a useful architectural observation: **parallelism becomes more valuable when task independence is real; when dependencies are dense, coordination stops being an implementation detail and becomes part of the problem itself**.

That was exactly what I was beginning to see. A large share of software work is not a set of isolated pieces waiting for separate agents; it is a chain of decisions sharing contracts, state, data, conventions, and acceptance criteria. Multiplying executors before understanding those dependencies can accelerate pieces of the work while making the final integration harder.

## Before I called it SDD, I was already trying to specify

The answer did not arrive all at once. Before I adopted an explicitly specification-driven approach, I was already producing fairly detailed plans because I needed agents to keep moving without drifting too far from the goal.

They worked, but they had a clear weakness: they tended to become monolithic. Getting a plan to the point where I considered it useful required refining it, expanding it, asking what had been missed, correcting dependencies, and checking it again. I had found a direction that worked for me, but not yet a systematic structure for carrying intent, execution, and evidence without concentrating everything in one enormous document.

In parallel, I explored contracts and approaches that formalized parts of the problem. [OpenAPI](https://github.com/OAI/OpenAPI-Specification) provides a standard, machine-readable description for HTTP interfaces; [AsyncAPI](https://github.com/asyncapi/spec) plays a similar role for message-driven systems. Neither is meant to solve full product planning, but both reinforced an important idea: **when part of system behavior can be expressed as a verifiable contract, it no longer depends exclusively on a conversation**.

Later I experimented with tools aimed directly at Spec-Driven Development, including [Spec Kit](https://github.com/github/spec-kit) and [OpenSpec](https://github.com/Fission-AI/OpenSpec). I tried them at earlier points in their evolution, so I do not treat that experience as a current assessment of what either project can do today; both have continued to change. What mattered for my own process was the principle they made difficult to ignore: a specification could become more than documentation written before implementation; it could become an active part of the working system.

Instead of continuing to adapt my process to a particular tool, I began combining principles that already made sense to me: planning, SDD, validation, and a structure I had used for years in engineering—**PDCA: Plan, Do, Check, Act**.

That is where the pieces started fitting together more naturally.

## From controlling roles to controlling artifacts

In my earlier multi-agent setup, much of the control lived in the assignment of roles:

```text
orchestrator → implementer → auditor
```

Once specifications moved closer to the center, the sequence began to look more like this:

```text
goal → specification → plan → tasks → implementation → tests → evidence
```

The difference looks modest until something goes wrong. In the first model, understanding what should have happened may require reconstructing what the orchestrator said, what the implementer understood, and what the auditor checked; in the second, more of that intent is materialized in shared artifacts.

If a task's purpose becomes unclear, there is a plan to return to; if people disagree about what “done” means, there should be acceptance criteria. Once the work has been executed, tests and evidence provide a way to inspect what actually happened instead of reconstructing closure only from the conversation.

This does not eliminate the context problem. Long sessions still accumulate decisions, documentation can become stale, and a badly written specification can preserve a bad idea with impressive efficiency. The shift is elsewhere: **context no longer depends only on conversational memory; more of it travels through artifacts that can be reviewed, versioned, and verified**.

That connects directly with a lesson I described in [“AI Said ‘Done’. The Product Had a Different Opinion”](/articles/en/ai-said-done/): an agent closing a task is not automatically the same thing as the product satisfying the requirement. Specifications help because they create an external reference against which implementation can be checked.

## Why this felt so familiar

I was not trained as a software engineer; I am an electrical engineer, and I spent years working with specifications, data sheets, requisitions, technical bids, vendor-document review, and QA/QC.

If a project needs a motor control center, a switchgear lineup, or even a cable, the request is not simply “send us a good one.” A technical specification provides the reference for evaluating the bid; even after purchase approval, the process is not over. When the equipment arrives, QA/QC verifies that what was delivered matches what was approved.

The specification **survives the process**.

It does not depend on the original author being present for every later conversation and verbally reconstructing what was intended. Different people can compare decisions and deliverables against the same artifact. Real engineering still includes ambiguity, change, and judgment, of course, but a shared reference reduces how much has to be reconstructed during every handoff.

When I began working with agents in a more specification-driven way, I recognized the same logic. The domain had changed; the principle had changed much less.

That is probably one reason this approach started feeling more natural to me than a workflow in which too much intent moved through successive interpretations from one agent to another.

## The agent does not do less; the proof changes

Moving control toward specifications did not mean delegating less. In practice, the opposite happened: the agent participates in planning, implements, writes tests, runs them, analyzes failures, fixes what broke, and validates again; it also has to leave enough evidence for the work to be reviewed.

Human involvement shifts toward different questions:

- Does this actually satisfy the objective?
- Were the relevant dependencies considered?
- Where are the acceptance criteria and tests?
- What observable behavior proves the task is complete?
- Does the evidence prove the feature, or merely that something ran without crashing?

That shift matters because **not every form of validation needs another agent**. A build system can deterministically report whether the project compiled; a test runner can report whether tests passed; a script can verify invariants, and a validator can prevent an incomplete artifact from being accepted as valid. AI still interprets, implements, and corrects, but it does not need to spend reasoning on decisions the system can already verify more directly.

The same principle appears in [“After 8,901 Commands, I Changed the Way I Work with AI Agents”](/articles/en/after-8901-commands/): improving an agentic system is not necessarily about adding more capability. Sometimes it is about deciding which context, memory, tools, and rules have actually earned a place in the architecture; subtraction can be an architectural decision too.

## Specifications can also decide when to use more agents

For a while I treated multi-agent work and SDD as competing paths. One distributed work through roles; the other structured it through artifacts. With more experience, that opposition started to feel artificial.

Maybe the order matters more than the choice.

First define the goal; then turn the intent into specifications, identify dependencies, establish criteria, and separate work packages. Only then does a much more useful question appear: **which of those tasks are independent enough to run in parallel without forcing every agent to reconstruct the entire project?**

The flow changes:

```text
goal
→ specification
→ plan
→ dependencies
→ independent tasks
→ parallel execution where it adds value
→ integration
→ tests
→ evidence
→ acceptance
```

At that point, multiple agents stop being an organizational structure applied by default and become an execution decision. There is no requirement to invent a “frontend agent,” a “backend agent,” and an “auditor agent” simply because those labels are convenient; several execution agents can work on packages the planning process has already identified as sufficiently independent.

Each package should carry what its executor needs: relevant context, objective, boundaries, dependencies, acceptance criteria, and checks. The agent should not have to guess what an orchestrator meant or rebuild the entire project model from scratch; it should solve a unit of work whose relationship to the whole was reasoned about before parallelization began.

This still does not make parallelism automatic. Two tasks that look separate may touch the same schema, modify shared contracts, or depend on the same state; if that relationship is discovered too late, multiple agents simply produce conflicts faster. Specifications do not eliminate coordination; **they make it easier to decide where coordination is worth paying for and where it is not**.

## A practical checklist before multiplying agents

Before parallelizing work, I would now want at least these questions answered:


1. **Is the objective stable enough to distribute?** If it changes every time it is explained, distribution is premature.

2. **Are the dependencies visible?** A task stops being independent as soon as it shares critical state, contracts, or sequencing with another task.

3. **Does each work package have its own acceptance criteria?** If two agents can both claim success under different definitions of “done,” integration begins with debt already attached.

4. **Is there a shared source of truth?** A specification, plan, contract, tests, or equivalent artifacts must survive the handoffs.

5. **Is integration defined before execution starts?** Knowing how results will come back together matters as much as knowing how to split them apart.

6. **Can some validation be deterministic?** The more the system can verify through tests, scripts, or validators, the less acceptance depends on another probabilistic interpretation.
7. **Does parallelism provide a measurable benefit?** Speed, coverage, independent exploration, or reduced critical-path time; without a clear gain, extra coordination is simply extra work.

This is not a universal formula. It is a filter for avoiding a mistake I found expensive: assuming that more agents automatically mean more useful capacity.

## So, more agents or better specifications?

After trying both approaches, the answer that most accurately describes how I prefer to work today is simple: **better specifications first**.

Not because one agent should do everything, and not because multi-agent systems stopped being interesting. Quite the opposite: the clearer the structure of the work becomes, the more attractive selective parallelization starts to look.

What changed was the threshold.

If the objective is defined, dependencies are understood, criteria are verifiable, and a task can be separated without losing intent, multiple agents can be powerful. If it is still unclear what is being distributed, adding agents may simply distribute the uncertainty.

At first I tried to scale by increasing the number of agents; later I started asking whether I could scale by structuring what those agents receive more carefully. The next step may combine both ideas: **specify first, then decide what deserves to run in parallel**.

In engineering, the more actors involved, the more valuable it becomes to have a reference the people involved can verify without asking the previous person what they meant. After working with agents, that old lesson came back in a new form.

**Specifications do not compete with agents; they give agents a reference. And a good reference may be exactly what makes it possible to multiply agents without multiplying ambiguity at the same time.**

---

## References

- Anthropic, **How we built our multi-agent research system**: https://www.anthropic.com/engineering/multi-agent-research-system
- Anthropic, **Building Effective AI Agents**: https://www.anthropic.com/engineering/building-effective-agents
- GitHub, **Spec Kit**: https://github.com/github/spec-kit
- Fission AI, **OpenSpec**: https://github.com/Fission-AI/OpenSpec
- OpenAPI Initiative, **OpenAPI Specification**: https://github.com/OAI/OpenAPI-Specification
- AsyncAPI Initiative, **AsyncAPI Specification**: https://github.com/asyncapi/spec
- Roo Code, **Roo-Code** (historical repository, currently archived): https://github.com/RooCodeInc/Roo-Code
- Anthropic, **Claude Code**: https://github.com/anthropics/claude-code
- OpenAI, **Codex**: https://github.com/openai/codex