// Original SAT-style questions written for Unlocked SAT. Not College Board material.
import type { Section, SkillId } from './skills';

export type Difficulty = 1 | 2 | 3;

export type Question = {
  id: string;
  section: Section;
  skill: SkillId;
  difficulty: Difficulty;
  passage?: string;
  prompt: string;
  /** Multiple choice: four options, `answer` is the index. */
  choices?: [string, string, string, string];
  answer: number;
  /** Student-produced response: accepted numeric values (answer is ignored). */
  accept?: number[];
  explanation: string;
};

const WIC = 'Which choice completes the text with the most logical and precise word or phrase?';
const SEC = 'Which choice completes the text so that it conforms to the conventions of Standard English?';
const TRN = 'Which choice completes the text with the most logical transition?';
const MAIN = 'Which choice best states the main idea of the text?';
const LOG = 'Which choice most logically completes the text?';

export const questions: Question[] = [
  // ───────────── Reading & Writing ─────────────
  {
    id: 'rw01', section: 'rw', skill: 'words-in-context', difficulty: 1,
    passage: 'The new community library was designed to be ______: its reading rooms, study spaces, and children’s area can all be rearranged within an hour to host lectures, workshops, or exhibitions.',
    prompt: WIC, choices: ['adaptable', 'fragile', 'obscure', 'permanent'], answer: 0,
    explanation: 'The colon introduces evidence that the spaces can be quickly rearranged for different uses. “Adaptable” (able to change for new purposes) matches. Nothing suggests the building is fragile, hard to find (obscure), or unchanging (permanent).',
  },
  {
    id: 'rw02', section: 'rw', skill: 'boundaries', difficulty: 1,
    passage: 'Samarkand’s Registan square is framed by three madrasas, the oldest ______ completed in 1420 under the patronage of Ulugh Beg.',
    prompt: SEC, choices: ['of which was', 'of which, was', 'which was', 'of which; was'], answer: 0,
    explanation: '“The oldest of which was completed…” is a correct relative phrase that describes the madrasas. No punctuation belongs between the subject (“the oldest of which”) and its verb (“was”). “Which was” alone would not make sense after “the oldest.”',
  },
  {
    id: 'rw03', section: 'rw', skill: 'transitions', difficulty: 2,
    passage: 'Desert plants often store water in thick, fleshy leaves. ______ the aloe vera plant can survive several months without rain by drawing on the gel stored inside its leaves.',
    prompt: TRN, choices: ['For example,', 'However,', 'In contrast,', 'Nevertheless,'], answer: 0,
    explanation: 'The second sentence gives a specific case (aloe vera) of the general claim in the first sentence, so “For example” is the logical transition. The other choices signal contrast, which is not present.',
  },
  {
    id: 'rw04', section: 'rw', skill: 'central-ideas', difficulty: 2,
    passage: 'An economist studied small family shops in Tashkent that began accepting mobile payments. She found that, within a year, these shops attracted noticeably more customers under the age of thirty than similar shops that accepted only cash, while their sales to older customers stayed about the same. She suggests that offering mobile payment may help shops reach younger shoppers without losing older ones.',
    prompt: MAIN,
    choices: [
      'Adding mobile payments may help small shops gain younger customers while keeping older ones.',
      'Older customers in Tashkent refuse to use mobile payments.',
      'Most small family shops in Tashkent now accept only mobile payments.',
      'Shops that accept only cash earn more than shops that accept mobile payments.',
    ],
    answer: 0,
    explanation: 'The text reports more young customers and unchanged sales to older customers, and ends with the economist’s conclusion that mobile payment can attract younger shoppers without losing older ones. The other choices make claims the text never supports.',
  },
  {
    id: 'rw05', section: 'rw', skill: 'form-structure-sense', difficulty: 2,
    passage: 'The collection of handwritten letters, which spans more than four decades of the poet’s life, ______ now available to researchers in digitized form.',
    prompt: SEC, choices: ['is', 'are', 'were', 'have been'], answer: 0,
    explanation: 'The subject is the singular noun “collection,” not “letters.” A singular subject needs the singular verb “is.” The phrase “of handwritten letters” and the clause between commas do not change the subject.',
  },
  {
    id: 'rw06', section: 'rw', skill: 'inferences', difficulty: 3,
    passage: 'When honeybees find a rich source of food, they return to the hive and perform a “waggle dance” that signals the food’s direction and distance to other bees. Researchers observed that in hives where bees could not perceive the dance—because the hive was kept dark and the dancers’ vibrations were blocked—foragers took much longer to find new food sources. This suggests that ______',
    prompt: LOG,
    choices: [
      'the waggle dance helps other bees locate food more efficiently.',
      'honeybees cannot find food without light.',
      'bees that perform the waggle dance gather more food than other bees.',
      'the distance to food has no effect on how bees dance.',
    ],
    answer: 0,
    explanation: 'When bees could not perceive the dance, finding food took longer. The logical conclusion is that the dance helps bees find food faster. The bees still found food, so “cannot find food without light” goes too far, and nothing compares dancers with non-dancers.',
  },
  {
    id: 'rw07', section: 'rw', skill: 'rhetorical-synthesis', difficulty: 3,
    passage: 'While researching a topic, a student has taken the following notes:\n• The Aral Sea was once the fourth-largest lake in the world.\n• Beginning in the 1960s, rivers feeding the sea were diverted to irrigate cotton fields.\n• By 2010, the sea had shrunk to roughly 10% of its original area.\n• The Kokaral Dam, completed in 2005, helped the northern part of the sea partially recover.',
    prompt: 'The student wants to emphasize a hopeful development. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'After the Kokaral Dam was completed in 2005, the northern part of the Aral Sea partially recovered.',
      'The Aral Sea, once the fourth-largest lake in the world, had shrunk to about 10% of its original area by 2010.',
      'Beginning in the 1960s, rivers feeding the Aral Sea were diverted to irrigate cotton fields.',
      'The Aral Sea was once the fourth-largest lake in the world.',
    ],
    answer: 0,
    explanation: 'Only the partial recovery of the northern sea after the dam is a hopeful development. The other choices describe the lake’s former size or its decline.',
  },
  {
    id: 'rw08', section: 'rw', skill: 'words-in-context', difficulty: 1,
    passage: 'Because the bridge was closed for repairs, drivers had to take a ______ route that added twenty minutes to their trip.',
    prompt: WIC, choices: ['direct', 'roundabout', 'brief', 'familiar'], answer: 1,
    explanation: 'A route that adds twenty minutes is indirect, or “roundabout.” “Direct” and “brief” contradict the extra time, and nothing indicates the route was familiar.',
  },
  {
    id: 'rw09', section: 'rw', skill: 'boundaries', difficulty: 1,
    passage: 'Apricots are grown in many countries, but world production is led by a small ______ Turkey, Uzbekistan, and Iran are consistently among the largest producers.',
    prompt: SEC, choices: ['group:', 'group', 'group,', 'group and'], answer: 0,
    explanation: 'Both parts are complete sentences, and the second explains which countries form the group. A colon correctly joins them. No punctuation or a comma alone would create a run-on or comma splice.',
  },
  {
    id: 'rw10', section: 'rw', skill: 'transitions', difficulty: 1,
    passage: 'Madina wanted to see the sunrise from the top of the mountain. ______ she set her alarm for 4:00 a.m.',
    prompt: TRN, choices: ['Therefore,', 'However,', 'Instead,', 'Similarly,'], answer: 0,
    explanation: 'Setting the alarm early is a result of wanting to see the sunrise, so “Therefore” shows the cause-and-effect relationship.',
  },
  {
    id: 'rw11', section: 'rw', skill: 'central-ideas', difficulty: 2,
    passage: 'Many people assume that the best way to memorize information is to reread it several times. However, studies of learning have repeatedly found that testing yourself—trying to recall information without looking—leads to better long-term memory than rereading does. This “testing effect” appears even when the self-tests are short and when learners get some answers wrong.',
    prompt: MAIN,
    choices: [
      'Testing yourself tends to improve long-term memory more than rereading does.',
      'Learners should avoid getting answers wrong on practice tests.',
      'Rereading is the most popular study method because it is effective.',
      'Short tests are less useful than long tests.',
    ],
    answer: 0,
    explanation: 'The text challenges the assumption about rereading and reports that self-testing produces better long-term memory. The other choices contradict the text or are not discussed.',
  },
  {
    id: 'rw12', section: 'rw', skill: 'form-structure-sense', difficulty: 2,
    passage: 'Last summer, a team of student volunteers ______ more than two hundred trees around their school.',
    prompt: SEC, choices: ['plants', 'will plant', 'planted', 'is planting'], answer: 2,
    explanation: '“Last summer” places the action in the past, so the past-tense verb “planted” is required.',
  },
  {
    id: 'rw13', section: 'rw', skill: 'command-of-evidence', difficulty: 2,
    passage: 'A student claims that octopuses are capable of solving problems.',
    prompt: 'Which finding, if true, would most directly support the student’s claim?',
    choices: [
      'In experiments, octopuses learned to unscrew jar lids to reach food inside.',
      'Octopuses have three hearts.',
      'Some species of octopus live for only about a year.',
      'Octopuses can change the color of their skin.',
    ],
    answer: 0,
    explanation: 'Unscrewing a lid to reach food is an example of solving a problem. The other facts are true of many octopuses but say nothing about problem-solving.',
  },
  {
    id: 'rw14', section: 'rw', skill: 'text-structure', difficulty: 2,
    passage: 'Aziz had practised the piece for months, yet when he sat down at the piano in front of the audience, his hands felt like someone else’s. He looked at the keys as if seeing them for the first time. Then he remembered his teacher’s advice—play the first note for yourself, not for the room—and pressed down.',
    prompt: 'Which choice best describes the overall structure of the text?',
    choices: [
      'It describes a character’s sudden nervousness and then a memory that helps him begin.',
      'It explains why a character decided to stop playing the piano.',
      'It compares two teachers’ different methods for performing.',
      'It describes an audience’s reaction to a performance.',
    ],
    answer: 0,
    explanation: 'The text first shows Aziz feeling unfamiliar with his own hands (nervousness), then he recalls advice and starts playing. Only one teacher is mentioned and the audience’s reaction is not described.',
  },
  {
    id: 'rw15', section: 'rw', skill: 'words-in-context', difficulty: 3,
    passage: 'Although critics initially dismissed the architect’s design as merely ______, later scholars recognized that its plain surfaces and simple forms reflected a carefully reasoned philosophy rather than a lack of imagination.',
    prompt: WIC, choices: ['austere', 'extravagant', 'ornate', 'chaotic'], answer: 0,
    explanation: 'The design had “plain surfaces and simple forms,” and critics saw this as a lack of imagination. “Austere” means severely plain. “Extravagant” and “ornate” mean the opposite, and “chaotic” does not fit simple forms.',
  },
  {
    id: 'rw16', section: 'rw', skill: 'boundaries', difficulty: 2,
    passage: 'The physicist Lise Meitner, who helped explain nuclear fission in ______ was long overlooked when the discovery was honored.',
    prompt: SEC, choices: ['1938,', '1938;', '1938', '1938:'], answer: 0,
    explanation: 'The clause “who helped explain nuclear fission in 1938” is extra information set off by a comma before it, so it must be closed by a comma after it before the main verb “was.”',
  },
  {
    id: 'rw17', section: 'rw', skill: 'inferences', difficulty: 3,
    passage: 'Historians once pictured the Silk Road as a single route along which merchants carried goods from China all the way to Europe. However, studies of trade records and archaeological sites show that most merchants traveled only short segments, exchanging goods with other traders in cities such as Samarkand and Bukhara, who then carried them farther. Therefore, ______',
    prompt: LOG,
    choices: [
      'the movement of goods across Eurasia likely depended on networks of many traders rather than on individual merchants making the entire journey.',
      'few goods from China ever reached Europe.',
      'Samarkand and Bukhara were founded by merchants from Europe.',
      'historians no longer study trade along the Silk Road.',
    ],
    answer: 0,
    explanation: 'If most merchants traveled only short segments and passed goods on, long-distance trade must have relied on chains of many traders. The text does not say goods failed to reach Europe or who founded the cities.',
  },
  {
    id: 'rw18', section: 'rw', skill: 'transitions', difficulty: 3,
    passage: 'Most fish rely heavily on vision to find food. The blind cave form of the Mexican tetra, ______ has lost its functional eyes and instead detects prey with sensitive cells along its body that sense movement in the water.',
    prompt: TRN, choices: ['by contrast,', 'for example,', 'similarly,', 'as a result,'], answer: 0,
    explanation: 'The cave fish does the opposite of what “most fish” do: it does not use vision. “By contrast” signals this difference. “For example” and “similarly” would wrongly suggest it follows the general pattern.',
  },
  {
    id: 'rw19', section: 'rw', skill: 'rhetorical-synthesis', difficulty: 3,
    passage: 'While researching a topic, a student has taken the following notes:\n• Muhammad ibn Musa al-Khwarizmi was a 9th-century scholar from Khwarazm, a region in present-day Uzbekistan and Turkmenistan.\n• He worked at the House of Wisdom in Baghdad.\n• The title of his book on solving equations gave us the word “algebra.”\n• The word “algorithm” comes from the Latin form of his name.',
    prompt: 'The student wants to explain how al-Khwarizmi influenced modern vocabulary. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    choices: [
      'Two common words in mathematics come from al-Khwarizmi: “algebra,” from the title of his book on equations, and “algorithm,” from the Latin form of his name.',
      'Al-Khwarizmi, a 9th-century scholar, worked at the House of Wisdom in Baghdad.',
      'Al-Khwarizmi came from Khwarazm, a region in present-day Uzbekistan and Turkmenistan.',
      'Al-Khwarizmi was a scholar who wrote a book on solving equations.',
    ],
    answer: 0,
    explanation: 'Only the correct choice mentions the words “algebra” and “algorithm,” which is what the goal (influence on vocabulary) requires.',
  },
  {
    id: 'rw20', section: 'rw', skill: 'form-structure-sense', difficulty: 3,
    passage: 'Each of the twelve competing robotics teams had to present ______ design to a panel of engineers before the final round.',
    prompt: SEC, choices: ['its', 'their', 'it’s', 'they’re'], answer: 0,
    explanation: 'The subject is “Each,” which is singular, so the singular possessive pronoun “its” is needed. “It’s” means “it is,” and “their”/“they’re” are plural.',
  },
  {
    id: 'rw21', section: 'rw', skill: 'command-of-evidence', difficulty: 3,
    passage: 'In a survey of 400 students, those who read for pleasure at least 30 minutes a day scored an average of 72 points on a vocabulary test, while those who read less scored an average of 58 points. Based on these results, a student concludes that reading for pleasure causes vocabulary to grow.',
    prompt: 'Which choice best describes a weakness in the student’s conclusion?',
    choices: [
      'The survey shows a relationship between reading and vocabulary scores but does not show that reading caused the difference.',
      'The survey included too many students to give reliable results.',
      'The vocabulary scores of the two groups were the same.',
      'The survey measured reading time in minutes rather than in hours.',
    ],
    answer: 0,
    explanation: 'A survey can show that two things occur together (correlation) but not that one causes the other — students with large vocabularies might simply enjoy reading more. The other choices are false or irrelevant.',
  },
  {
    id: 'rw22', section: 'rw', skill: 'words-in-context', difficulty: 1,
    passage: 'The scientist’s notes were so ______ that other researchers could repeat her experiment exactly, step by step.',
    prompt: WIC, choices: ['meticulous', 'careless', 'brief', 'secretive'], answer: 0,
    explanation: 'Notes that allow others to repeat an experiment step by step must be extremely careful and detailed — “meticulous.”',
  },
  {
    id: 'rw23', section: 'rw', skill: 'boundaries', difficulty: 2,
    passage: 'The museum’s newest exhibit features three kinds of ______ ceramics, textiles, and metalwork from across Central Asia.',
    prompt: SEC, choices: ['objects:', 'objects;', 'objects, and', 'objects'], answer: 0,
    explanation: 'A colon after a complete clause can introduce a list that explains it (“three kinds of objects: ceramics, textiles, and metalwork”). A semicolon must join two complete clauses, which is not the case here.',
  },
  {
    id: 'rw24', section: 'rw', skill: 'transitions', difficulty: 2,
    passage: 'The first version of the app was slow and difficult to use. ______ the developers spent six months redesigning it based on feedback from users.',
    prompt: TRN, choices: ['Consequently,', 'Nonetheless,', 'For instance,', 'Likewise,'], answer: 0,
    explanation: 'The redesign happened because the first version had problems, so the cause-and-effect transition “Consequently” fits.',
  },
  {
    id: 'rw25', section: 'rw', skill: 'form-structure-sense', difficulty: 2,
    passage: 'Neither the coach nor the players ______ expecting the storm to delay the match.',
    prompt: SEC, choices: ['was', 'were', 'is', 'has been'], answer: 1,
    explanation: 'With “neither…nor,” the verb agrees with the nearer subject, “players,” which is plural and in the past context: “were.”',
  },
  {
    id: 'rw26', section: 'rw', skill: 'words-in-context', difficulty: 3,
    passage: 'The diplomat’s statement was deliberately ______: it could be read either as support for the proposal or as a polite refusal, allowing her to avoid committing to a position.',
    prompt: WIC, choices: ['ambiguous', 'emphatic', 'hostile', 'redundant'], answer: 0,
    explanation: 'A statement that can be read two different ways is “ambiguous.” An emphatic statement would be clear and forceful, the opposite of what is described.',
  },
  {
    id: 'rw27', section: 'rw', skill: 'inferences', difficulty: 2,
    passage: 'Snow leopards live in the high mountain ranges of Central and South Asia, where prey is scarce. A single snow leopard may need a territory of hundreds of square kilometers to find enough food. Therefore, protecting snow leopard populations likely requires ______',
    prompt: LOG,
    choices: [
      'conserving very large areas of mountain habitat.',
      'moving snow leopards to lowland forests.',
      'increasing the number of snow leopards in each square kilometer.',
      'reducing the size of protected areas.',
    ],
    answer: 0,
    explanation: 'Because each animal needs a huge territory, protecting a population requires protecting large areas of its mountain habitat.',
  },
  {
    id: 'rw28', section: 'rw', skill: 'text-structure', difficulty: 3,
    passage: 'Some city planners argue that adding lanes to highways is the best way to reduce traffic. Yet studies in several countries have found that within a few years of new lanes opening, traffic often returns to its previous level, because the extra space encourages more people to drive. Researchers call this pattern “induced demand.”',
    prompt: 'Which choice best describes the function of the first sentence in the text as a whole?',
    choices: [
      'It presents a view that the rest of the text challenges.',
      'It summarizes the findings of the studies.',
      'It defines the term “induced demand.”',
      'It proposes a solution that the text supports.',
    ],
    answer: 0,
    explanation: 'The first sentence states the planners’ view; the word “Yet” introduces evidence against it. The studies and the definition come later.',
  },

  // ───────────── Math ─────────────
  {
    id: 'm01', section: 'math', skill: 'linear-equations', difficulty: 1,
    prompt: 'If 4x + 7 = 31, what is the value of x?', choices: ['4', '6', '8', '9.5'], answer: 1,
    explanation: 'Subtract 7 from both sides: 4x = 24. Divide by 4: x = 6.',
  },
  {
    id: 'm02', section: 'math', skill: 'ratios', difficulty: 1,
    prompt: 'A shirt originally costs 80,000 so‘m. It is on sale for 25% off. What is the sale price, in so‘m?',
    choices: ['20,000', '55,000', '60,000', '64,000'], answer: 2,
    explanation: '25% of 80,000 is 20,000. The sale price is 80,000 − 20,000 = 60,000 so‘m. (Or: 75% of 80,000 = 60,000.)',
  },
  {
    id: 'm03', section: 'math', skill: 'linear-functions', difficulty: 2,
    prompt: 'A taxi charges a fixed fee plus a constant cost per kilometer. A 4-kilometer ride costs 22,000 so‘m and a 10-kilometer ride costs 40,000 so‘m. What is the cost per kilometer, in so‘m?',
    answer: -1, accept: [3000],
    explanation: 'The extra 6 kilometers cost 40,000 − 22,000 = 18,000 so‘m, so each kilometer costs 18,000 ÷ 6 = 3,000 so‘m.',
  },
  {
    id: 'm04', section: 'math', skill: 'systems', difficulty: 2,
    prompt: 'x + y = 10\nx − y = 4\nIf (x, y) is the solution to the system of equations above, what is the value of xy?',
    choices: ['12', '21', '24', '28'], answer: 1,
    explanation: 'Add the equations: 2x = 14, so x = 7. Then y = 10 − 7 = 3, and xy = 21.',
  },
  {
    id: 'm05', section: 'math', skill: 'statistics', difficulty: 2,
    prompt: 'The mean of five numbers is 12. When a sixth number is added, the mean of the six numbers is 13. What is the sixth number?',
    answer: -1, accept: [18],
    explanation: 'The five numbers sum to 5 × 12 = 60. The six numbers sum to 6 × 13 = 78. The sixth number is 78 − 60 = 18.',
  },
  {
    id: 'm06', section: 'math', skill: 'nonlinear-equations', difficulty: 3,
    prompt: 'In the equation x² + bx + 36 = 0, b is a positive constant. If the equation has exactly one real solution, what is the value of b?',
    answer: -1, accept: [12],
    explanation: 'A quadratic has exactly one real solution when its discriminant is 0: b² − 4(1)(36) = 0, so b² = 144 and b = 12 (since b > 0).',
  },
  {
    id: 'm07', section: 'math', skill: 'right-triangles-trig', difficulty: 3,
    prompt: 'In right triangle ABC, angle C measures 90°. If sin A = 3/5, what is the value of tan B?',
    choices: ['3/5', '3/4', '4/5', '4/3'], answer: 3,
    explanation: 'sin A = 3/5 means the side opposite A is 3 and the hypotenuse is 5, so the remaining leg is 4. Angle B is opposite the side of length 4 and adjacent to the side of length 3, so tan B = 4/3.',
  },
  {
    id: 'm08', section: 'math', skill: 'linear-equations', difficulty: 1,
    prompt: 'What value of x satisfies the equation 2(x + 3) = 14?', choices: ['4', '5', '7', '8.5'], answer: 0,
    explanation: 'Divide both sides by 2: x + 3 = 7. Subtract 3: x = 4.',
  },
  {
    id: 'm09', section: 'math', skill: 'ratios', difficulty: 1,
    prompt: 'A recipe uses 3 cups of flour for every 2 cups of milk. How many cups of flour are needed for 8 cups of milk?',
    choices: ['10', '11', '12', '16'], answer: 2,
    explanation: '8 cups of milk is 4 times 2 cups, so the flour is 4 × 3 = 12 cups.',
  },
  {
    id: 'm10', section: 'math', skill: 'area-volume', difficulty: 1,
    prompt: 'A rectangle has a length of 12 centimeters and a width of 5 centimeters. What is the perimeter of the rectangle, in centimeters?',
    answer: -1, accept: [34],
    explanation: 'Perimeter = 2(length + width) = 2(12 + 5) = 34 cm.',
  },
  {
    id: 'm11', section: 'math', skill: 'linear-inequalities', difficulty: 2,
    prompt: 'Which of the following values of x is a solution to the inequality 5x − 3 > 17?', choices: ['2', '3', '4', '5'], answer: 3,
    explanation: 'Add 3: 5x > 20. Divide by 5: x > 4. Only 5 is greater than 4 (4 itself is not a solution because the inequality is strict).',
  },
  {
    id: 'm12', section: 'math', skill: 'equivalent-expressions', difficulty: 2,
    prompt: 'Which expression is equivalent to (x + 4)(x − 4)?', choices: ['x² − 16', 'x² + 16', 'x² − 8x − 16', 'x² − 8'], answer: 0,
    explanation: 'This is a difference of squares: (x + 4)(x − 4) = x² − 4x + 4x − 16 = x² − 16.',
  },
  {
    id: 'm13', section: 'math', skill: 'probability', difficulty: 2,
    prompt: 'A bag contains 6 red marbles, 4 blue marbles, and 10 green marbles. If one marble is chosen at random, what is the probability that it is blue?',
    choices: ['1/4', '1/5', '1/3', '2/5'], answer: 1,
    explanation: 'There are 6 + 4 + 10 = 20 marbles, and 4 are blue. The probability is 4/20 = 1/5.',
  },
  {
    id: 'm14', section: 'math', skill: 'lines-angles-triangles', difficulty: 2,
    prompt: 'Two angles of a triangle measure 48° and 67°. What is the measure, in degrees, of the third angle?',
    answer: -1, accept: [65],
    explanation: 'The angles of a triangle sum to 180°: 180 − 48 − 67 = 65.',
  },
  {
    id: 'm15', section: 'math', skill: 'circles', difficulty: 2,
    prompt: 'A circle in the xy-plane has the equation (x − 3)² + (y + 2)² = 25. Which of the following points lies on the circle?',
    choices: ['(3, −2)', '(6, 2)', '(8, 3)', '(0, 0)'], answer: 1,
    explanation: 'Substitute each point. For (6, 2): (6 − 3)² + (2 + 2)² = 9 + 16 = 25 ✓. The point (3, −2) is the center, (8, 3) gives 50, and (0, 0) gives 13.',
  },
  {
    id: 'm16', section: 'math', skill: 'linear-functions', difficulty: 2,
    prompt: 'Line ℓ passes through the points (1, 5) and (4, 14). What is the y-coordinate of the y-intercept of line ℓ?',
    answer: -1, accept: [2],
    explanation: 'Slope = (14 − 5)/(4 − 1) = 3. Using y = 3x + b with (1, 5): 5 = 3 + b, so b = 2.',
  },
  {
    id: 'm17', section: 'math', skill: 'nonlinear-functions', difficulty: 3,
    prompt: 'The population of a town is modeled by P(t) = 20,000(1.05)ᵗ, where t is the number of years after 2020. Which statement is true according to the model?',
    choices: [
      'The population increases by 5% each year.',
      'The population increases by 1,050 people each year.',
      'The population increases by 105% each year.',
      'The population was 21,000 in 2020.',
    ],
    answer: 0,
    explanation: 'A growth factor of 1.05 means each year the population is multiplied by 1.05 — a 5% increase. In 2020 (t = 0) the population was 20,000.',
  },
  {
    id: 'm18', section: 'math', skill: 'systems', difficulty: 3,
    prompt: '3x + 2y = 7\n6x + ky = 10\nIn the system of equations above, k is a constant. For what value of k does the system have no solution?',
    answer: -1, accept: [4],
    explanation: 'Multiplying the first equation by 2 gives 6x + 4y = 14. If k = 4, the left sides match but 14 ≠ 10, so the lines are parallel and there is no solution.',
  },
  {
    id: 'm19', section: 'math', skill: 'nonlinear-equations', difficulty: 3,
    prompt: 'What is the sum of the solutions to the equation 2x² − 12x + 7 = 0?',
    answer: -1, accept: [6],
    explanation: 'For ax² + bx + c = 0, the sum of the solutions is −b/a = −(−12)/2 = 6.',
  },
  {
    id: 'm20', section: 'math', skill: 'statistics', difficulty: 3,
    prompt: 'A data set consists of the values 3, 5, 8, 8, and 11. If the value 11 is replaced with 26, which statement is true?',
    choices: [
      'The mean increases and the median stays the same.',
      'Both the mean and the median increase.',
      'The mean stays the same and the median increases.',
      'Neither the mean nor the median changes.',
    ],
    answer: 0,
    explanation: 'The sum grows by 15, so the mean increases (from 7 to 10). The middle value of the ordered list is still 8, so the median does not change.',
  },
  {
    id: 'm21', section: 'math', skill: 'area-volume', difficulty: 3,
    prompt: 'A right circular cone has a radius of 6 and a volume of 96π. What is the height of the cone? (The volume of a cone is V = ⅓πr²h.)',
    answer: -1, accept: [8],
    explanation: '96π = ⅓π(6²)h = 12πh, so h = 96 ÷ 12 = 8.',
  },
  {
    id: 'm22', section: 'math', skill: 'linear-equations', difficulty: 1,
    prompt: 'If x/3 = 7, what is the value of 2x?', choices: ['14', '21', '42', '63'], answer: 2,
    explanation: 'x = 21, so 2x = 42.',
  },
  {
    id: 'm23', section: 'math', skill: 'ratios', difficulty: 2,
    prompt: 'A car travels 180 kilometers in 2.5 hours at a constant speed. At this speed, how many kilometers will the car travel in 4 hours?',
    answer: -1, accept: [288],
    explanation: 'Speed = 180 ÷ 2.5 = 72 km per hour. In 4 hours: 72 × 4 = 288 km.',
  },
  {
    id: 'm24', section: 'math', skill: 'equivalent-expressions', difficulty: 2,
    prompt: 'Which expression is equivalent to 3x(2x − 5) + 4x?', choices: ['6x² − 11x', '6x² − 19x', '6x² − 15x + 4', '5x² − 11x'], answer: 0,
    explanation: '3x(2x − 5) = 6x² − 15x. Adding 4x gives 6x² − 11x.',
  },
  {
    id: 'm25', section: 'math', skill: 'right-triangles-trig', difficulty: 1,
    prompt: 'A right triangle has legs of length 6 and 8. What is the length of the hypotenuse?',
    answer: -1, accept: [10],
    explanation: 'By the Pythagorean theorem: √(6² + 8²) = √100 = 10.',
  },
  {
    id: 'm26', section: 'math', skill: 'linear-functions', difficulty: 2,
    prompt: 'The total cost C, in so‘m, of printing n posters is given by C = 4,500n + 30,000. What is the best interpretation of 30,000 in this context?',
    choices: [
      'A fixed cost that does not depend on the number of posters',
      'The cost of printing each poster',
      'The total cost of printing 4,500 posters',
      'The number of posters printed',
    ],
    answer: 0,
    explanation: 'When n = 0, C = 30,000, so 30,000 is the cost even before any poster is printed — a fixed cost. 4,500 is the cost per poster.',
  },
  {
    id: 'm27', section: 'math', skill: 'nonlinear-functions', difficulty: 3,
    prompt: 'The function f is defined by f(x) = x² − 6x + 11. What is the minimum value of f(x)?',
    answer: -1, accept: [2],
    explanation: 'Complete the square: f(x) = (x − 3)² + 2. The square is never negative, so the minimum is 2, at x = 3.',
  },
  {
    id: 'm28', section: 'math', skill: 'ratios', difficulty: 2,
    prompt: 'In a class, 60% of the students play a sport. Of the students who play a sport, 25% play football. What percent of the whole class plays football?',
    answer: -1, accept: [15],
    explanation: '25% of 60% is 0.25 × 0.60 = 0.15, or 15% of the class.',
  },
];

// Answers were authored in position A for readability. Shuffle text choices deterministically
// (seeded by id) so the correct letter is spread across A–D. Numeric choices keep ascending order.
function seeded(id: string) {
  let h = 2166136261;
  for (const c of id) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const isNumericChoices = (c: string[]) => c.every((x) => /^[\d\s,./()−\-]+$/.test(x));
for (const q of questions) {
  if (!q.choices || isNumericChoices(q.choices) || /^x²|^6x²/.test(q.choices[0])) continue;
  const rnd = seeded(q.id);
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const orig = q.choices;
  q.choices = order.map((i) => orig[i]) as Question['choices'];
  q.answer = order.indexOf(q.answer);
}


/** Parse a student-produced response: integers, decimals, fractions, optional minus, commas/spaces ignored. */
export function parseNumeric(input: string): number | null {
  const s = input.replace(/[\s,]/g, '').replace(/−/g, '-');
  if (!s) return null;
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (frac) {
    const d = parseFloat(frac[2]);
    return d === 0 ? null : parseFloat(frac[1]) / d;
  }
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
  return null;
}

export function isCorrect(q: Question, response: string | number | null | undefined): boolean {
  if (response === null || response === undefined || response === '') return false;
  if (q.accept) {
    const x = parseNumeric(String(response));
    if (x === null) return false;
    // Exact match, or for non-integer answers a decimal entry with 3+ digits (e.g. .667 for 2/3).
    const decimals = (String(response).split('.')[1] || '').length;
    return q.accept.some((v) => Math.abs(x - v) < 1e-9 || (!Number.isInteger(v) && decimals >= 3 && Math.abs(x - v) < 0.001));
  }
  return Number(response) === q.answer;
}

export function answerLabel(q: Question): string {
  if (q.accept) return String(q.accept[0]);
  return `${'ABCD'[q.answer]}) ${q.choices![q.answer]}`;
}
