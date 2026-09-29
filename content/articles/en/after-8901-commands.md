# After 8,901 Commands, I Changed the Way I Work with AI Agents

For a long time, improving my work with agents seemed to mean one thing: **give them more capability**. The result seemed obvious: a better model, another tool, more memory, broader repository access, or more context should produce a more capable agent.

After several weeks of intensive use and after reviewing data from 8,901 commands, a different problem appeared: every new capability could also inject noise, repeat information, or consume context that was not valuable enough. For teams working with agents for hours at a time, reducing that waste can leave more capacity for the actual problem.

The question changed. It was no longer only **“What else can the agent do?”**; it became **“Which part of everything it could receive actually deserves its attention?”** That distinction ended up changing the architecture of my workflow.

## The first bottleneck stopped being the model

When models were less capable, it was natural to attribute many failures to the intelligence available. Stronger reasoning models changed that. Once an agent could navigate a repository, run commands, inspect Git, execute tests, read logs, and repair an implementation over several iterations, the bottleneck began to move.

A coding agent does not merely “think.” It continuously interacts with an environment that can return enormous amounts of information. A `git diff`, a test suite, a recursive directory listing, a log file, or a broad search can produce hundreds or thousands of lines. Sending all of that back raw gives the model more context; it does not necessarily give it more signal.

That is close to what Anthropic describes as [context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). The problem is no longer only how to write a better prompt; it also includes what information enters the context window, when it enters, and how useful it is. Their core principle is especially relevant for long-running agents: find **the smallest possible set of high-signal tokens** that maximizes the likelihood of the desired result.

The uncomfortable implication matters because more information can help, but it can also dilute attention. **Instead of asking how much context can fit, the more useful question is how much context deserves to remain active.** This means the goal is not to minimize context, but to make active context earn its place.

## 8,901 commands became an audit of the workflow

[RTK](https://github.com/rtk-ai/rtk) entered my workflow with a fairly narrow job: reduce the output of certain shell commands before that output reached the agent. If an operation returned hundreds or thousands of lines, the layer tried to preserve useful signal rather than pushing every raw line into context.

After roughly five weeks, the accumulated statistics showed **8,901 commands processed**, 90.4 million units of potential input, 14.6 million ultimately delivered, and 75.9 million avoided; the recorded reduction was **83.9%**. During the most recent week in that sample, it reached **87.1%**.

Those numbers need a boundary around them. They do not prove that a bill fell by 83.9%, nor that a weekly subscription allowance would automatically last 83.9% longer; provider policies, caching, models, and usage accounting are separate concerns. What they did show was narrower and more useful: **a large amount of information that could have entered the agent's context did not need to arrive in full for the work to continue**.

Until I looked at the accumulated statistics, the cost of that noise had remained fairly abstract. RTK did not make the model smarter; in that workflow, it behaved more like admission control. Before spending attention on a large tool result, the system implicitly asked how much of that result the agent actually needed.

That was the first important shift: stop treating “more context” and “better context” as synonyms.

## Then I had to think about repetition

Reducing what enters solves one part of the problem, not all of it. Some information genuinely belongs in the workflow: stable instructions, tool definitions, project rules, portions of history, and reference material that may be reused across many calls.

Caching matters for a different reason. [OpenAI's prompt caching documentation](https://developers.openai.com/api/docs/guides/prompt-caching) explains that when requests share a stable prefix, previously processed prompt state can be reused in supported cases, reducing latency and input cost. The same documentation makes an important distinction: maintaining a session does not, by itself, imply that a cache hit will occur.

That led me to separate two questions that I had previously treated as one:

- **Should this information enter the context?**
- **If it must enter repeatedly, can we avoid treating it as entirely new every time?**

RTK mostly addressed the first. Caching addressed the second.

That distinction became clearer while looking at [Headroom](https://github.com/headroomlabs-ai/headroom). The direct compression I was seeing did not look dramatic relative to total input volume; high prefix-cache usage and persistent project knowledge were much more interesting. A tool I had introduced largely in search of token efficiency started earning its place for another reason: continuity.

Not because it invented caching—model providers already offer caching mechanisms—but because the broader problem was architectural: **stable context should be organized so it can be reused without being needlessly reconstructed**.

## Persistent memory still did not solve orientation

In that project I found 256 persistent memories, with an average importance score of 0.86 and records reaching back 27 days. The count was less interesting than the content: constraints, functional decisions, design criteria, and agreements that still affected work weeks later.

That helped continuity between sessions, but long working sessions exposed another issue. A thread can begin perfectly oriented and then accumulate hours of tool calls, edits, errors, tests, corrections, and intermediate decisions. Something being present at the beginning does not imply that it will remain operationally salient when it matters again.

That was why I had built **Quick Context**, a deliberately small skill. It was not trying to store the entire project or compete with persistent memory. Its job was to reorient the agent: identify the project, locate its rules, recover constraints and permissions, inspect recent changes, and restore the position from which work should continue.

The distinction became useful:

**persistent memory preserves knowledge; reorientation restores position.**

Anthropic describes a related pattern in its discussion of [structured note-taking and just-in-time retrieval](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents). Long-horizon agents can persist knowledge outside the active context window and pull it back when it becomes relevant, rather than keeping everything present on every turn.

That changed another assumption. Loading a great deal of information at the start of a session can create a strong beginning; it does not imply that the right information will remain salient several hours later.

The question changed from **“How much memory can the agent load?”** to something more useful: **“Can it retrieve the right thing when that thing matters again?”**

## A good tool can still be redundant

The next useful lesson came from a tool that was not obviously failing.

Headroom included [Serena](https://github.com/oraios/serena) as a code-memory and semantic-navigation layer. On paper, that was reasonable; the stack already contained other ways to cover parts of the same need, however: [Codebase MCP Memory](https://github.com/DeusData/codebase-memory-mcp), [CocoIndex Code](https://github.com/cocoindex-io/cocoindex-code), [Graphify](https://github.com/Graphify-Labs/graphify), text search, filesystem tools, and Git.

At the same time, I noticed Serena processes starting even when I was not consciously using that capability. That did not mean Serena was a bad tool. It meant something more actionable: **installing a capability does not prove that the capability deserves to remain active**.

I disabled it from the daily workflow and left a controlled comparison for later. The test would be straightforward: what did it add relative to CocoIndex, what could it replace, what did it duplicate, and what operational or context cost came with it?

Anthropic makes a closely related point about tool design: bloated toolsets and overlapping capabilities create ambiguous decisions about which tool an agent should use. If a human engineer cannot clearly explain which tool belongs in a particular situation, expecting the model to consistently resolve that ambiguity is optimistic.

That gave me a better default than “add more capabilities”: **every tool should earn its place**.

## MCP did not need to be the default either

The same thing happened with MCP. I did not conclude that MCP was a bad architecture; it remains valuable when I need a rich, persistent, structured integration or capabilities that would be awkward to reconstruct through a shell.

But some operations were small, local, and perfectly expressible through a CLI. If they could run that way—and their output could be filtered before reaching the model—another possibility appeared: I might not need to keep an additional integration active solely because it was available.

The question stopped being “MCP or CLI?” as if those were competing camps. It became an engineering question:

**Which interface delivers enough capability with the least unnecessary friction, ambiguity, and context for this operation?**

Sometimes the answer is MCP; sometimes it is a CLI, a focused function, text search, or a direct API call. **The difference is choosing the right surface**, not turning a technology into a default ideology.

## The stack started to look like a context architecture

Once I looked at all of those decisions together, they stopped looking like independent optimizations. They were answering four different questions:

1. **What information gets in?** Reduce noise before it occupies attention.
2. **What information gets repeated?** Use caching when stable prefixes are genuinely reusable.
3. **What information must survive?** Persist durable decisions outside the immediate conversation.
4. **What information must return now?** Retrieve context just in time, based on the task and the current point in the project.

I would add a fifth question that became equally important:

5. **Which tools deserve to stay active?** Keep unique capability; challenge duplication and operational overhead.

The goal was no longer token reduction for its own sake. **The difference is not between large context and small context, but between context that earns attention and context that merely occupies it.** That matters because the model should spend as much of its available capacity as possible **on the problem rather than on the infrastructure surrounding the problem**.

That connects directly with what I found while moving [from an idea to a functional product](/articles/en/from-idea-to-functional-product/): faster generation does not remove the need for architecture. It also connects with accepting work too early; as I described in [AI Said “Done”. The Product Had a Different Opinion](/articles/en/ai-said-done/), autonomy works better when the system defines what information, evidence, and controls belong at each stage.

## Five questions before adding another layer

Today, before keeping another tool or context source in the everyday workflow, I try to answer five questions:

1. **What unique capability does it add?** If I cannot explain that clearly, it has probably not earned its place yet.

2. **How much context does it introduce to deliver that capability?** A correct answer can still be expensive if it systematically arrives with noise.

3. **Does it duplicate something already available?** Two good tools can form a bad architecture when they solve the same job without a clear boundary.

4. **Does this information need to be present all the time?** If it matters only at certain moments, just-in-time retrieval is often cleaner than permanent loading.

5. **If I disable it for a week, what real work becomes impossible?** That question forces a distinction between demonstrated utility and imagined utility.

This is not a universal formula or a checklist for removing tools. In one project, an additional integration may save hours; in another, keeping it active may introduce more complexity than capability. **The framework is useful because it compares demonstrated utility with context cost**, not because pruning should become an objective of its own. The important part is measuring the effect inside the real system rather than falling in love with the feature list.

## Waste less before looking for more intelligence

Models will keep improving; context windows will grow, caching will become more sophisticated, memory will become more useful, and agents will gain access to increasingly powerful tools. None of that removes the need to decide what deserves attention.

If anything, it may make that decision more important. The more capable an agent becomes, the easier it is to give it access to everything. The more access it has, the more valuable it becomes to design boundaries between signal and noise, persistent knowledge and momentary context, genuine capability and accumulated redundancy.

After 8,901 commands, the most important change was not discovering one particular tool. It was stopping myself from treating the stack as a collection of capabilities and starting to treat it as **a context architecture**.

**The core idea is simple: agent efficiency is not only about how much intelligence the model has; it is also about how much unnecessary work the surrounding system prevents before asking the model to think.**

## References

- Anthropic — Effective context engineering for AI agents: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- OpenAI — Prompt caching: https://developers.openai.com/api/docs/guides/prompt-caching