const CAREER_START_YEAR = 2002

export function getYearsInSoftware(): number {
  return new Date().getFullYear() - CAREER_START_YEAR
}

export function getHeroTagline(): string {
  return `${getYearsInSoftware()} years in software, the last three spent turning a small engineering team into one that can carry real weight - 120 people, sixteen squads, systems that can't afford to go down. I lead with trust over process, and I care as much about the leaders I grow as the platforms we ship.`
}
