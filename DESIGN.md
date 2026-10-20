# Portfolio design

The identity is Silver and sapphire, selected through live palette comparisons on 2026-10-19. Preserve the factual project content, diagrams, notes-paper thumbnail, and interactive walkthroughs.

## Visual hierarchy
- DM Sans carries titles and readable body text. Instrument Serif italic supplies contrast in the hero and closing invitation.
- Open case studies use horizontal separators instead of enclosing cards. Desktop project names and descriptions share a two-column header; previews and written context sit side by side below.
- Light theme uses a cool silver canvas (#edf1f5), pale surfaces (#fafcff), and sapphire emphasis (#1f64bd). Dark theme uses ink (#121c28), slate surfaces (#1c2a3b), and pale sapphire emphasis (#aad9ff).
- Generous space separates major sections; related title, provenance, tags, and description stay close.
- Section headings stand alone without redundant eyebrows or numbered decoration.

## Implementation
`dist/editorial.css` controls composition. `dist/palette.css` is the final semantic color layer, after the base, walkthrough and editorial styles. It applies the chosen palette to all sections and application previews. Logos retain brand colors and charts retain distinct series colors.

Container: 1248px maximum, responsive 48/32/22px gutters. Section spacing: 112px desktop, 80px tablet, 64px mobile. Panels use 14px corners; case studies have no outer box.

## Behavior contracts
Keep theme persistence, floating navigation, hover/focus/tap tag explanations, progressive disclosures, two opposite logo loops with 9% hover growth, and reduced-motion support. Previews retain their half-width laptop layout and switch from illustration to looping animation on hover/focus. Phones retain explicit playback.

## Copy and terminology
Write for engineering leads and potential clients: explain the use case first, then Priyans’s contribution, then the technical approach. Keep professional contributions distinct from the personal/hackathon project. Use plain language in the hero and explain technical terms in the project tag tooltips. Keep architecture, authorization, observability, and evaluation details precise; do not add unverified results or metrics. The hero diagram follows task → agent → connected systems → answer/action. Project illustrations and animation markup remain unchanged by the copy pass.

## Walkthrough details
Customer Copilot’s before scene shows the call beside manual documentation search and answering, with no live transcript. Its after scene retains live transcripts and AI guidance. The notes summary appears sequentially: a short overview, bullet points, then the latest update and next action; completion labels reflect the end of generation. Hero integration icons use connected services and an application window.

## Accessibility polish
Tool rows pause on hover or keyboard focus. There is no global motion toggle or stored pause preference. Device reduced-motion settings remain supported. Desktop previews autoplay on project hover/focus, with Pause/Resume and Show thumbnail controls revealed only over an active preview or while its controls have keyboard focus. Mobile playback controls retain their existing behavior. Explicit playback remains available as a single run without typewriter motion. Main controls use 44px targets; compact chart controls use at least 28px targets. Wordmarks retain natural proportions and meaningful accessible names. Captions use opaque semantic text colors.
