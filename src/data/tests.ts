import type { Section } from './skills';

export type ModuleDef = { questionIds: string[]; minutes: number };
export type SectionDef = { section: Section; m1: ModuleDef; easy: ModuleDef; hard: ModuleDef };

/** Adaptive diagnostic: per section, Module 1 then an easier or harder Module 2. */
export const diagnostic: { id: string; sections: SectionDef[] } = {
  id: 'diagnostic-a',
  sections: [
    {
      section: 'rw',
      m1: { questionIds: ['rw01', 'rw02', 'rw03', 'rw04', 'rw05', 'rw06', 'rw07'], minutes: 9 },
      easy: { questionIds: ['rw08', 'rw09', 'rw10', 'rw11', 'rw12', 'rw13', 'rw14'], minutes: 9 },
      hard: { questionIds: ['rw15', 'rw16', 'rw17', 'rw18', 'rw19', 'rw20', 'rw21'], minutes: 9 },
    },
    {
      section: 'math',
      m1: { questionIds: ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07'], minutes: 11 },
      easy: { questionIds: ['m08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14'], minutes: 11 },
      hard: { questionIds: ['m15', 'm16', 'm17', 'm18', 'm19', 'm20', 'm21'], minutes: 11 },
    },
  ],
};
