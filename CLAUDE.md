# Prelude Details — Profitability Dashboard

## Design Context

### Users
Contractors and trades professionals reviewing job profitability after completion. They're typically on-site or in the office at end of day/week, scanning numbers quickly to understand if a job made money. They need clarity at a glance — not deep analytical tools. Time is scarce, attention is split.

### Brand Personality
**Warm, grounded, clear** — approachable but serious. The interface should feel like a trusted tool that respects the user's time. Not flashy, not clinical. Think Notion meets Basecamp: structured but human.

### Aesthetic Direction
- **Visual tone:** Subtle gradients with depth — soft gradient fills, layered cards with shadow, polished SaaS feel
- **References:** Stripe Dashboard (gradient chart fills, soft shadows, polished data viz), Linear Insights (clean charts, monochrome with accent colors, tight spacing)
- **Anti-references:** Overly playful dashboards, dark-mode-first analytics tools, dense enterprise BI (Grafana, Tableau)
- **Theme:** Light mode, warm neutrals (`#f5f4f0` canvas, `#e8e7e2` borders), system font stack
- **Color palette:** Warm neutrals as base. Blues for revenue/primary data. Amber/gold for costs. Green for positive profit, red for negative. Muted tones — never neon.

### Design Principles

1. **Glanceable over explorable** — A contractor scanning margins after a job should get the answer in under 2 seconds. Lead with the number, support with context.

2. **Warmth through restraint** — Warm neutrals, generous spacing, subtle depth. No heavy borders, no dense grids, no competing colors. Let the data breathe.

3. **Gradient as meaning, not decoration** — Gradients should reinforce data hierarchy (lighter = estimated, deeper = actual) or create subtle depth on cards. Never purely cosmetic.

4. **Polish compounds invisibly** — Rounded corners, consistent spacing, staggered entrances, proper easing. Each detail is invisible alone but the aggregate creates trust.

5. **Stripe-grade data viz** — Charts should feel premium: gradient fills, soft label typography, clean gridlines, no chartjunk. Every pixel of a chart should earn its place.
