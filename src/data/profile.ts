const CAREER_START_YEAR = 2002

export function getYearsInSoftware(): number {
  return new Date().getFullYear() - CAREER_START_YEAR
}
