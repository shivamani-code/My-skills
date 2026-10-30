---
name: motion-design-principles
description: "Motion design for UI and cinematic web: Disney principles translated to interfaces, easing/duration vocabulary, choreography and stagger, staging the eye, scroll pacing, and reduced-motion. Use when animations feel robotic, busy, floaty, or random."
---
# Motion design principles

Animation is direction of attention. Good motion is felt, not noticed; bad motion is random speed and everything moving at once.

## File
- `easings.css`: the only curves and durations to use (CSS vars + GSAP names).

## Disney principles, for screens
1. Staging: one thing moves at a time; the moving thing is the thing that matters. Dim/hold the rest.
2. Anticipation: a 3-6% pull back before a big move (button scales to 0.96 before launching a transition).
3. Slow in / slow out: never `linear` for UI (linear only for scroll-scrubbed timelines and spinning).
4. Follow-through & overlap: children finish 60-120 ms after the parent (stagger), letters after the line.
5. Arcs: things travel on curves (offset x and y with different eases), not straight diagonals.
6. Squash & stretch: velocity stretch on type, press squash on buttons. Subtle: <= 10%.
7. Secondary action: grain, embers, slow drift keep a still frame alive.
8. Timing: small things fast (150-300 ms), big things slower (700-1200 ms). Distance up => duration up, slightly.
9. Exaggeration: once per page, at THE CUT (flash + shake + scale). Everywhere else restraint.
10. Appeal: consistent vocabulary; the same curve for the same kind of event everywhere.

## Choreography steps
1. List the events per screen (enter, idle, interact, exit).
2. Order them: what does the eye see first? Headline -> subject -> CTA. Delay others behind it.
3. Assign from the vocabulary: entrances `expo.out`, exits `expo.in` and ~30% shorter, state moves `inOut`.
4. Stagger groups (letters 30-50 ms, list items 80-120 ms). Cap total stagger at ~600 ms.
5. Scroll pacing: give each beat ~100vh of scroll; holds (nothing changes) of 30-50vh after big moments so they land.
6. Test at 0.25x speed (Chrome DevTools Animations panel) and on the phone.

## Budget
- Animate transform/opacity/clip-path only. Max ~3 simultaneous moving groups on a phone.
- Never animate on load for more than 1.5 s before content is usable.

## Pitfalls
- Everything fades up 40px on scroll: generic template look. Vary: masks, scale, clip-path wipes, depth.
- Bouncy overshoot on big elements: looks cheap. Back-ease only on small UI.
- Parallax on every layer: motion sickness. 2-3 layers max.
- Reduced motion: replace movement with opacity crossfades (<= 200 ms), never remove feedback entirely.
