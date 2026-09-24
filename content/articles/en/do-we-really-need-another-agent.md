# Do We Really Need Another Agent—or Should the System Know This Already?

If you build with agents, you may already recognize this temptation: **if an agent can do it, let the agent do it**. The instinct is understandable: agents can read documents, interpret structure, write code, call tools, inspect results, correct themselves, and keep going. Some can even hand part of the problem to another agent and come back with a better answer.

But here is the distinction: capability is not the same thing as necessity. Lately, I have found a different question more useful than “What else can I automate with AI?” **How much of this problem do we already understand well enough that we should stop reasoning through it every single time?**

If the answer is already stable, repeatable, and verifiable, the next step may not be more intelligence. It may be turning what we learned into system behavior.

## An invoice example makes the distinction visible

Imagine an electronic invoice. If all we receive is a PDF, a machine has to reconstruct a surprising amount of meaning. It must find the supplier and customer, recognize rows and columns, distinguish taxes from discounts, associate values with concepts, and recover the relationships between those elements. A multimodal model can be extremely useful there. Now add another input: the structured XML behind the invoice.

A large part of the interpretation problem disappears. The supplier already has a field. The date has a field. Taxes have defined fields. Product lines have hierarchy. Values arrive associated with what they mean.

This is not merely a convenient thought experiment. The European EN 16931 eInvoicing standard defines a semantic model for the core elements of an electronic invoice and maps that meaning into structured syntaxes such as UBL and CII. In some workflows, the meaning is already formalized for machine processing. So the question changes: **Why ask an LLM to rediscover something the system already knows?**

We can parse the XML, verify totals, validate rules, and transform the data into our own model. If a condition should produce the same answer every time, part of the value is precisely that we can test it without depending on a fresh interpretation. I do not need creativity there: I need certainty.

## The frontier is where AI starts earning its place

In short, the useful distinction is not “AI versus traditional software.” It is this: **Is the problem already understood, or does it still contain uncertainty?** The same invoice can contain both. Some parts are well known: totals must balance, identifiers must satisfy constraints, known business rules should be applied consistently, and workflows can have explicit states and transitions.

Then something different appears: an ambiguous description, an expense that does not fit cleanly into a category, a new edge case, or an exception for which no rule exists yet. Now we actually have a question. That is where AI becomes more valuable. It can interpret, compare possibilities, search for patterns, and help investigate. A human validates the result, and the process moves on. Until something more interesting happens.

The same exception comes back; then again, then again. At some point, it is not much of an exception anymore. **We have learned something.** The next question is whether that learning should continue to live only inside a conversation, or whether it is ready to become a permanent capability. The pattern can be compressed into this:

```text
known → software

unknown → AI

recurring unknown
→ learning
→ rule
→ test
→ software
```

The agent does not disappear; it moves to the next frontier. A simple phrase helps me remember the distinction: **AI explores the frontier; software consolidates the territory.**

## Learning should leave something behind

We talk a great deal about agent memory, persistent context, conversation history, and knowledge bases. All of them can be useful. But there is another form of memory that is less impressive in a demo and often more valuable in production: **making what we learned change the system**.

If we solve an exception, discover a general rule, and turn it into tested code, the next run does not have to reconstruct the entire conversation. The knowledge has been absorbed. That changes how I think about system maturity.

An immature AI system may require a lot of interpretation because it has not formalized what it knows. A maturing system should progressively absorb some of that knowledge into rules, contracts, validations, tests, schemas, and explicit state. That does not mean removing AI. It means reserving it for places where intelligence is still doing real work.

NIST gives us a practical reason to keep that boundary visible. Its Generative AI Risk Management Profile treats **confabulation**—false or inconsistent content presented with apparent confidence—as an inherent risk of generative systems. It also recommends testing, evaluation, validation, and verification, including comparisons against known ground truth when appropriate. That does not make LLMs poor automation tools. It suggests something more useful: **when an objective check exists, use it**.

The model can propose. The system can still verify.

## From a human correction to a system rule

Coding agents make this especially interesting. For years, many people understood processes that were technically automatable but remained expensive to translate into software. A domain expert could know exactly what should happen, which exceptions mattered, when a workflow should stop, and what a missing field really meant. Turning that knowledge into working code required a long translation chain. Agents are shortening part of that distance.

A domain expert can now work with an agent without personally mastering every library or implementation detail. But one capability remains difficult to outsource: **knowing when the result is wrong.** The expert can say: “That is not the rule.” “There is an exception here.” “That field does not mean what you think it means.” “This process should stop now.” The most valuable part comes next.

If that correction stays only in the chat, we learned something—but the system may not have learned it. If we turn it into a rule, a test, or a contract, the next execution starts from a higher level. That feels very close to an old engineering idea: **Plan, Do, Check, Act**. Try, inspect, correct, consolidate, and then run the cycle again.

The tool is new; the logic of continuous improvement is not.

## The agent can change; the capability should remain

There is another advantage to consolidating what we learn. I may build with one model today and switch providers tomorrow. A better tool may appear. The architecture may change. If operational knowledge lives mainly inside prompts, conversations, and agent-specific behavior, part of the system remains tied to that tool. But if the work turns that knowledge into rules, code, tests, schemas, workflows, and structured data, the relationship changes.

The agent can change; the capability remains. That distinction matters more to me the longer I build with these systems: **AI can help create the asset without having to become the asset**. A model may help us discover a rule. Once the rule is clear and important enough, I would rather be able to inspect it, test it, version it, and move it.

## Before adding another agent, try this filter

The next time a workflow seems to need “another agent,” you may be wondering where to draw the line. I would start with five questions:

- **Is the input already structured?** If a field, schema, API, or explicit format already exists, we may not need to interpret what is already represented.
- **Which part of the decision is governed by a known rule?** If the same condition should produce the same response, it may be a candidate for code.
- **Can the result be checked objectively?** If yes, keep that verification deterministic even when a model participates earlier.
- **Is the exception still an exception?** If it keeps returning and we understand the pattern, it may be ready to consolidate.
- **If I switch models tomorrow, what knowledge remains?** The answer reveals how much learning actually belongs to the system.

These are not commandments; they are a filter. Sometimes the answer will still be “I need an agent.” Good. That is exactly where I want one. Other times, we may discover that we are spending intelligence to repeatedly make a decision we already understand. And that is the part I find most interesting. For a while, the dominant question was: **What else can I do with agents?**

I still ask it. But I now put another question beside it: **What is an agent doing today that should no longer require an agent tomorrow?** Not because I want less AI. Because I want every cycle to leave something behind. A clearer rule. A new test. A stronger contract. One less ambiguous exception. A capability that survives after the conversation ends.

AI explores the frontier; we validate what we learn; software consolidates the territory. Then the frontier moves again. So the next time you think, “I could put another agent here,” try a more uncomfortable question first: **Do you actually need intelligence here—or do you already understand the answer well enough to turn it into software?**

---

## References

- European Commission, **EN 16931 / European standard on eInvoicing**: semantic data model and structured syntaxes for electronic invoices. https://ec.europa.eu/digital-building-blocks/sites/spaces/DIGITAL/pages/467108926/Compliance+with+eInvoicing+standard
- NIST, **Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile (NIST AI 600-1)**: confabulation, human oversight, and test, evaluation, validation and verification (TEVV). https://doi.org/10.6028/NIST.AI.600-1
- ISO 9001, **Plan-Do-Check-Act cycle**. https://www.iso.org/iso/iso9001_2015_process_approach.pdf