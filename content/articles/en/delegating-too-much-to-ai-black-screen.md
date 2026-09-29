# Are You Delegating Too Much to AI… Just Because a Black Screen Intimidates You?

There is a familiar scene for people who work with computers every day, understand complex professional processes, and have never had a reason to program. The problem is not that the task is difficult; it is that a nearly empty interface can feel like the entrance to somebody else's profession. On Windows, it appears when Command Prompt or PowerShell opens; on macOS or Linux, it is the Terminal. The result can already arrive through a chat before you touch the terminal; that convenience creates another problem. Receiving it is not, by itself, evidence that the process is reproducible, even when the answer is useful and well presented.

To someone who has used a terminal for years, none of this is remarkable; to someone who has never worked there, the experience can still feel foreign. Then words such as Python, packages, `pip install`, scripts, and virtual environments appear, and the reaction is understandable: **“This is programming now. Better let the agent handle it.”**

The alternative is comfortable. Open a chat, describe the outcome, attach the files, and ask the agent to compare the data, perform the calculations, and produce a report. Often, it works remarkably well.

The problem is not delegation. The problem is failing to distinguish between **receiving a result** and **retaining a capability**. A conversation can solve today's task; a process captured in files, rules, tests, and documentation can keep solving it tomorrow.

## The real barrier may not be learning to program

You do not need to begin by saying, “Write me a Python program.” You may not even know that Python is a sensible tool for the job; there is no reason you should have to know that in advance. If an agent received twenty files, extracted data, cleaned values, applied validations, and produced a report, a more useful next question can be much simpler:

> **“Did you use any scripts or programs to do this?”**

If the answer is yes, the next request changes the nature of the conversation:

> **“Give me the files you used, package them in a ZIP, and explain how I can run them on my computer.”**

You are no longer trying to “learn programming” in the abstract; you are recovering what happened behind the scenes so the process can be repeated. The package may contain a `.py` file, a `requirements.txt`, some data folders, and a short set of instructions. It may also require dependencies or an isolated environment; the [Python Packaging User Guide](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/) specifically recommends virtual environments when working with third-party packages so projects can keep their dependencies separate.

On Windows, the path might be as small as this:

```powershell
py -m venv .venv
.venv\Scripts\activate
py -m pip install -r requirements.txt
py process_files.py
```

You do not need to memorize those commands to benefit from them. What matters is understanding what they represent: prepare an environment, install what the program needs, and run a tool that already exists.

The black screen stops being “the place where programmers work” and becomes something more concrete: **an interface from which you can run, observe, and repeat a process**.

## A good result is not yet a reproducible capability

This distinction becomes more important as the work grows. An agent may interpret an instruction correctly today and choose a different strategy tomorrow; it may use another tool, reorder steps, or handle an exception through a different line of reasoning. That does not necessarily mean the system is failing—it means we are using a system capable of making dynamic decisions.

That reasoning is valuable when the problem actually requires exploration; not every part of a workflow, however, needs to be rediscovered on every run. If the same type of file arrives every Monday and the same fifteen checks always apply, the better question may no longer be “Can the agent do it?” but this:

**What part of what it just did can be preserved so it does not have to rediscover it next time?**

It is the same boundary that appears when work is “done” from the agent's point of view but still requires functional acceptance. I explored that problem in [“AI Said ‘Done’. The Product Had a Different Opinion”](/articles/en/ai-said-done/): there, the question was whether the implementation actually fulfilled the intended behavior. Here, the next move is to preserve what has already been validated so it does not depend on a fresh interpretation again.

## With numbers, plausibility is not enough

Suppose an original value was `1.25`, but somewhere during extraction it became `12.5`. From that point onward, everything else may be executed correctly: the sums may be accurate, the percentages flawless, the chart polished, and the analysis perfectly coherent.

The problem is that everything rests on the wrong number.

NIST uses the term **confabulation** for cases in which a generative system produces and confidently presents erroneous or false content. Its [Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence) also warns that confident presentation can lead people to place inappropriate trust in an output. In numerical or consequential workflows, fluent explanation therefore cannot replace objective checks.

If an invoice must satisfy:

```text
subtotal + taxes - discounts = total
```

the program can verify it. If exactly 187 records should exist, the count can be checked. If debits and credits must balance, execution can stop until they do; if a value must never be negative, a validation can block the process as soon as one appears.

There is a meaningful difference between “the data looks consistent” and “twelve validations were executed, and all twelve passed.” The first is an assessment; **the second provides evidence**. The [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) likewise emphasizes repeatable, traceable, and documented testing, evaluation, verification, and validation processes—TEVV.

In a numerical system, convincing should never be treated as synonymous with correct.

## Domain knowledge is exactly what should not be surrendered

Someone who has operated a process for ten years usually knows things an outside developer could take months to discover. They know which field often arrives incorrectly, which supplier uses unusual naming, and when a deviation is normal. They also know when the workflow should stop, which column must never be empty, or which apparent error is valid under a particular condition.

That knowledge may not be written in Python, but it can be expressed as criteria: “if this happens, stop”; “that combination is valid only in this case”; “before accepting the result, check this other condition.”

This creates a much more useful division of labor. The agent can translate rules into code, propose structures, write tests, and explain failures; authority over what the process **should** do remains with the person who understands the domain.

You do not need to compete with the agent as a programmer. You need to avoid delegating the judgment that tells you whether the program is right.

## Asking for the files may be enough to begin

For someone who has never programmed, asking for the artifacts behind a successful result can be a more natural entry point than starting with a full programming course. First, obtain the result; then ask what happened behind the scenes, preserve the code, run it, and verify whether it reproduces the outcome with another input.

At that point, the task begins to exist outside the conversation.

The first version may be nothing more than:

```text
process_files.py
```

That can be enough. If the workflow grows—document reading, validations, calculations, reports, configuration, error handling—the structure should mature with it:

```text
my_system/
│
├── main.py
├── reader.py
├── validations.py
├── calculations.py
├── reports.py
├── config/
├── tests/
├── requirements.txt
└── README.md
```

Now the request is no longer “give me a script”; it is becoming a small software system. In [“From an Idea to a Functional Product”](/articles/en/from-idea-to-functional-product/), I argued that AI can accelerate the first implementation without eliminating architecture, tests, documentation, or validation. The same principle applies at this smaller scale: **the convenience of delegating the first execution should not prevent the result from becoming a maintainable capability**.

## A validated version changes the relationship with the agent

Suppose version `1.4` already works and contains the rules, tests, and structure that have been accepted. Even if letting the agent run the workflow remains more convenient, you no longer need to provide only the new input files and explain the process from scratch; you can provide the current system as well.

The instruction might become:

> **“This is the current version we have already validated. Use it to process these new files while preserving its existing rules and tests. If you encounter a case the system does not cover, tell me about it and propose an improvement for a future version; do not change current behavior without approval.”**

The relationship changes because the agent no longer needs to reconstruct the entire problem. It starts from a known base and spends reasoning where uncertainty still exists. That idea connects with what I observed after thousands of executions in [“After 8,901 Commands, I Changed the Way I Work with AI Agents”](/articles/en/after-8901-commands/). The conclusion there was that not every piece of information deserves to re-enter context and not every decision needs to be made again; good architecture preserves what is stable and retrieves what is necessary.

The current version becomes a form of **operational memory**. Not because it remembers a conversation, but because it materializes decisions: rules, tests, dependencies, documentation, and accepted behavior.

## Operating and improving should not be the same action

The difference becomes practical when two jobs that are often blended together are separated:

```text
OPERATE
use the current version
→ process
→ validate
→ deliver result
```

versus:

```text
IMPROVE
encounter an exception
→ analyze it
→ propose a change
→ validate
→ add a test
→ create a new version
```

If a report is needed today, the system should probably produce the report; it does not necessarily need to redesign three rules in the middle of execution because it found an approach it considers better. First operate. If something new appears, record it; then decide whether it deserves to become part of the next version.

This is where an agent can be especially useful: analyze an exception the system does not know, compare possibilities, and help turn the learning into a verifiable rule. Once that rule is understood and validated, it can become part of the software.

The cycle starts to look like this:

```text
known case
→ software

new case
→ agent + expert
→ understanding
→ rule
→ test
→ new version
→ software
```

AI does not disappear; it moves toward what still requires reasoning.

## Rebuilding the same path has a cost too

When an agent receives the same task without a reusable foundation, it may analyze the problem again, select tools, create helper code, execute intermediate steps, and verify the output. From the outside, that looks like intelligent activity—and it is—but it also consumes time, context, reasoning, and coordination.

If every Monday one agent, or even a collection of agents, rebuilds essentially the same path to produce essentially the same result, perhaps the next question is not how to make the swarm collaborate even better. Perhaps the question is why the path is still being rebuilt.

There is a simple difference between **solving a procedure again** and **executing one that has already been validated**. When the answer is understood well enough, turning it into software frees the agent to work on the new frontier. That is also the architectural question behind [“Do We Really Need Another AI Agent—or Should the System Know This Already?”](/articles/en/do-we-really-need-another-agent/).

## This is technical literacy, not a programming career

For years, building software seemed inseparable from knowing how to write every line of code. AI introduces another possibility: professionals in other disciplines can develop enough technical literacy to govern software built with agents without becoming traditional developers.

That literacy does not require memorizing libraries or commands. It requires understanding a handful of useful ideas: what goes in and what comes out; what a failed validation means; why logs exist; what tests protect; and why versions matter. It also requires knowing which dependencies a system needs, which behavior is approved, and which behavior remains under discussion.

Gradually, the language of delegation changes as well. “Make it work” becomes “if this field is missing, stop”; “do not change this rule”; “add a test for this case”; and “record what happened.” Later come more precise criteria: “do not invent a value when the data is missing”; “before generating the report, verify that the totals match.”

You are not merely learning to use a terminal. You are learning to **define how a system should behave and what evidence is required before accepting its output**.

## The old engineering cycle still works

None of this requires a new methodology. The logic resembles the familiar **Plan-Do-Check-Act** cycle: plan, execute, check, and improve. ISO's guidance on the [process approach in ISO 9001](https://www.iso.org/iso/iso9001_2015_process_approach.pdf) describes PDCA as a way to manage and improve process performance; agents can accelerate several stages, but useful learning does not have to remain trapped inside a conversation.

It can become a rule, a test, a configuration file, a version, or a piece of documentation. In other words, the system can accumulate knowledge.

That changes the relationship with AI. The agent stops being only something we call for one execution every time the problem appears; it can also help us **build, run, and improve capabilities that remain after the conversation ends**.

## The next time the black screen appears

PowerShell may still feel unpleasant. You may never want to memorize its commands, and you may continue asking an agent what to type when an error appears. That is fine: the goal is not to fall in love with a terminal; it is to reduce the distance between domain knowledge and the ability to turn part of that knowledge into something reproducible.

The first step does not have to be “I am going to learn Python.” It can be much smaller:

> **“What did you use to do this? Give me the files and show me how to run them.”**

And once a validated version exists:

> **“Use this version to do the work. If something new appears, tell me; do not change what already works unless we can validate it again.”**

That difference sounds small, but it changes the direction of delegation. AI can still do much of the work; the process, however, no longer disappears when the conversation ends.

For many people, a new kind of technical literacy may begin with something as simple as **not closing that black screen the next time it appears**.

---

## References

- [Python Packaging User Guide — Install packages in a virtual environment using pip and venv](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/)
- [NIST — Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [NIST AI Resource Center — AI RMF Core, Measure](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)
- [ISO — The process approach in ISO 9001](https://www.iso.org/iso/iso9001_2015_process_approach.pdf)