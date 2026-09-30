# From Spreadsheets to WattsWise in 216 Hours: Where AI Helped—and Engineering Still Mattered

**If you have ever spent more time finding a calculation than performing it, the problem will sound familiar.** I was tired of recreating electrical calculations I had already done, searching for the right spreadsheet, and checking whether an old template still matched the conditions of a new job. The goal was simple: avoid repeating work without losing the ability to verify it. What began as that familiar engineering frustration became WattsWise, an interconnected set of electrical calculation tools—and an experiment in building software with AI while retaining technical ownership.

I logged **216 hours of active work** between the first concept sketch and submitting WattsWise version 1.0.0 to Google Play Console for its initial review. That number is a record of one stage in one project, not a universal development benchmark; submitting an app for review is also different from having it available to the public. Still, those hours revealed something worth examining: which parts of product development could AI accelerate, and which decisions were still mine to make?

## The spreadsheet wasn't broken. The workflow was.

Spreadsheets remain indispensable engineering tools. The problem arises when a recurring task depends on remembering which workbook contains the latest formula, whether its assumptions still apply, and which values need to be copied into the next calculation. A change to a load estimate can affect current, voltage drop, and power-factor considerations; if those steps live in separate files or calculators, the engineer becomes the integration layer.

I also tried online calculators. They were convenient when the inputs matched the problem and restrictive when they didn't; fixed defaults and isolated forms could turn a quick calculation into another round of manual reconciliation. The idea behind WattsWise was therefore not to replace every spreadsheet. It was to build a more coherent workflow in which related calculations could share context while still allowing deliberate changes to inputs.

That distinction matters in electrical engineering. Flexibility across voltages, frequencies, or units does not automatically confer compliance with IEC, NEC, or any other applicable code; engineering assumptions and local requirements still need to be checked. The [current WattsWise listing on Google Play](https://play.google.com/store/apps/details?id=com.franklinrodriguez.wattwise) describes interconnected power and voltage-drop calculations alongside additional electrical tools. It documents what the app offers now, not a feature-by-feature record of its first release.

The product idea was becoming clearer: **stop asking engineers to carry the same numbers from one isolated calculation to another**. The unfamiliar part was how to build the application without losing control of the engineering behind it.

## An AI-assisted workflow needs someone to own the answer

I approached development with domain knowledge rather than a conventional software team. The electrical relationships, expected behavior, and practical use cases were mine to define; AI-assisted implementation offered a way to turn those decisions into Flutter code and an interface much faster than starting every component manually.

The workflow assigned two complementary jobs. An **executor** produced implementations within defined constraints; an **auditor** reviewed the result and returned potential faults or deviations for correction. It was a useful division of labor, provided neither role was mistaken for an independent certification system. An auditor that accepts a shared wrong assumption can still approve the wrong result, just as code that compiles can still implement the wrong requirement.

Consider a seemingly simple interaction: a user changes the power value in one module and expects related calculations to reflect it. The code for both screens might pass isolated checks, yet the experience still fails if an outdated value crosses between them or an assumption silently changes. The acceptance question must therefore extend beyond whether the code runs: **does the resulting behavior match the engineering problem the product promised to solve?** I explore that broader distinction in [“AI Does Not Eliminate Engineering; It Forces Engineering to Become More Explicit”](/articles/en/ai-does-not-eliminate-engineering/).

Flutter's [official testing documentation](https://docs.flutter.dev/testing/overview) distinguishes unit, widget, and integration tests because they answer different questions about software behavior. That guidance provides a useful technical framework; it is not evidence of how many tests WattsWise had at the time. What mattered in this project was keeping implementation, review, and final technical acceptance separate instead of treating an AI agent's declaration of completion as the finish line.

## The hidden bottleneck: passing intent from one step to the next

As the product grew, a less visible challenge emerged. Decisions about formulas, units, shared data, and the scope of each module had to survive new implementation tasks and new rounds of review. If every conversation began by reconstructing those decisions, some of the time saved through code generation would disappear into coordination; worse, a rule could change accidentally without anyone noticing.

Executor and auditor roles addressed part of the problem, but adding roles alone could not solve it. The more durable answer was to preserve the instructions that mattered: explicit requirements, known constraints, acceptance criteria, and the outcomes of earlier reviews. That lesson connects to [“More Agents or Better Specifications? What Changed After Trying Both”](/articles/en/more-agents-or-better-specifications/). Coordination improves when people and tools can consult the same reference instead of translating intent afresh at every handoff.

There's a useful industry-level parallel, although it should not be mistaken for a study of WattsWise. The [2025 DORA report on AI-assisted software development](https://dora.dev/research/2025/dora-report/) describes AI as an amplifier of an organization's existing strengths and weaknesses. My experience was smaller in scale and different in method, but the practical implication resonates: faster output doesn't compensate for an unclear objective.

## What the 216-hour figure measures—and what it doesn't

The stopwatch started with the first concept sketch and stopped when version 1.0.0 was submitted to Google Play Console for its first review. I counted active work on product definition, core logic, architecture, interface, and branding; passive waiting time was outside that scope. The number ultimately became part of the Studios216 name.

It's tempting to turn a figure like that into a dramatic agency comparison. The original story contrasted my effort with an illustrative 800-hour development scenario and a $50,000 budget; neither figure came from a controlled comparison of equivalent products with documented scope, quality, rates, and staffing. **The 216 hours are a self-reported project record. The other figures are illustrative assumptions, not measured industry baselines.**

There's a financial distinction, too. Building that initial version without outside capital did not make the work free: my own time, equipment, services, maintenance, and opportunity cost all have economic value. A lack of external funding answers a different question from the total cost of creating and sustaining a product.

Finally, the original milestone was *submission*, not instant distribution. [Google Play's publishing guidance](https://support.google.com/googleplay/android-developer/answer/9859654?hl=en) distinguishes review from publication; the [app's live listing](https://play.google.com/store/apps/details?id=com.franklinrodriguez.wattwise) confirms that WattsWise is publicly available today. Neither fact turns that original submission timestamp into a public-launch timestamp.

None of these distinctions makes the achievement less meaningful. They make it interpretable: the number describes a bounded phase of one founder's work, while the product and its subsequent evolution show what happened after the initial build.

## What remained after the first release

The visible outcome was an electrical calculation app designed around connected tools instead of disconnected forms. The current public listing describes power, voltage drop, fault-current estimates, conductor utilities, and additional diagnostics; it should not be read as proof that every listed feature shipped in version 1.0.0. The product continued to evolve, as software does after its first milestone.

The more consequential result was a change in how I approached technical projects. With AI, an engineer who understands a domain can move from problem definition to a working first implementation in ways that were previously harder to attempt alone; but generating code is only one part of owning a product. Decisions about assumptions, interfaces, validation, maintenance, and release readiness still need a responsible author. For a related perspective on that transition, see [“From an Idea to a Functional Product: What I Have Learned Building Software with AI”](/articles/en/from-idea-to-functional-product/).

I started by wanting to stop repeating spreadsheet work. I ended up learning how much of software development is really about making decisions explicit, keeping them consistent, and checking the result against the world in which the software will be used. **The 216 hours tell you how long the first milestone took; the engineering choices explain what made those hours useful.**