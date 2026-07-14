import { getYearsInSoftware } from './profile'

export interface Highlight {
  value: string
  label: string
}

export const highlights: Highlight[] = [
  { value: String(getYearsInSoftware()), label: 'years in software' },
  { value: '10→120', label: 'engineers grown at CAVU' },
  { value: '16', label: 'squads across international products' },
  { value: '11', label: 'booking platforms consolidated into one white label' },
]
