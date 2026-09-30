# Bidirectional Power Triangle: Why Should Every Calculation Start with the Same Input?

**54.1 A or 60.1 A?** Two current results can emerge from correct equations applied to the same **30 kW motor**. The problem is not the algebra; it is the meaning of one input. The 30 kW rating describes **mechanical shaft output**, not the electrical power the motor draws.

The datasheet specifies **90% efficiency**; the project assumes **400 V** and **0.80 power factor**. The engineer needs current, but the calculator on screen demands current before it will begin. The equations are available; the workflow makes the unknown a prerequisite for its own calculation. Which result actually describes this motor?

That is a small but recurring engineering problem: **the information available rarely arrives in the order a calculator expects**. A load schedule reports kW, a transformer nameplate displays kVA, and a clamp meter returns amps. The physics has not changed. Only the starting point has. So why rebuild the same chain of calculations whenever a different value arrives?

The idea behind the [WattsWise power tools](/wattswise/) is to work from different valid starting points while keeping assumptions visible and related values connected. The power triangle remains simple; the more interesting question is what happens around it.


## The spreadsheet isn't the problem. The handoffs are.

Excel can solve these relationships in either direction when the spreadsheet is designed for that purpose. The friction begins when a project relies on several sheets, file versions, online calculators, and field notes. Each tool wants different inputs; each handoff invites another check. Did the voltage change carry through to current? Is the kW value on that motor datasheet electrical input or mechanical output? Both numbers may look plausible on screen, even when an assumption has slipped.

Consider three ordinary starting points. **kW and power factor** can produce kVA and the magnitude of reactive power; **kW and kVAR** can rebuild the triangle; **kVA and voltage** can give the current associated with that apparent power under the specified system conditions. One important distinction: a transformer's nameplate kVA is a capacity rating, not evidence that the connected load is drawing that amount right now.

A bidirectional workflow is not about doing math Excel cannot do. The difference is **preventing the engineer from becoming the manual integration layer between otherwise correct calculations**. The same problem helped inspire WattsWise: the algebra was not missing, but continuity between tasks was. Restore that continuity and the next verification becomes easier; assumptions are less likely to get lost in transit.

## Three powers, several valid ways in

Under the familiar sinusoidal AC model, **P** is real power (kW), **Q** is reactive power (kVAR), and **S** is apparent power (kVA). They satisfy `S² = P² + Q²`. True power factor is defined as `PF = P/S`; under the stated sinusoidal conditions, that ratio is also `cos φ`.

Work backward and the triangle still holds. Given **P and PF**, calculate `S = P/PF`, followed by `|Q| = √(S² − P²)`; given **P and Q**, obtain `S = √(P² + Q²)` and recover `PF = P/S`. Current adds the system conditions: for single-phase power, `I = 1000·S(kVA)/V`; for balanced three-phase power, `I = 1000·S(kVA)/(√3·V_LL)`, where `V_LL` is RMS line-to-line voltage and `I` is line current.

Here is the limitation: **bidirectional does not mean unlimited inputs—or unlimited answers**. A unique solution needs enough independent known values. The size of Q alone cannot tell whether a load is inductive or capacitive; its direction must be known or selected. And whenever one value changes, the tool needs an explicit rule for what stays fixed. Otherwise, a mathematically legitimate recalculation can describe the wrong engineering situation.

## Follow the 30 kW motor: one physical answer, two calculation routes

Return to the opening motor. This **worked example shows how to distinguish mechanical output from electrical input** before calculating current. It is illustrative, not a real equipment specification or conductor-sizing recommendation. The inputs are **30 kW mechanical shaft output**, efficiency `η = 0.90`, displacement power factor `0.80`, and a **400 V balanced three-phase** supply measured line to line. The first current estimate, **54.1 A**, mistakenly treats shaft power as electrical input. The second, **60.1 A**, applies efficiency before using the power triangle. Two steps matter more than the interface: identify what each rating means, then choose which assumptions stay fixed. Let's trace the numbers and see why.

First, name the power correctly. The [U.S. Department of Energy's motor-system sourcebook](https://www1.eere.energy.gov/manufacturing/tech_assistance/pdfs/motor.pdf) relates a motor's useful mechanical output to its electrical input when discussing efficiency. Thus `P_input = P_output/η = 30/0.90 = 33.33 kW`. **About 33.33 kW of electrical input is required for the assumed 30 kW mechanical output** at that efficiency. In other words, the 30 kW shaft figure cannot go straight into the current equation. If a number already represents electrical input, however, dividing it by efficiency again would count the losses twice.

Now the remaining values follow: `S = 33.33/0.80 ≈ 41.67 kVA`, and `|Q| ≈ 25.00 kVAR`. At `400 V` line to line, `I = 1000·41.67/(√3·400) ≈ 60.1 A`. Ignore motor efficiency and the same calculation would return `I = 1000·(30/0.80)/(√3·400) ≈ 54.1 A`. **Those six missing amps came from a misidentified input, not a broken formula.** These results use unrounded intermediate values and assume the balanced, sinusoidal conditions specified above.

Now change the starting point without changing the motor. Given `P = 33.33 kW` and `Q = 25.00 kVAR`, the triangle returns approximately `41.67 kVA`; start instead with that apparent power and `PF = 0.80`, and real power returns. **The result should survive a change of route when the physical assumptions stay the same.** That is the real promise of bidirectional analysis: not different answers, but different valid paths to the same answer.

## The useful part is what happens after an input changes

WattsWise applies this approach to its power module: eligible input fields can be edited while related quantities are recalculated, avoiding repeated manual entry across isolated forms. The demonstration retained from the original article shows voltage, reactive power, and power-factor changes. Watch it with one question in mind: **when a value changes, which other quantities should move, and which assumptions must stay put?** That simple test separates a connected workflow from a screen that merely changes numbers.

![Original animated demonstration of the WattsWise power module as related input variables change.](/blog/assets/power/power-demo.gif)

*Original product demonstration retained from the legacy article. The current interface may differ; the animation illustrates a workflow rather than providing independent validation of calculation accuracy.*

The benefit is not that verification disappears. It is that attention can move to the checks that matter. For example, the same engineer can now inspect: selected voltage, load type, efficiency, and the parameter the calculation is supposed to preserve. The [story behind WattsWise's first release](/articles/en/from-spreadsheets-to-wattswise-in-216-hours/) explains why connecting these calculations became as important as implementing each formula.

## Where the triangle stops telling the whole story

There is an important boundary. When harmonic distortion enters the picture—from some electronic loads or variable-speed drives, for instance—the simple displacement angle is not the whole account. [Schneider Electric's technical documentation](https://product-help.schneider-electric.com/PowerLogic-ION9000/en-us/content/13-measurements/power-factor-pf.htm) distinguishes **true power factor**, which includes harmonic effects, from **displacement power factor**, which describes the fundamental component; its [explanation of distortion and displacement](https://blog.se.com/energy-management-energy-efficiency/2020/02/20/distortion-displacement-and-the-truth-understanding-true-power-factor/) warns against treating them as interchangeable when evaluating correction.

`PF = P/S` remains the definition of true power factor, but equating it directly to `cos φ` requires the appropriate sinusoidal conditions. A current estimate from the simplified triangle is also **not, by itself, a final conductor or protective-device design**: installation method, demand, duty cycle, and applicable codes still matter. A useful calculator makes the arithmetic faster; sound engineering keeps its assumptions open to inspection.

## One equation, fewer repeated decisions

The power triangle fits on a page. The decisions around it do not. When a schedule provides kVA, a measurement delivers amps, or a motor rating forces a distinction between mechanical output and electrical input, the valuable skill is not memorizing another formula. It is **starting with what is known without losing what each number means**.

That is where bidirectional analysis earns its place: fewer handoffs, connected calculations, and more attention for the judgments no calculator should make on an engineer's behalf. Here is a useful way to evaluate any tool: **does it help verify assumptions, or does it simply produce more numbers?**

Readers who want to see the idea applied can [explore WattsWise](/wattswise/) and compare the experience with their existing workflow. The question worth asking is not how many formulas a tool knows, but how many times it makes people rebuild the same calculation.
