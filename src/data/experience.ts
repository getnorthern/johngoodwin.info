export interface TimelineEntry {
  period: string
  role: string
}

export const careerStoryParagraphs: string[] = [
  "I didn't come up through a bootcamp, computer science degree or a graduate scheme - just night classes in web development, which got me a determined foot in the door as a web designer at a building society in 2002. I learned HTML by taking other people's sites apart, and worked my way through agencies, a medical education company and a mortgage startup before landing in travel tech.",
  "That's probably why I still care about the work itself, not just the org chart. I've written the code, broken the build, sat in the incident channel at 2am. When I ask an engineering team to do something, I'm not guessing at what it costs them.",
]

export const timeline: TimelineEntry[] = [
  { period: '2002', role: 'Web Designer, Cheshire Building Society' },
  { period: '2008–2017', role: 'Web design and front-end roles across agency and product work' },
  { period: '2017–2020', role: 'Senior Developer / Squad Lead, Mojo Mortgages' },
  { period: '2020–2023', role: 'Senior UI Engineer → Technical Lead, Manchester Airports Group Online / CAVU' },
  { period: '2023–Present', role: 'Head of Engineering, CAVU (Manchester Airports Group)' },
]
