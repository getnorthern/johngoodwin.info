export interface TestimonialSlot {
  quote: string
  name: string
  role: string
}

// Trimmed from LinkedIn recommendations — light editing for length only,
// no meaning changed. Full versions kept in reference/ if ever needed.
export const testimonials: TestimonialSlot[] = [
  {
    quote:
      'He thinks clearly, weighs the options properly, and commits to a path with confidence - something steady for the people around him to rally behind. He communicates with a clarity that removes ambiguity and keeps everyone aligned.',
    name: 'Lee Smith',
    role: 'CTO - managed John at CAVU',
  },
  {
    quote:
      "Where John shines is his maturity as a leader, his understanding of people, and his willingness to do right by his teams no matter what it takes. Together we took a couple of in-house teams to nearly 16 squads and 120+ engineers, and rebuilt our flagship platform from the ground up.",
    name: 'Yunus Simjee',
    role: 'Head of Engineering, CAVU - worked alongside John',
  },
  {
    quote:
      "He created a safe space to ask questions and fail, and helped me see growth opportunities I couldn't spot myself. He took a chance on me moving from Senior Engineer to Tech Lead, and taught me the delegation and trade-off habits that actually stuck.",
    name: 'Pete Fletcher',
    role: 'Engineering Lead - reported to John at CAVU',
  },
  {
    quote:
      "He was our first fully remote hire, joining right as Covid hit, and it's a testament to his friendly, genuinely likeable nature that he integrated into the team so effortlessly. My only regret? That we never made the ski trip happen.",
    name: 'Sonia Lamb',
    role: 'Product & Delivery Consultant - worked with John for five years',
  },
]
