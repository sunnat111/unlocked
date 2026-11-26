export type Section = 'rw' | 'math';

export const skills = {
  // Reading & Writing
  'central-ideas': { section: 'rw', domain: 'Information and Ideas', name: 'Central Ideas and Details' },
  'command-of-evidence': { section: 'rw', domain: 'Information and Ideas', name: 'Command of Evidence' },
  inferences: { section: 'rw', domain: 'Information and Ideas', name: 'Inferences' },
  'words-in-context': { section: 'rw', domain: 'Craft and Structure', name: 'Words in Context' },
  'text-structure': { section: 'rw', domain: 'Craft and Structure', name: 'Text Structure and Purpose' },
  transitions: { section: 'rw', domain: 'Expression of Ideas', name: 'Transitions' },
  'rhetorical-synthesis': { section: 'rw', domain: 'Expression of Ideas', name: 'Rhetorical Synthesis' },
  boundaries: { section: 'rw', domain: 'Standard English Conventions', name: 'Boundaries' },
  'form-structure-sense': { section: 'rw', domain: 'Standard English Conventions', name: 'Form, Structure, and Sense' },
  // Math
  'linear-equations': { section: 'math', domain: 'Algebra', name: 'Linear Equations' },
  'linear-functions': { section: 'math', domain: 'Algebra', name: 'Linear Functions' },
  'linear-inequalities': { section: 'math', domain: 'Algebra', name: 'Linear Inequalities' },
  systems: { section: 'math', domain: 'Algebra', name: 'Systems of Linear Equations' },
  'equivalent-expressions': { section: 'math', domain: 'Advanced Math', name: 'Equivalent Expressions' },
  'nonlinear-equations': { section: 'math', domain: 'Advanced Math', name: 'Nonlinear Equations' },
  'nonlinear-functions': { section: 'math', domain: 'Advanced Math', name: 'Nonlinear Functions' },
  ratios: { section: 'math', domain: 'Problem-Solving and Data Analysis', name: 'Ratios, Rates, and Percentages' },
  statistics: { section: 'math', domain: 'Problem-Solving and Data Analysis', name: 'Statistics' },
  probability: { section: 'math', domain: 'Problem-Solving and Data Analysis', name: 'Probability' },
  'area-volume': { section: 'math', domain: 'Geometry and Trigonometry', name: 'Area and Volume' },
  'lines-angles-triangles': { section: 'math', domain: 'Geometry and Trigonometry', name: 'Lines, Angles, and Triangles' },
  'right-triangles-trig': { section: 'math', domain: 'Geometry and Trigonometry', name: 'Right Triangles and Trigonometry' },
  circles: { section: 'math', domain: 'Geometry and Trigonometry', name: 'Circles' },
} as const satisfies Record<string, { section: Section; domain: string; name: string }>;

export type SkillId = keyof typeof skills;

export const skillIds = Object.keys(skills) as SkillId[];
export const skillsBySection = (s: Section) => skillIds.filter((id) => skills[id].section === s);
