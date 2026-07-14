export interface WorkItem {
  title: string
  body: string
}

export const selectedWork: WorkItem[] = [
  {
    title: 'Eleven platforms, one white label',
    body: "CAVU ran eleven separate airport booking platforms, each built up over years by a different team, each with its own codebase, its own quirks, its own release process. None of that showed up to someone booking a car park space or a fast-track pass, but it meant eleven times the maintenance and no shared view of what was actually working. We rebuilt them into a single white-label platform - one codebase, one deployment pipeline - and migrated live booking traffic across, airport by airport, without a noticeable outage. It's since been adopted by airports internationally, turning what started as an internal clean-up into a product other airports actually want to buy. The hardest part wasn't the code - it was convincing stakeholders the new platform would outperform the originals on the things that mattered: cost, maintenance, accessibility, speed.",
  },
  {
    title: 'When the open-source model stopped working',
    body: "Front-end and back-end teams had drifted into separate silos - different standups, code thrown over a wall. We moved to an internal open-source model so any engineer could contribute to any part of the codebase, held to the same review bar you'd expect from a public repo. For a while it worked. Then we noticed engineers weren't owning any one part of the system anymore, and the deep expertise that used to sit with a team was quietly draining away. So we changed course: domain-driven teams, each owning a clear slice of the platform end to end. Admitting a model I'd championed wasn't working was uncomfortable. Changing it anyway was the job.",
  },
  {
    title: 'A career framework people actually use',
    body: "Most career frameworks get written once and left to rot in a wiki. We built ours with the engineers who'd have to live inside it - clear levels, real examples of what \"senior\" looks like day to day, and a direct link to mentorship and learning. It's one of the reasons people stay.",
  },
  {
    title: 'Bringing AI into delivery without the hype cycle',
    body: "GitHub Copilot and Claude were already showing up in people's workflows whether I set direction or not, so I chose to set direction. We built guidelines for where AI assistance actually helps, then went further - AI-assisted incident management and documentation agents cut incident resolution times by more than 60%. Adoption became a deliberate choice, not something that just happened.",
  },
]
