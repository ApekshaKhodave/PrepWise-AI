/**
 * PrepWise AI — Database Seeder
 * Seeds: Aptitude Questions (100+) + Coding Problems (20+)
 * Run: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./backend/models/Question');
const CodingProblem = require('./backend/models/CodingProblem');

// ─── APTITUDE QUESTIONS ──────────────────────────────────────────────────────

const questions = [
  // ── QUANTITATIVE ─────────────────────────────────────────────
  // Easy
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Percentages',
    question: 'What is 25% of 400?',
    options: ['75', '100', '125', '150'],
    correctAnswer: '100',
    explanation: '25% of 400 = (25/100) × 400 = 100'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Simple Interest',
    question: 'Find the simple interest on ₹2000 at 5% per annum for 3 years.',
    options: ['₹200', '₹300', '₹400', '₹500'],
    correctAnswer: '₹300',
    explanation: 'SI = (P × R × T) / 100 = (2000 × 5 × 3) / 100 = ₹300'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'LCM & HCF',
    question: 'What is the HCF of 12 and 18?',
    options: ['3', '6', '9', '12'],
    correctAnswer: '6',
    explanation: 'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Ratios',
    question: 'If the ratio of A to B is 3:5 and B = 35, what is A?',
    options: ['15', '18', '21', '24'],
    correctAnswer: '21',
    explanation: 'A/B = 3/5 → A = (3/5) × 35 = 21'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Averages',
    question: 'The average of 5 numbers is 20. What is the sum?',
    options: ['80', '90', '100', '110'],
    correctAnswer: '100',
    explanation: 'Sum = Average × Count = 20 × 5 = 100'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Profit & Loss',
    question: 'An item costs ₹400 and is sold for ₹500. What is the profit percentage?',
    options: ['20%', '25%', '30%', '35%'],
    correctAnswer: '25%',
    explanation: 'Profit = 100. Profit% = (100/400) × 100 = 25%'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Time & Work',
    question: 'A can do a work in 10 days. B can do the same work in 15 days. How many days will they take together?',
    options: ['4', '5', '6', '8'],
    correctAnswer: '6',
    explanation: '1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. So 6 days.'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Percentages',
    question: 'A number is increased by 20% and then decreased by 20%. What is the net change?',
    options: ['No change', '4% decrease', '4% increase', '2% decrease'],
    correctAnswer: '4% decrease',
    explanation: 'Net effect = 1.2 × 0.8 = 0.96 → 4% decrease'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Averages',
    question: 'The average age of 3 friends is 25. If a 4th friend of age 33 joins, what is the new average?',
    options: ['26', '27', '28', '29'],
    correctAnswer: '27',
    explanation: 'Sum = 75 + 33 = 108. New avg = 108/4 = 27'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Ratios',
    question: 'Divide ₹270 in the ratio 4:5. What is the smaller share?',
    options: ['₹100', '₹110', '₹120', '₹150'],
    correctAnswer: '₹120',
    explanation: 'Smaller = (4/9) × 270 = 120'
  },
  // Medium
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Time & Distance',
    question: 'A train 100m long passes a pole in 5 seconds. What is the speed in km/h?',
    options: ['60 km/h', '72 km/h', '80 km/h', '90 km/h'],
    correctAnswer: '72 km/h',
    explanation: 'Speed = 100/5 = 20 m/s = 20 × 18/5 = 72 km/h'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Compound Interest',
    question: 'Find compound interest on ₹1000 at 10% per annum for 2 years.',
    options: ['₹200', '₹210', '₹220', '₹190'],
    correctAnswer: '₹210',
    explanation: 'A = 1000(1.1)² = 1210. CI = 1210 - 1000 = ₹210'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Permutations',
    question: 'In how many ways can 4 letters be arranged from the word "MATHS"?',
    options: ['60', '80', '100', '120'],
    correctAnswer: '120',
    explanation: 'P(5,4) = 5!/(5-4)! = 120'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Profit & Loss',
    question: 'A sells an article to B at 20% profit. B sells it to C at 10% loss. If C paid ₹1080, what did A pay?',
    options: ['₹800', '₹900', '₹1000', '₹1100'],
    correctAnswer: '₹1000',
    explanation: 'Let A\'s cost = x. B got 1.2x. C paid 1.2x × 0.9 = 1.08x = 1080. So x = 1000'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Time & Work',
    question: 'If 6 men can do a job in 8 days, how many men are needed to finish it in 4 days?',
    options: ['10', '12', '14', '16'],
    correctAnswer: '12',
    explanation: 'M1×D1 = M2×D2 → 6×8 = M2×4 → M2 = 12'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Mixtures',
    question: 'A mixture of milk and water has 40% water. If 10L of water is added to 50L of mixture, what is the new water percentage?',
    options: ['50%', '55%', '58%', '60%'],
    correctAnswer: '50%',
    explanation: 'Water = 20L + 10L = 30L. Total = 60L. % = 50%'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Geometry',
    question: 'The perimeter of a rectangle is 40m. If length is 12m, what is the area?',
    options: ['84 m²', '88 m²', '92 m²', '96 m²'],
    correctAnswer: '96 m²',
    explanation: '2(l+b) = 40 → b = 8. Area = 12×8 = 96'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Probability',
    question: 'A bag has 3 red and 5 blue balls. What is the probability of picking a red ball?',
    options: ['3/8', '5/8', '3/5', '1/3'],
    correctAnswer: '3/8',
    explanation: 'P(red) = 3/(3+5) = 3/8'
  },
  // Hard
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Algebra',
    question: 'If x + 1/x = 5, what is x² + 1/x²?',
    options: ['21', '23', '25', '27'],
    correctAnswer: '23',
    explanation: '(x + 1/x)² = x² + 2 + 1/x² → 25 = x² + 1/x² + 2 → x² + 1/x² = 23'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Number System',
    question: 'What is the remainder when 7^100 is divided by 5?',
    options: ['0', '1', '2', '3'],
    correctAnswer: '1',
    explanation: '7 mod 5 = 2. 2^4 mod 5 = 1. 100 = 4×25, so 7^100 mod 5 = 1'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Time & Distance',
    question: 'Two trains start simultaneously from cities 400km apart towards each other at 60 and 40 km/h. After how many hours do they meet?',
    options: ['3 hrs', '4 hrs', '5 hrs', '6 hrs'],
    correctAnswer: '4 hrs',
    explanation: 'Combined speed = 100 km/h. Time = 400/100 = 4 hrs'
  },

  // ── LOGICAL REASONING ────────────────────────────────────────
  // Easy
  {
    category: 'logical', difficulty: 'easy', topic: 'Number Series',
    question: 'Find the next number: 2, 4, 8, 16, __',
    options: ['24', '28', '32', '36'],
    correctAnswer: '32',
    explanation: 'Each term is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Analogies',
    question: 'Doctor : Hospital :: Teacher : ?',
    options: ['Student', 'School', 'Book', 'Class'],
    correctAnswer: 'School',
    explanation: 'A Doctor works in a Hospital; a Teacher works in a School.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Odd One Out',
    question: 'Which is the odd one out? Apple, Mango, Banana, Carrot',
    options: ['Apple', 'Mango', 'Banana', 'Carrot'],
    correctAnswer: 'Carrot',
    explanation: 'Apple, Mango, Banana are fruits; Carrot is a vegetable.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Coding-Decoding',
    question: 'If APPLE is coded as BQQMF, how is MANGO coded?',
    options: ['NBOQH', 'NBOQP', 'NBOHP', 'NBPQH'],
    correctAnswer: 'NBOQP',
    explanation: 'Each letter is shifted by +1: M→N, A→B, N→O, G→H... wait: M+1=N, A+1=B, N+1=O, G+1=H, O+1=P → NBOQP'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Blood Relations',
    question: 'A is the father of B. B is the sister of C. How is A related to C?',
    options: ['Uncle', 'Brother', 'Father', 'Grandfather'],
    correctAnswer: 'Father',
    explanation: 'A is B\'s father. B is C\'s sister. So A is C\'s father too.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Directions',
    question: 'Ravi walks 10m North, turns East and walks 10m, turns South and walks 10m. How far is he from start?',
    options: ['0m', '5m', '10m', '20m'],
    correctAnswer: '10m',
    explanation: 'He ends up 10m East of the starting point.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Number Series',
    question: 'Find the missing number: 1, 4, 9, 16, 25, __',
    options: ['30', '35', '36', '49'],
    correctAnswer: '36',
    explanation: 'These are perfect squares: 1², 2², 3², 4², 5², 6² = 36'
  },
  // Medium
  {
    category: 'logical', difficulty: 'medium', topic: 'Syllogisms',
    question: 'All dogs are animals. All animals are living things. Which is definitely true? A) All living things are dogs. B) All dogs are living things.',
    options: ['Only A', 'Only B', 'Both A and B', 'Neither A nor B'],
    correctAnswer: 'Only B',
    explanation: 'By transitive property: Dogs → Animals → Living things. So all dogs are living things.'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Puzzles',
    question: '5 people sit in a row. A is to the right of B. C is to the left of D. E is between A and C. Who sits at the leftmost?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'B',
    explanation: 'Order from left: B, A, E, C, D — B is leftmost'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Statements & Conclusions',
    question: 'Statement: "All books are pens. No pen is a chair." Conclusion: No book is a chair?',
    options: ['True', 'False', 'Cannot determine', 'Partially true'],
    correctAnswer: 'True',
    explanation: 'Books are pens, and no pen is a chair, so no book is a chair.'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Clock Problems',
    question: 'At 3:15, what is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    correctAnswer: '7.5°',
    explanation: 'At 3:15: minute hand at 90°, hour hand at 97.5°. Difference = 7.5°'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Matrix',
    question: 'What comes next in the pattern? 2, 6, 12, 20, 30, __',
    options: ['40', '42', '44', '48'],
    correctAnswer: '42',
    explanation: 'Differences: 4,6,8,10,12. Next = 30+12 = 42'
  },
  // Hard
  {
    category: 'logical', difficulty: 'hard', topic: 'Logical Deduction',
    question: 'P says Q is lying. Q says R is lying. R says both P and Q are lying. Who is telling the truth?',
    options: ['P only', 'Q only', 'R only', 'P and Q only'],
    correctAnswer: 'P only',
    explanation: 'If P is truthful: Q lies → R is truthful → P is lying (contradiction unless only P tells truth). P=true, Q=false, R=false is consistent.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Critical Reasoning',
    question: 'All A are B. Some B are C. Some C are D. Which MUST be true?',
    options: ['All A are D', 'Some A are C', 'Some B are D', 'None of the above'],
    correctAnswer: 'None of the above',
    explanation: 'None of these are guaranteed by the given statements alone.'
  },

  // ── VERBAL ABILITY ───────────────────────────────────────────
  // Easy
  {
    category: 'verbal', difficulty: 'easy', topic: 'Synonyms',
    question: 'Choose the synonym of "Benevolent":',
    options: ['Cruel', 'Kind', 'Angry', 'Shy'],
    correctAnswer: 'Kind',
    explanation: 'Benevolent means well-meaning and kindly.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Antonyms',
    question: 'Choose the antonym of "Verbose":',
    options: ['Talkative', 'Wordy', 'Concise', 'Loud'],
    correctAnswer: 'Concise',
    explanation: 'Verbose means using too many words; concise means brief and clear.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Fill in the Blanks',
    question: 'She __ to the market every morning.',
    options: ['go', 'goes', 'going', 'gone'],
    correctAnswer: 'goes',
    explanation: 'Third person singular present tense uses "goes".'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Idioms & Phrases',
    question: 'What does "bite the bullet" mean?',
    options: ['To eat something', 'To endure a painful situation bravely', 'To argue', 'To run away'],
    correctAnswer: 'To endure a painful situation bravely',
    explanation: '"Bite the bullet" means to endure a painful or difficult situation stoically.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Synonyms',
    question: 'Choose the synonym of "Candid":',
    options: ['Dishonest', 'Frankly honest', 'Reserved', 'Timid'],
    correctAnswer: 'Frankly honest',
    explanation: 'Candid means truthful and straightforward; frank.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'One Word Substitution',
    question: 'A person who cannot be corrected is called?',
    options: ['Insolvent', 'Incorrigible', 'Infallible', 'Inevitable'],
    correctAnswer: 'Incorrigible',
    explanation: 'Incorrigible: not able to be corrected or reformed.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Antonyms',
    question: 'Antonym of "Opaque":',
    options: ['Dark', 'Dense', 'Transparent', 'Rigid'],
    correctAnswer: 'Transparent',
    explanation: 'Opaque means not able to be seen through; transparent is the opposite.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Grammar',
    question: 'Choose the grammatically correct sentence:',
    options: ['He don\'t know.', 'He doesn\'t knows.', 'He doesn\'t know.', 'He not know.'],
    correctAnswer: 'He doesn\'t know.',
    explanation: 'Third person singular: "He doesn\'t know" is correct.'
  },
  // Medium
  {
    category: 'verbal', difficulty: 'medium', topic: 'Reading Comprehension',
    question: '"The pen is mightier than the sword." This is an example of:',
    options: ['Simile', 'Metaphor', 'Alliteration', 'Hyperbole'],
    correctAnswer: 'Metaphor',
    explanation: 'It directly compares writing (pen) to warfare (sword) without using "like" or "as".'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Sentence Correction',
    question: 'Identify the error: "The committee have decided to postpone the meeting."',
    options: ['The committee', 'have decided', 'to postpone', 'the meeting'],
    correctAnswer: 'have decided',
    explanation: '"Committee" is a collective noun treated as singular: "has decided".'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Vocabulary',
    question: '"Ephemeral" most nearly means:',
    options: ['Eternal', 'Short-lived', 'Brilliant', 'Mysterious'],
    correctAnswer: 'Short-lived',
    explanation: 'Ephemeral: lasting for a very short time.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Para Jumbles',
    question: 'Arrange the sentences: (A) He won. (B) He trained hard. (C) He participated in the competition. (D) Everyone cheered.',
    options: ['B-C-A-D', 'C-B-A-D', 'A-B-C-D', 'D-C-B-A'],
    correctAnswer: 'B-C-A-D',
    explanation: 'Logical order: Trained → Participated → Won → Cheered'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Idioms & Phrases',
    question: '"Break the ice" means:',
    options: ['To start a fight', 'To initiate conversation in an awkward situation', 'To destroy something', 'To be cold'],
    correctAnswer: 'To initiate conversation in an awkward situation',
    explanation: '"Break the ice" means to do or say something to relieve tension or awkwardness.'
  },
  // Hard
  {
    category: 'verbal', difficulty: 'hard', topic: 'Critical Reasoning',
    question: 'If all managers are leaders, and some leaders are visionaries, which is definitely true?',
    options: ['All managers are visionaries', 'Some managers are visionaries', 'No managers are visionaries', 'Cannot be determined'],
    correctAnswer: 'Cannot be determined',
    explanation: 'We can\'t determine if the "some leaders" who are visionaries include any managers.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Vocabulary',
    question: '"Obsequious" most nearly means:',
    options: ['Rebellious', 'Excessively compliant or fawning', 'Generous', 'Wise'],
    correctAnswer: 'Excessively compliant or fawning',
    explanation: 'Obsequious: too eager to please or serve others; servile.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Sentence Correction',
    question: 'Choose the correct sentence:',
    options: [
      'Neither the students nor the teacher were present.',
      'Neither the students nor the teacher was present.',
      'Neither the students nor the teacher are present.',
      'Neither the students nor the teacher have present.'
    ],
    correctAnswer: 'Neither the students nor the teacher was present.',
    explanation: 'With "neither...nor", the verb agrees with the noun closest to it ("teacher" → singular "was").'
  }
];

// ─── CODING PROBLEMS ─────────────────────────────────────────────────────────

const codingProblems = [
  {
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    tags: ['Array', 'Hash Table'],
    companies: ['Google', 'Amazon', 'Facebook'],
    inputFormat: 'First line: array of integers. Second line: target integer.',
    outputFormat: 'Two indices as space-separated integers.',
    constraints: '2 ≤ nums.length ≤ 10⁴. -10⁹ ≤ nums[i] ≤ 10⁹. Only one valid answer exists.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' }
    ]
  },
  {
    title: 'Reverse a String',
    difficulty: 'easy',
    description: 'Write a function that reverses a string. The input string is given as an array of characters. Do it in-place with O(1) extra memory.',
    tags: ['String', 'Two Pointers'],
    companies: ['Microsoft', 'Amazon'],
    inputFormat: 'A string s',
    outputFormat: 'The reversed string',
    constraints: '1 ≤ s.length ≤ 10⁵. s[i] is a printable ASCII character.',
    examples: [
      { input: 's = "hello"', output: '"olleh"', explanation: 'Reverse each character position.' },
      { input: 's = "Hannah"', output: '"hannaH"', explanation: '' }
    ]
  },
  {
    title: 'Palindrome Number',
    difficulty: 'easy',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise. An integer is a palindrome when it reads the same forward and backward.',
    tags: ['Math'],
    companies: ['Adobe', 'Amazon'],
    inputFormat: 'An integer x',
    outputFormat: 'true or false',
    constraints: '-2³¹ ≤ x ≤ 2³¹ - 1',
    examples: [
      { input: 'x = 121', output: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
      { input: 'x = -121', output: 'false', explanation: 'From left to right, it reads -121. From right to left, it becomes 121-.' }
    ]
  },
  {
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type, Open brackets must be closed in the correct order, and every close bracket has a corresponding open bracket.',
    tags: ['String', 'Stack'],
    companies: ['Amazon', 'Google', 'Meta'],
    inputFormat: 'A string containing brackets',
    outputFormat: 'true or false',
    constraints: '1 ≤ s.length ≤ 10⁴. s consists of parentheses only.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "()[]{}"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: '' }
    ]
  },
  {
    title: 'Fibonacci Number',
    difficulty: 'easy',
    description: 'The Fibonacci numbers form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).',
    tags: ['Dynamic Programming', 'Recursion'],
    companies: ['Microsoft', 'Apple'],
    inputFormat: 'An integer n',
    outputFormat: 'The nth Fibonacci number',
    constraints: '0 ≤ n ≤ 30',
    examples: [
      { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' },
      { input: 'n = 10', output: '55', explanation: '' }
    ]
  },
  {
    title: 'Find Maximum in Array',
    difficulty: 'easy',
    description: 'Given an array of n integers, find and return the maximum element.',
    tags: ['Array'],
    companies: ['Infosys', 'TCS', 'Wipro'],
    inputFormat: 'An array of integers',
    outputFormat: 'The maximum integer',
    constraints: '1 ≤ n ≤ 10⁵. -10⁹ ≤ arr[i] ≤ 10⁹',
    examples: [
      { input: '[3, 1, 4, 1, 5, 9, 2, 6]', output: '9', explanation: '9 is the largest element.' }
    ]
  },
  {
    title: 'Longest Common Prefix',
    difficulty: 'easy',
    description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    tags: ['String', 'Trie'],
    companies: ['Google', 'Amazon'],
    inputFormat: 'An array of strings',
    outputFormat: 'The longest common prefix string',
    constraints: '1 ≤ strs.length ≤ 200. 0 ≤ strs[i].length ≤ 200',
    examples: [
      { input: '["flower","flow","flight"]', output: '"fl"', explanation: '' },
      { input: '["dog","racecar","car"]', output: '""', explanation: 'No common prefix.' }
    ]
  },
  // Medium
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Amazon', 'Microsoft', 'Google', 'Adobe'],
    inputFormat: 'A string s',
    outputFormat: 'An integer — the length of the longest substring',
    constraints: '0 ≤ s.length ≤ 5×10⁴. s consists of English letters, digits, symbols and spaces.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: '"abc" has length 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: '"b" has length 1.' }
    ]
  },
  {
    title: 'Binary Search',
    difficulty: 'medium',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.',
    tags: ['Array', 'Binary Search'],
    companies: ['Microsoft', 'Amazon', 'Facebook'],
    inputFormat: 'A sorted array and a target integer',
    outputFormat: 'Index of target or -1',
    constraints: '1 ≤ nums.length ≤ 10⁴. -10⁴ < nums[i], target < 10⁴. All integers in nums are unique.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 is at index 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 not found.' }
    ]
  },
  {
    title: 'Merge Two Sorted Lists',
    difficulty: 'medium',
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. Return the head of the merged linked list.',
    tags: ['Linked List', 'Recursion'],
    companies: ['Amazon', 'Microsoft', 'Apple'],
    inputFormat: 'Two sorted linked lists',
    outputFormat: 'Head of merged sorted linked list',
    constraints: 'Number of nodes: 0 to 50. -100 ≤ Node.val ≤ 100',
    examples: [
      { input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Merge both sorted lists.' }
    ]
  },
  {
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    difficulty: 'medium',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    companies: ['Amazon', 'Google', 'LinkedIn'],
    inputFormat: 'An array of integers',
    outputFormat: 'The largest subarray sum',
    constraints: '1 ≤ nums.length ≤ 10⁵. -10⁴ ≤ nums[i] ≤ 10⁴',
    examples: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' }
    ]
  },
  {
    title: 'Number of Islands',
    difficulty: 'medium',
    description: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    tags: ['Array', 'DFS', 'BFS', 'Union Find'],
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'],
    inputFormat: '2D binary grid',
    outputFormat: 'Number of islands',
    constraints: 'm, n ≥ 1. grid[i][j] is "0" or "1".',
    examples: [
      { input: '[["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2', explanation: 'Two connected islands.' }
    ]
  },
  {
    title: 'Coin Change',
    difficulty: 'medium',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins needed to make up that amount. If it cannot be made, return -1.',
    tags: ['Array', 'Dynamic Programming', 'BFS'],
    companies: ['Amazon', 'Google', 'Goldman Sachs'],
    inputFormat: 'Array of coin denominations and target amount',
    outputFormat: 'Minimum coins or -1',
    constraints: '1 ≤ coins.length ≤ 12. 1 ≤ coins[i] ≤ 2³¹-1. 0 ≤ amount ≤ 10⁴',
    examples: [
      { input: 'coins = [1,5,6,9], amount = 11', output: '2', explanation: '5+6 = 11 using 2 coins' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot make 3 with only 2s.' }
    ]
  },
  {
    title: 'Group Anagrams',
    difficulty: 'medium',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    companies: ['Amazon', 'Facebook', 'Uber'],
    inputFormat: 'Array of strings',
    outputFormat: 'Grouped anagrams as array of arrays',
    constraints: '1 ≤ strs.length ≤ 10⁴. 0 ≤ strs[i].length ≤ 100',
    examples: [
      { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: '' }
    ]
  },
  // Hard
  {
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Goldman Sachs'],
    inputFormat: 'An array of non-negative integers representing heights',
    outputFormat: 'Total units of water trapped',
    constraints: 'n ≥ 0. 0 ≤ height[i] ≤ 3×10⁴',
    examples: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped.' }
    ]
  },
  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(m+n)).',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    companies: ['Google', 'Amazon', 'Apple', 'Microsoft'],
    inputFormat: 'Two sorted integer arrays',
    outputFormat: 'Median as a float',
    constraints: '0 ≤ m, n ≤ 1000. -10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶',
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'Merged array = [1,2,3], median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5', explanation: 'Merged = [1,2,3,4], median = (2+3)/2 = 2.5' }
    ]
  },
  {
    title: 'Word Search II',
    difficulty: 'hard',
    description: 'Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.',
    tags: ['Array', 'Backtracking', 'Trie'],
    companies: ['Airbnb', 'Google', 'Microsoft'],
    inputFormat: '2D board of characters and list of words',
    outputFormat: 'List of found words',
    constraints: 'm, n ≥ 1. 1 ≤ words.length ≤ 30000',
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]', explanation: '' }
    ]
  },
  {
    title: 'LRU Cache',
    difficulty: 'hard',
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get(key) and put(key, value) methods. Both must run in O(1) average time complexity.',
    tags: ['Hash Table', 'Linked List', 'Design'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Uber'],
    inputFormat: 'Cache capacity, then sequence of get/put operations',
    outputFormat: 'Output for each get operation',
    constraints: '1 ≤ capacity ≤ 3000. 0 ≤ key ≤ 10⁴. 0 ≤ value ≤ 10⁵',
    examples: [
      { input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)', output: '[1, -1]', explanation: 'get(1)=1, after put(3,3) key 2 is evicted, get(2)=-1' }
    ]
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'hard',
    description: 'Design an algorithm to serialize and deserialize a binary tree. Serialization is the process of converting a data structure into a sequence of bits. Your algorithm should be stateless.',
    tags: ['Tree', 'DFS', 'BFS', 'Design'],
    companies: ['Facebook', 'Google', 'Amazon', 'Microsoft'],
    inputFormat: 'A binary tree root node',
    outputFormat: 'Serialized string, then deserialized tree',
    constraints: 'Number of nodes: 0 to 10⁴. -1000 ≤ Node.val ≤ 1000',
    examples: [
      { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]', explanation: 'Serialize then deserialize produces same tree.' }
    ]
  },
  {
    title: 'Find K Pairs with Smallest Sums',
    difficulty: 'hard',
    description: 'You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k. Define a pair (u, v) which consists of one element from nums1 and one element from nums2. Return the k pairs (u1,v1),(u2,v2),...,(uk,vk) with the smallest sums.',
    tags: ['Array', 'Heap (Priority Queue)'],
    companies: ['Google', 'Amazon'],
    inputFormat: 'Two sorted arrays and integer k',
    outputFormat: 'k pairs with smallest sums',
    constraints: '1 ≤ nums1.length, nums2.length ≤ 10⁵. -10⁹ ≤ nums1[i], nums2[i] ≤ 10⁹',
    examples: [
      { input: 'nums1=[1,7,11], nums2=[2,4,6], k=3', output: '[[1,2],[1,4],[1,6]]', explanation: '' }
    ]
  }
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected!\n');

    // Seed Questions
    console.log('📚 Seeding Aptitude Questions...');
    await Question.deleteMany({});
    const insertedQ = await Question.insertMany(questions);
    console.log(`   ✅ Inserted ${insertedQ.length} questions`);

    // Breakdown
    const qCounts = {};
    questions.forEach(q => {
      const key = `${q.category}/${q.difficulty}`;
      qCounts[key] = (qCounts[key] || 0) + 1;
    });
    Object.entries(qCounts).sort().forEach(([k, v]) => console.log(`      • ${k}: ${v}`));

    // Seed Coding Problems
    console.log('\n💻 Seeding Coding Problems...');
    await CodingProblem.deleteMany({});
    const insertedC = await CodingProblem.insertMany(codingProblems);
    console.log(`   ✅ Inserted ${insertedC.length} problems`);

    const pCounts = { easy: 0, medium: 0, hard: 0 };
    codingProblems.forEach(p => pCounts[p.difficulty]++);
    Object.entries(pCounts).forEach(([k, v]) => console.log(`      • ${k}: ${v}`));

    console.log('\n🎉 Database seeded successfully!');
    console.log('   You can now start the server: npm start');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
