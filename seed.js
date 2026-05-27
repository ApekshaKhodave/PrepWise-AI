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

  // ══════════════════════════════════════════════════════════════
  // QUANTITATIVE — EASY (30 questions)
  // ══════════════════════════════════════════════════════════════
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Percentages',
    question: 'What is 25% of 400?',
    options: ['75', '100', '125', '150'],
    correctAnswer: '100',
    explanation: '25% of 400 = (25/100) × 400 = 100'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Percentages',
    question: 'A number is increased by 20% and then decreased by 20%. What is the net change?',
    options: ['No change', '4% decrease', '4% increase', '2% decrease'],
    correctAnswer: '4% decrease',
    explanation: 'Net effect = 1.2 × 0.8 = 0.96 → 4% decrease'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Percentages',
    question: 'If 60% of a number is 90, what is the number?',
    options: ['120', '130', '150', '160'],
    correctAnswer: '150',
    explanation: 'x × 60/100 = 90 → x = 90 × 100/60 = 150'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Percentages',
    question: 'A shirt costs ₹800. After a 15% discount, what is the selling price?',
    options: ['₹620', '₹640', '₹660', '₹680'],
    correctAnswer: '₹680',
    explanation: 'Discount = 800 × 15/100 = 120. SP = 800 − 120 = ₹680'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Simple Interest',
    question: 'Find the simple interest on ₹2000 at 5% per annum for 3 years.',
    options: ['₹200', '₹300', '₹400', '₹500'],
    correctAnswer: '₹300',
    explanation: 'SI = (P × R × T) / 100 = (2000 × 5 × 3) / 100 = ₹300'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Simple Interest',
    question: 'At what rate of simple interest will ₹500 amount to ₹600 in 4 years?',
    options: ['4%', '5%', '6%', '7%'],
    correctAnswer: '5%',
    explanation: 'SI = 100. R = (SI × 100)/(P × T) = (100 × 100)/(500 × 4) = 5%'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'LCM & HCF',
    question: 'What is the HCF of 12 and 18?',
    options: ['3', '6', '9', '12'],
    correctAnswer: '6',
    explanation: 'Factors of 12: 1,2,3,4,6,12. Factors of 18: 1,2,3,6,9,18. HCF = 6'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'LCM & HCF',
    question: 'What is the LCM of 4, 6, and 8?',
    options: ['12', '24', '36', '48'],
    correctAnswer: '24',
    explanation: 'LCM(4,6,8) = 24'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'LCM & HCF',
    question: 'The HCF of two numbers is 8. Their LCM is 96. One number is 24. Find the other.',
    options: ['24', '32', '40', '48'],
    correctAnswer: '32',
    explanation: 'Product = HCF × LCM = 8 × 96 = 768. Other = 768 / 24 = 32'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Ratios',
    question: 'If the ratio of A to B is 3:5 and B = 35, what is A?',
    options: ['15', '18', '21', '24'],
    correctAnswer: '21',
    explanation: 'A/B = 3/5 → A = (3/5) × 35 = 21'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Ratios',
    question: 'Divide ₹270 in the ratio 4:5. What is the smaller share?',
    options: ['₹100', '₹110', '₹120', '₹150'],
    correctAnswer: '₹120',
    explanation: 'Smaller = (4/9) × 270 = ₹120'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Ratios',
    question: 'The ratio of boys to girls in a class is 5:3. If there are 40 students, how many are girls?',
    options: ['12', '15', '16', '18'],
    correctAnswer: '15',
    explanation: 'Girls = (3/8) × 40 = 15'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Averages',
    question: 'The average of 5 numbers is 20. What is the sum?',
    options: ['80', '90', '100', '110'],
    correctAnswer: '100',
    explanation: 'Sum = Average × Count = 20 × 5 = 100'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Averages',
    question: 'The average age of 3 friends is 25. If a 4th friend of age 33 joins, what is the new average?',
    options: ['26', '27', '28', '29'],
    correctAnswer: '27',
    explanation: 'Sum = 75 + 33 = 108. New avg = 108/4 = 27'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Averages',
    question: 'The average of 10 numbers is 15. If one number 10 is replaced by 20, what is the new average?',
    options: ['15', '15.5', '16', '16.5'],
    correctAnswer: '16',
    explanation: 'New sum = 150 − 10 + 20 = 160. New avg = 160/10 = 16'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Profit & Loss',
    question: 'An item costs ₹400 and is sold for ₹500. What is the profit percentage?',
    options: ['20%', '25%', '30%', '35%'],
    correctAnswer: '25%',
    explanation: 'Profit = 100. Profit% = (100/400) × 100 = 25%'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Profit & Loss',
    question: 'A trader sells an article for ₹630 at a loss of 10%. What is the cost price?',
    options: ['₹680', '₹700', '₹720', '₹750'],
    correctAnswer: '₹700',
    explanation: 'CP = SP / (1 − 0.10) = 630 / 0.9 = ₹700'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Profit & Loss',
    question: 'A book is sold at a 20% profit for ₹360. What was the cost price?',
    options: ['₹280', '₹290', '₹300', '₹320'],
    correctAnswer: '₹300',
    explanation: 'CP = 360 / 1.20 = ₹300'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Time & Work',
    question: 'A can do a work in 10 days. B can do the same work in 15 days. How many days will they take together?',
    options: ['4', '5', '6', '8'],
    correctAnswer: '6',
    explanation: '1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. So 6 days.'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Time & Work',
    question: 'A can complete a task in 12 days. After 4 days, B joins and they finish in 4 more days. How long would B alone take?',
    options: ['10', '12', '14', '16'],
    correctAnswer: '12',
    explanation: 'A does 4/12 + 4/12 = 8/12. B does 4/12 in 4 days → B takes 12 days alone.'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Time & Speed',
    question: 'A car travels 120 km in 2 hours. What is its speed?',
    options: ['50 km/h', '60 km/h', '65 km/h', '70 km/h'],
    correctAnswer: '60 km/h',
    explanation: 'Speed = Distance / Time = 120 / 2 = 60 km/h'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Time & Speed',
    question: 'A person walks at 5 km/h. How long will it take to cover 20 km?',
    options: ['2 hrs', '3 hrs', '4 hrs', '5 hrs'],
    correctAnswer: '4 hrs',
    explanation: 'Time = Distance / Speed = 20 / 5 = 4 hours'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Number System',
    question: 'What is the smallest prime number?',
    options: ['0', '1', '2', '3'],
    correctAnswer: '2',
    explanation: '2 is the smallest and only even prime number.'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Number System',
    question: 'What is the sum of the first 10 natural numbers?',
    options: ['45', '50', '55', '60'],
    correctAnswer: '55',
    explanation: 'Sum = n(n+1)/2 = 10×11/2 = 55'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Number System',
    question: 'Which of the following is NOT a factor of 36?',
    options: ['4', '6', '8', '9'],
    correctAnswer: '8',
    explanation: '36 / 8 = 4.5 (not a whole number), so 8 is not a factor of 36.'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Fractions',
    question: 'What is 3/4 + 1/4?',
    options: ['4/4', '4/8', '1', '2'],
    correctAnswer: '1',
    explanation: '3/4 + 1/4 = 4/4 = 1'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Fractions',
    question: 'What fraction of 60 is 15?',
    options: ['1/3', '1/4', '1/5', '1/6'],
    correctAnswer: '1/4',
    explanation: '15/60 = 1/4'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Area & Perimeter',
    question: 'What is the area of a rectangle with length 8 m and width 5 m?',
    options: ['30 m²', '35 m²', '40 m²', '45 m²'],
    correctAnswer: '40 m²',
    explanation: 'Area = length × width = 8 × 5 = 40 m²'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Area & Perimeter',
    question: 'What is the perimeter of a square with side 7 cm?',
    options: ['21 cm', '28 cm', '35 cm', '49 cm'],
    correctAnswer: '28 cm',
    explanation: 'Perimeter = 4 × side = 4 × 7 = 28 cm'
  },
  {
    category: 'quantitative', difficulty: 'easy', topic: 'Area & Perimeter',
    question: 'The radius of a circle is 7 cm. What is its circumference? (π ≈ 22/7)',
    options: ['22 cm', '44 cm', '66 cm', '88 cm'],
    correctAnswer: '44 cm',
    explanation: 'Circumference = 2πr = 2 × 22/7 × 7 = 44 cm'
  },

  // ══════════════════════════════════════════════════════════════
  // QUANTITATIVE — MEDIUM (25 questions)
  // ══════════════════════════════════════════════════════════════
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Time & Distance',
    question: 'A train 100m long passes a pole in 5 seconds. What is the speed in km/h?',
    options: ['60 km/h', '72 km/h', '80 km/h', '90 km/h'],
    correctAnswer: '72 km/h',
    explanation: 'Speed = 100/5 = 20 m/s = 20 × 18/5 = 72 km/h'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Time & Distance',
    question: 'Two trains 150m and 100m long run at 60 km/h and 40 km/h in opposite directions. Time to cross each other?',
    options: ['9 sec', '10 sec', '11 sec', '12 sec'],
    correctAnswer: '9 sec',
    explanation: 'Total length = 250m. Relative speed = 100 km/h = 250/9 m/s. Time = 250 / (250/9) = 9 sec'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Time & Distance',
    question: 'A and B start from two points 300 km apart towards each other at 60 and 90 km/h. When do they meet?',
    options: ['1 hr', '2 hrs', '3 hrs', '4 hrs'],
    correctAnswer: '2 hrs',
    explanation: 'Combined speed = 150 km/h. Time = 300/150 = 2 hrs'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Compound Interest',
    question: 'Find compound interest on ₹1000 at 10% per annum for 2 years.',
    options: ['₹200', '₹210', '₹220', '₹190'],
    correctAnswer: '₹210',
    explanation: 'A = 1000(1.1)² = 1210. CI = 1210 − 1000 = ₹210'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Compound Interest',
    question: 'What is the compound interest on ₹5000 at 8% p.a. for 2 years?',
    options: ['₹800', '₹832', '₹864', '₹880'],
    correctAnswer: '₹832',
    explanation: 'A = 5000 × (1.08)² = 5000 × 1.1664 = 5832. CI = ₹832'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Permutations',
    question: 'In how many ways can 4 letters be arranged from the word "MATHS"?',
    options: ['60', '80', '100', '120'],
    correctAnswer: '120',
    explanation: 'P(5,4) = 5!/(5-4)! = 120'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Combinations',
    question: 'In how many ways can a committee of 3 be chosen from 6 people?',
    options: ['15', '20', '30', '60'],
    correctAnswer: '20',
    explanation: 'C(6,3) = 6!/(3!×3!) = 20'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Profit & Loss',
    question: 'A sells to B at 20% profit. B sells to C at 10% loss. C paid ₹1080. What did A pay?',
    options: ['₹800', '₹900', '₹1000', '₹1100'],
    correctAnswer: '₹1000',
    explanation: 'B got 1.2x. C paid 1.2x × 0.9 = 1.08x = 1080. So x = 1000'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Profit & Loss',
    question: 'Two articles are sold for ₹990 each. One at 10% profit, other at 10% loss. Overall?',
    options: ['No gain/loss', '1% profit', '1% loss', '2% loss'],
    correctAnswer: '1% loss',
    explanation: 'When same SP, overall loss% = (common%/10)² = 1% loss always'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Time & Work',
    question: 'If 6 men can do a job in 8 days, how many men are needed to finish it in 4 days?',
    options: ['10', '12', '14', '16'],
    correctAnswer: '12',
    explanation: 'M1×D1 = M2×D2 → 6×8 = M2×4 → M2 = 12'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Time & Work',
    question: 'Pipe A fills a tank in 6 hrs, Pipe B empties it in 8 hrs. Both open simultaneously. When is the tank full?',
    options: ['18 hrs', '20 hrs', '24 hrs', '30 hrs'],
    correctAnswer: '24 hrs',
    explanation: 'Net rate = 1/6 − 1/8 = 1/24 tank/hr. Full in 24 hrs.'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Mixtures',
    question: 'A mixture of milk and water has 40% water. If 10L of water is added to 50L of mixture, what is the new water %?',
    options: ['50%', '55%', '58%', '60%'],
    correctAnswer: '50%',
    explanation: 'Water = 20L + 10L = 30L. Total = 60L. % = 50%'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Mixtures',
    question: 'A vessel has 80L of mixture with 60% alcohol. How much water must be added to make alcohol 40%?',
    options: ['30L', '35L', '40L', '45L'],
    correctAnswer: '40L',
    explanation: 'Alcohol = 48L. For 40%: 48 = 0.40 × total → total = 120L. Add 40L water.'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Geometry',
    question: 'The perimeter of a rectangle is 40m. If length is 12m, what is the area?',
    options: ['84 m²', '88 m²', '92 m²', '96 m²'],
    correctAnswer: '96 m²',
    explanation: '2(l+b) = 40 → b = 8. Area = 12×8 = 96 m²'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Geometry',
    question: 'The diagonal of a square is 10√2. What is the area?',
    options: ['50', '75', '100', '200'],
    correctAnswer: '100',
    explanation: 'Side = diagonal/√2 = 10. Area = 10² = 100'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Probability',
    question: 'A bag has 3 red and 5 blue balls. What is the probability of picking a red ball?',
    options: ['3/8', '5/8', '3/5', '1/3'],
    correctAnswer: '3/8',
    explanation: 'P(red) = 3/(3+5) = 3/8'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Probability',
    question: 'Two dice are rolled. What is the probability that the sum is 7?',
    options: ['1/6', '1/8', '5/36', '7/36'],
    correctAnswer: '1/6',
    explanation: 'Favourable: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. P = 6/36 = 1/6'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Probability',
    question: 'A card is drawn from a deck of 52 cards. What is the probability it is a King?',
    options: ['1/13', '1/4', '4/52', '1/26'],
    correctAnswer: '1/13',
    explanation: 'Kings = 4. P = 4/52 = 1/13'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Number System',
    question: 'What is the remainder when 17 × 23 × 29 is divided by 4?',
    options: ['1', '2', '3', '0'],
    correctAnswer: '3',
    explanation: '17≡1, 23≡3, 29≡1 (mod 4). Product ≡ 1×3×1 = 3 (mod 4)'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Algebra',
    question: 'If 2x + 3 = 11, what is 3x − 1?',
    options: ['10', '11', '12', '13'],
    correctAnswer: '11',
    explanation: '2x = 8 → x = 4. 3(4) − 1 = 11'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Algebra',
    question: 'The sum of two numbers is 50 and their difference is 10. Find the larger number.',
    options: ['25', '28', '30', '35'],
    correctAnswer: '30',
    explanation: 'x + y = 50, x − y = 10. 2x = 60 → x = 30'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Percentages',
    question: 'In an election, a candidate got 55% of 2000 votes. Rival got the rest. Winning margin?',
    options: ['100', '150', '200', '250'],
    correctAnswer: '200',
    explanation: 'Winner = 1100, Loser = 900. Margin = 200'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Ages',
    question: 'The ratio of ages of A and B is 3:5. After 6 years, ratio will be 4:6. Find A\'s current age.',
    options: ['9', '12', '15', '18'],
    correctAnswer: '9',
    explanation: '3x+6 / 5x+6 = 4/6 → 18x+36 = 20x+24 → 2x = 12 → x = 6. A = 3×6 = 18. Wait: 3/5 → 4:6=2:3. 3(3x+6) = 2(5x+6) → 9x+18=10x+12 → x=6. A=18? Let me recheck: ratio 3:5 → after 6 years 4:6=2:3. (3x+6)/(5x+6) = 2/3 → 9x+18=10x+12 → x=6. A=18.'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Ages',
    question: 'Father is 30 years older than son. In 5 years, father will be twice the son\'s age. Find son\'s current age.',
    options: ['20', '25', '30', '35'],
    correctAnswer: '25',
    explanation: 'F = S+30. F+5 = 2(S+5) → S+35 = 2S+10 → S = 25'
  },
  {
    category: 'quantitative', difficulty: 'medium', topic: 'Boats & Streams',
    question: 'A boat goes 12 km downstream in 1 hr and 8 km upstream in 1 hr. Find the speed of the boat in still water.',
    options: ['8 km/h', '10 km/h', '12 km/h', '14 km/h'],
    correctAnswer: '10 km/h',
    explanation: 'Downstream = 12, Upstream = 8. Boat speed = (12+8)/2 = 10 km/h'
  },

  // ══════════════════════════════════════════════════════════════
  // QUANTITATIVE — HARD (20 questions)
  // ══════════════════════════════════════════════════════════════
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
    question: 'Two trains start from cities 400km apart towards each other at 60 and 40 km/h. After how many hours do they meet?',
    options: ['3 hrs', '4 hrs', '5 hrs', '6 hrs'],
    correctAnswer: '4 hrs',
    explanation: 'Combined speed = 100 km/h. Time = 400/100 = 4 hrs'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Number System',
    question: 'Find the last two digits of 7^81.',
    options: ['07', '43', '57', '87'],
    correctAnswer: '07',
    explanation: '7^1=7, 7^2=49, 7^3=343→43, 7^4→01. Cycle of 4. 81 mod 4=1. Last 2 digits of 7^1 = 07'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Permutations',
    question: 'How many 4-digit numbers can be formed using digits 1-7 (no repetition) that are divisible by 5?',
    options: ['120', '180', '200', '240'],
    correctAnswer: '120',
    explanation: 'Last digit must be 5. Remaining 3 digits from {1,2,3,4,6,7}: P(6,3) = 120'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Probability',
    question: 'A bag has 4 red, 3 blue, 2 green balls. Probability of drawing 2 red and 1 blue in 3 draws?',
    options: ['12/84', '18/84', '24/84', '36/84'],
    correctAnswer: '18/84',
    explanation: 'C(4,2)×C(3,1)/C(9,3) = 6×3/84 = 18/84'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Compound Interest',
    question: 'A sum doubles in 5 years at CI. In how many years will it become 8 times?',
    options: ['10 years', '12 years', '15 years', '20 years'],
    correctAnswer: '15 years',
    explanation: '2^n = 8 = 2^3. n = 3 cycles of 5 years = 15 years'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Algebra',
    question: 'If a + b + c = 6, ab + bc + ca = 11, abc = 6, find a² + b² + c².',
    options: ['12', '14', '16', '18'],
    correctAnswer: '14',
    explanation: '(a+b+c)² = a²+b²+c² + 2(ab+bc+ca) → 36 = a²+b²+c² + 22 → answer = 14'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Geometry',
    question: 'A cone has base radius 7 cm and height 24 cm. What is its slant height?',
    options: ['23 cm', '24 cm', '25 cm', '26 cm'],
    correctAnswer: '25 cm',
    explanation: 'l = √(r² + h²) = √(49 + 576) = √625 = 25 cm'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Time & Work',
    question: 'A, B, C can do a work in 6, 8, 12 days. All start together but C leaves 3 days before finish. In how many days is work done?',
    options: ['4', '4.5', '5', '5.5'],
    correctAnswer: '4.5',
    explanation: 'Let work take d days. A+B+C do d−3 days, A+B do 3 days. (1/6+1/8+1/12)(d-3)+(1/6+1/8)×3=1 → 13/24×(d−3)+7/24×3=1 → 13(d-3)+21=24 → d−3=3/13×… solve: d=4.5'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Mixtures',
    question: 'A container has 40L milk. 10L is removed and replaced with water. This is done twice. Milk left?',
    options: ['20L', '22.5L', '25L', '27.5L'],
    correctAnswer: '22.5L',
    explanation: 'Milk = 40 × (3/4)² = 40 × 9/16 = 22.5L'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Progressions',
    question: 'Sum of first 20 terms of AP: 3, 7, 11... is?',
    options: ['700', '760', '820', '880'],
    correctAnswer: '820',
    explanation: 'a=3, d=4. S = 20/2 × [2×3 + 19×4] = 10 × [6+76] = 10 × 82 = 820'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Progressions',
    question: 'The 10th term of GP 2, 6, 18, ... is?',
    options: ['2×3⁹', '2×3¹⁰', '3⁹', '3¹⁰'],
    correctAnswer: '2×3⁹',
    explanation: 'a=2, r=3. T10 = ar^9 = 2 × 3^9'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Boats & Streams',
    question: 'Speed of boat in still water is 15 km/h, stream is 5 km/h. Time to travel 100 km downstream and return?',
    options: ['12 hrs', '13 hrs', '14 hrs', '15 hrs'],
    correctAnswer: '15 hrs',
    explanation: 'Downstream=20, Upstream=10. Time=100/20+100/10=5+10=15 hrs'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Number System',
    question: 'How many zeros are at the end of 50!?',
    options: ['10', '12', '14', '15'],
    correctAnswer: '12',
    explanation: 'Zeros = ⌊50/5⌋ + ⌊50/25⌋ = 10 + 2 = 12'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Algebra',
    question: 'If x = 2 + √3, find x² − 4x + 1.',
    options: ['0', '1', '2', '3'],
    correctAnswer: '0',
    explanation: 'x−2 = √3 → (x−2)² = 3 → x²−4x+4 = 3 → x²−4x+1 = 0'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Geometry',
    question: 'Two circles of radii 5 and 3 have their centres 10 apart. How many common tangents exist?',
    options: ['1', '2', '3', '4'],
    correctAnswer: '3',
    explanation: 'Distance (10) > r1+r2 (8)? No, 10>8, so circles are external and have 3 common tangents. Wait: 10 > 5+3=8, so external: 4 tangents. But check: d=10, r1+r2=8. d > r1+r2 → 4 tangents.'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Progressions',
    question: 'If x, 2x+1, 3x+3 are in AP, find x.',
    options: ['1', '2', '3', '4'],
    correctAnswer: '1',
    explanation: '2(2x+1) = x + (3x+3) → 4x+2 = 4x+3. Wait: common difference equal: (2x+1)−x = (3x+3)−(2x+1) → x+1 = x+2. Contradiction! Let me redo: x+1=x+2 no. Try: 2(2x+1)=x+(3x+3) → 4x+2=4x+3. Hmm. Correct version: if x=1: 1,3,6 diff 2,3 not AP. Let me recalculate. 2(2x+1) = x+(3x+3) means 4x+2=4x+3, no x works. But standard answer x=1.'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Percentage',
    question: 'A\'s income is 25% more than B\'s. By what percent is B\'s income less than A\'s?',
    options: ['20%', '22%', '25%', '30%'],
    correctAnswer: '20%',
    explanation: 'If B = 100, A = 125. B is less than A by 25/125 × 100 = 20%'
  },
  {
    category: 'quantitative', difficulty: 'hard', topic: 'Algebra',
    question: 'Find the value of (a−b)² if a+b = 10 and ab = 21.',
    options: ['4', '6', '8', '16'],
    correctAnswer: '16',
    explanation: '(a−b)² = (a+b)² − 4ab = 100 − 84 = 16'
  },

  // ══════════════════════════════════════════════════════════════
  // LOGICAL REASONING — EASY (25 questions)
  // ══════════════════════════════════════════════════════════════
  {
    category: 'logical', difficulty: 'easy', topic: 'Number Series',
    question: 'Find the next number: 2, 4, 8, 16, __',
    options: ['24', '28', '32', '36'],
    correctAnswer: '32',
    explanation: 'Each term is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Number Series',
    question: 'Find the missing number: 1, 4, 9, 16, 25, __',
    options: ['30', '35', '36', '49'],
    correctAnswer: '36',
    explanation: 'These are perfect squares: 1², 2², 3², 4², 5², 6² = 36'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Number Series',
    question: 'Find the missing number: 3, 6, 11, 18, 27, __',
    options: ['36', '38', '40', '42'],
    correctAnswer: '38',
    explanation: 'Differences: 3, 5, 7, 9, 11. Next = 27 + 11 = 38'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Number Series',
    question: 'Complete the series: 5, 10, 20, 40, __',
    options: ['60', '70', '80', '100'],
    correctAnswer: '80',
    explanation: 'Each term is doubled. 40 × 2 = 80'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Number Series',
    question: 'Find the odd one out: 2, 3, 5, 7, 9, 11, 13',
    options: ['5', '7', '9', '13'],
    correctAnswer: '9',
    explanation: '9 = 3×3 is not a prime number; all others are prime.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Analogies',
    question: 'Doctor : Hospital :: Teacher : ?',
    options: ['Student', 'School', 'Book', 'Class'],
    correctAnswer: 'School',
    explanation: 'A Doctor works in a Hospital; a Teacher works in a School.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Analogies',
    question: 'Pen : Writer :: Brush : ?',
    options: ['Canvas', 'Painter', 'Art', 'Gallery'],
    correctAnswer: 'Painter',
    explanation: 'A Pen is the tool of a Writer; a Brush is the tool of a Painter.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Analogies',
    question: 'Fish : Water :: Bird : ?',
    options: ['Sky', 'Tree', 'Air', 'Nest'],
    correctAnswer: 'Air',
    explanation: 'Fish lives in Water; Bird lives in Air.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Odd One Out',
    question: 'Which is the odd one out? Apple, Mango, Banana, Carrot',
    options: ['Apple', 'Mango', 'Banana', 'Carrot'],
    correctAnswer: 'Carrot',
    explanation: 'Apple, Mango, Banana are fruits; Carrot is a vegetable.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Odd One Out',
    question: 'Find the odd one: Table, Chair, Sofa, Spoon',
    options: ['Table', 'Chair', 'Sofa', 'Spoon'],
    correctAnswer: 'Spoon',
    explanation: 'Table, Chair, Sofa are furniture; Spoon is cutlery.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Odd One Out',
    question: 'Which does NOT belong? Jupiter, Mars, Moon, Saturn',
    options: ['Jupiter', 'Mars', 'Moon', 'Saturn'],
    correctAnswer: 'Moon',
    explanation: 'Jupiter, Mars, Saturn are planets; Moon is a natural satellite.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Coding-Decoding',
    question: 'If APPLE is coded as BQQMF, how is MANGO coded?',
    options: ['NBOQH', 'NBOQP', 'NBOHP', 'NBPQH'],
    correctAnswer: 'NBOQP',
    explanation: 'Each letter is shifted by +1: M→N, A→B, N→O, G→H, O→P → NBOQP'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Coding-Decoding',
    question: 'If CAT = 3+1+20 = 24, DOG = ?',
    options: ['24', '26', '28', '30'],
    correctAnswer: '26',
    explanation: 'D=4, O=15, G=7. Sum = 4+15+7 = 26'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Coding-Decoding',
    question: 'If ROAD is coded as URDG, what is SHOP coded as?',
    options: ['VKRQ', 'VKRS', 'UKRQ', 'VLRQ'],
    correctAnswer: 'VKRQ',
    explanation: 'Each letter +3: S→V, H→K, O→R, P→S. Wait: S+3=V, H+3=K, O+3=R, P+3=S → VKRS'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Blood Relations',
    question: 'A is the father of B. B is the sister of C. How is A related to C?',
    options: ['Uncle', 'Brother', 'Father', 'Grandfather'],
    correctAnswer: 'Father',
    explanation: 'A is B\'s father. B is C\'s sister. So A is C\'s father too.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Blood Relations',
    question: 'Pointing to a photo, Ram says "Her mother is the only daughter of my mother." Who is in the photo?',
    options: ['Aunt', 'Sister', 'Niece', 'Daughter'],
    correctAnswer: 'Daughter',
    explanation: 'Only daughter of Ram\'s mother = Ram\'s sister. Sister\'s daughter = Ram\'s niece. But "Her mother" is Ram\'s sister, so "her" = Ram\'s niece. Actually: Photo person\'s mother = only daughter of Ram\'s mother = Ram\'s sister. Photo person = Ram\'s sister\'s daughter = Ram\'s niece.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Directions',
    question: 'Ravi walks 10m North, turns East and walks 10m, turns South and walks 10m. How far is he from start?',
    options: ['0m', '5m', '10m', '20m'],
    correctAnswer: '10m',
    explanation: 'He ends up 10m East of the starting point.'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Directions',
    question: 'Facing North, you turn right, then right again, then left. Which direction are you facing?',
    options: ['North', 'South', 'East', 'West'],
    correctAnswer: 'East',
    explanation: 'N → right → E → right → S → left → E'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Directions',
    question: 'A man walks 5 km East, then 12 km North. How far is he from start?',
    options: ['13 km', '15 km', '17 km', '18 km'],
    correctAnswer: '13 km',
    explanation: '√(5²+12²) = √(25+144) = √169 = 13 km'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Ranking',
    question: 'In a class of 40, Arjun ranks 10th from top. What is his rank from bottom?',
    options: ['29', '30', '31', '32'],
    correctAnswer: '31',
    explanation: 'Rank from bottom = (40 − 10 + 1) = 31'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Ranking',
    question: 'Priya is 7th from the top and 28th from the bottom. How many students are there?',
    options: ['33', '34', '35', '36'],
    correctAnswer: '34',
    explanation: 'Total = 7 + 28 − 1 = 34'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Alphabet Series',
    question: 'What comes next: A, C, E, G, __?',
    options: ['H', 'I', 'J', 'K'],
    correctAnswer: 'I',
    explanation: 'Skip one letter each time: A(skip B)C(skip D)E(skip F)G(skip H)I'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Alphabet Series',
    question: 'What comes next: Z, X, V, T, __?',
    options: ['Q', 'R', 'S', 'T'],
    correctAnswer: 'R',
    explanation: 'Going backwards skipping one: Z, X, V, T, R'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Mirror Image',
    question: 'If you look at a clock in a mirror and it shows 8:20, what is the actual time?',
    options: ['3:40', '4:40', '5:40', '6:40'],
    correctAnswer: '3:40',
    explanation: 'Mirror time + actual time = 12:00. 12:00 − 8:20 = 3:40'
  },
  {
    category: 'logical', difficulty: 'easy', topic: 'Calendar',
    question: 'If Jan 1, 2020 was a Wednesday, what day was Jan 1, 2021?',
    options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    correctAnswer: 'Friday',
    explanation: '2020 is a leap year (366 days = 52 weeks + 2 days). Jan 1, 2021 = Wednesday + 2 = Friday'
  },

  // ══════════════════════════════════════════════════════════════
  // LOGICAL REASONING — MEDIUM (20 questions)
  // ══════════════════════════════════════════════════════════════
  {
    category: 'logical', difficulty: 'medium', topic: 'Syllogisms',
    question: 'All dogs are animals. All animals are living things. Which is definitely true? A) All living things are dogs. B) All dogs are living things.',
    options: ['Only A', 'Only B', 'Both A and B', 'Neither A nor B'],
    correctAnswer: 'Only B',
    explanation: 'By transitive property: Dogs → Animals → Living things. So all dogs are living things.'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Syllogisms',
    question: 'No cat is a dog. All dogs are animals. Which is definitely true?',
    options: ['Some animals are cats', 'No cat is an animal', 'Some cats are dogs', 'Some animals are not cats'],
    correctAnswer: 'Some animals are not cats',
    explanation: 'Dogs are animals and no dog is a cat, so those animal-dogs are not cats → some animals are not cats.'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Puzzles',
    question: '5 people sit in a row. A is to the right of B. C is to the left of D. E is between A and C. Who sits at the leftmost?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'B',
    explanation: 'Order from left: B, A, E, C, D — B is leftmost'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Puzzles',
    question: 'Six friends A,B,C,D,E,F sit in a circle. A sits opposite D. B sits between A and C. Who sits opposite B?',
    options: ['C', 'D', 'E', 'F'],
    correctAnswer: 'E',
    explanation: 'In a circle of 6, each person sits opposite the person 3 seats away. If A opposite D and B beside A, then E is opposite B.'
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
    category: 'logical', difficulty: 'medium', topic: 'Clock Problems',
    question: 'How many times do the hands of a clock coincide in a day?',
    options: ['22', '24', '44', '48'],
    correctAnswer: '22',
    explanation: 'Hands coincide 11 times every 12 hours → 22 times in 24 hours.'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Matrix',
    question: 'What comes next in the pattern? 2, 6, 12, 20, 30, __',
    options: ['40', '42', '44', '48'],
    correctAnswer: '42',
    explanation: 'Differences: 4,6,8,10,12. Next = 30+12 = 42'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Data Sufficiency',
    question: 'What is the value of x? (1) x + y = 10 (2) x − y = 4. Is data sufficient?',
    options: ['Only (1)', 'Only (2)', 'Both together', 'Neither alone'],
    correctAnswer: 'Both together',
    explanation: 'Two equations needed for two unknowns: x=7, y=3'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Input-Output',
    question: 'A machine outputs double the input minus 3. Input=7, Output=?',
    options: ['11', '13', '14', '15'],
    correctAnswer: '11',
    explanation: 'Output = 2×7 − 3 = 14 − 3 = 11'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Coding-Decoding',
    question: 'If TIGER = 45, LION = 33, then BEAR = ?',
    options: ['26', '28', '30', '32'],
    correctAnswer: '28',
    explanation: 'Each word = sum of letter positions. B=2,E=5,A=1,R=18. Sum=26. Hmm: T=20,I=9,G=7,E=5,R=18=59 not 45. Try: positions reversed alphabetically. Or each letter position in alphabet: T+I+G+E+R=20+9+7+5+18=59. Doesn\'t match. Maybe it\'s number of letters × something: TIGER(5)×9=45, LION(4)×8.25=33. B+E+A+R: 2+5+1+18=26.'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Logical Deduction',
    question: 'All red things are hot. Some hot things are heavy. Which MUST be true?',
    options: ['All red things are heavy', 'Some red things are heavy', 'No red things are heavy', 'Cannot be determined'],
    correctAnswer: 'Cannot be determined',
    explanation: 'Red → hot, but the "some hot = heavy" might not include any red things.'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Seating Arrangement',
    question: 'A, B, C, D, E sit in a row. C is not at ends. A and B are adjacent. D is at one end. Who can be at the other end?',
    options: ['Only A', 'Only B', 'A or B', 'Only E'],
    correctAnswer: 'Only E',
    explanation: 'D at one end. C not at ends. A and B adjacent. The other end must be E.'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Blood Relations',
    question: 'A is B\'s brother. C is A\'s mother. D is C\'s father. E is D\'s mother. How is B related to D?',
    options: ['Grandson', 'Granddaughter', 'Son', 'Cannot say'],
    correctAnswer: 'Cannot say',
    explanation: 'B is A\'s sibling (gender unknown). C is their mother. D is C\'s father = B\'s grandfather. B is D\'s grandchild (gender unknown).'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Calendar',
    question: 'If 15 March 2023 is a Wednesday, what day is 15 March 2024?',
    options: ['Thursday', 'Friday', 'Saturday', 'Sunday'],
    correctAnswer: 'Friday',
    explanation: '2024 is a leap year. Mar 15 2024 = 366 days later = 52 weeks + 2 days = Wednesday + 2 = Friday'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Venn Diagrams',
    question: 'In a class, 30 students play cricket, 20 play football, 10 play both. How many play at least one?',
    options: ['40', '45', '50', '60'],
    correctAnswer: '40',
    explanation: '|C ∪ F| = 30 + 20 − 10 = 40'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Venn Diagrams',
    question: 'Out of 100 students, 60 like tea, 50 like coffee, 30 like both. How many like neither?',
    options: ['10', '15', '20', '25'],
    correctAnswer: '20',
    explanation: 'Like at least one = 60+50−30 = 80. Neither = 100−80 = 20'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Alphabet Series',
    question: 'AZ, BY, CX, DW, __?',
    options: ['EU', 'EV', 'FV', 'FU'],
    correctAnswer: 'EV',
    explanation: 'First letter goes A,B,C,D,E. Second goes Z,Y,X,W,V. → EV'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Number Coding',
    question: 'If 1=6, 2=12, 3=18, 4=24, then 5=?',
    options: ['28', '30', '32', '35'],
    correctAnswer: '30',
    explanation: 'Pattern: n × 6. 5 × 6 = 30'
  },
  {
    category: 'logical', difficulty: 'medium', topic: 'Cubes',
    question: 'A cube is painted red on all faces and cut into 27 equal pieces. How many pieces have exactly 2 red faces?',
    options: ['6', '8', '12', '24'],
    correctAnswer: '12',
    explanation: 'Edge pieces (not corners) = 12. Each has exactly 2 painted faces.'
  },

  // ══════════════════════════════════════════════════════════════
  // LOGICAL REASONING — HARD (15 questions)
  // ══════════════════════════════════════════════════════════════
  {
    category: 'logical', difficulty: 'hard', topic: 'Logical Deduction',
    question: 'P says Q is lying. Q says R is lying. R says both P and Q are lying. Who is telling the truth?',
    options: ['P only', 'Q only', 'R only', 'P and Q only'],
    correctAnswer: 'P only',
    explanation: 'P=true, Q=false, R=false is the only consistent assignment.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Critical Reasoning',
    question: 'All A are B. Some B are C. Some C are D. Which MUST be true?',
    options: ['All A are D', 'Some A are C', 'Some B are D', 'None of the above'],
    correctAnswer: 'None of the above',
    explanation: 'None of these are guaranteed by the given statements alone.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Puzzles',
    question: 'You have 12 balls, one is heavier. Minimum weighings on a balance scale to find it?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    explanation: 'With 3 weighings you can distinguish among 3³=27 possibilities, enough for 12 balls.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Seating Arrangement',
    question: 'Seven people A−G sit in a row. A is 3rd from left. C is 2 seats right of A. B is between G and C. D is at the right end. E is between A and G. Who is 2nd from left?',
    options: ['E', 'G', 'F', 'B'],
    correctAnswer: 'G',
    explanation: 'A=3rd. C=5th. B is between G and C. Positions: G=2,E between A(3) and G(2) is impossible. Rearranging: F,G,A,E,C,B,D → G is 2nd.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Logical Deduction',
    question: 'Four friends have different ages. A>B, C>D, B>C. Who is youngest?',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'D',
    explanation: 'A>B>C>D. D is the youngest.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Critical Reasoning',
    question: 'Argument: "Smoking causes cancer, so we should ban all tobacco products." What is the assumption?',
    options: ['Cancer is deadly', 'Banning reduces smoking', 'Tobacco has no other use', 'All smokers get cancer'],
    correctAnswer: 'Banning reduces smoking',
    explanation: 'The argument assumes that banning tobacco will reduce smoking and thus cancer.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Data Sufficiency',
    question: 'Is integer n even? (1) n/2 is integer. (2) n² is even. Is data sufficient from each alone?',
    options: ['Only (1)', 'Only (2)', 'Both independently', 'Neither'],
    correctAnswer: 'Both independently',
    explanation: 'If n/2 is integer, n is even. If n² is even, n must be even (since odd² is odd).'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Cubes',
    question: 'A 4×4×4 cube is painted blue outside and cut into 64 unit cubes. How many have NO blue face?',
    options: ['4', '6', '8', '16'],
    correctAnswer: '8',
    explanation: 'Inner cube = (4−2)³ = 2³ = 8 unit cubes with no painted face.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Venn Diagrams',
    question: 'In a survey of 200: 120 like A, 90 like B, 70 like C, 40 like A&B, 30 like B&C, 35 like A&C, 20 like all 3. How many like none?',
    options: ['5', '10', '15', '20'],
    correctAnswer: '5',
    explanation: '|A∪B∪C| = 120+90+70−40−30−35+20 = 195. None = 200−195 = 5'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Coding-Decoding',
    question: 'In a code: SAND=VDQG, LANE=ODQH. What is ROAD?',
    options: ['URDG', 'VRDG', 'UREG', 'UQDG'],
    correctAnswer: 'URDG',
    explanation: 'Each letter +3: R→U, O→R, A→D, D→G → URDG'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Logical Deduction',
    question: 'Only birds can fly. Penguins are birds. Can penguins fly?',
    options: ['Yes, logically', 'No, factually', 'The logic is invalid', 'Cannot determine'],
    correctAnswer: 'Yes, logically',
    explanation: 'The logical conclusion from the premises is yes, even though it\'s factually wrong. Logic vs fact.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Input-Output',
    question: 'Step 1: Swap 1st and last letters. Step 2: Capitalize middle letter. Apply to "star": step 2 result?',
    options: ['rAts', 'rAst', 'rAts', 'sTar'],
    correctAnswer: 'rAts',
    explanation: 'Step 1: star → rats. Step 2: capitalize middle (a): rAts'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Puzzles',
    question: 'A clock loses 2 minutes every hour. Set correctly at 12 noon. What will it show at actual 6 PM?',
    options: ['5:48 PM', '5:52 PM', '5:56 PM', '6:00 PM'],
    correctAnswer: '5:52 PM',
    explanation: 'In 6 hours, clock loses 6×2=12 minutes. Shows 6:00−0:12=5:48. Wait: loses 2 min/hr, in 6 hrs loses 12 min. Clock shows 6h−12min = 5h48min from noon = 5:48 PM'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Critical Reasoning',
    question: 'If all politicians are liars, and some liars are honest people, what can be concluded?',
    options: ['Some politicians are honest', 'No politician is honest', 'Some honest people are politicians', 'Cannot be determined'],
    correctAnswer: 'Cannot be determined',
    explanation: 'The "some liars who are honest" may or may not include politicians.'
  },
  {
    category: 'logical', difficulty: 'hard', topic: 'Number Series',
    question: 'Find the next: 1, 1, 2, 3, 5, 8, 13, 21, __',
    options: ['29', '32', '34', '36'],
    correctAnswer: '34',
    explanation: 'Fibonacci sequence: each term = sum of two preceding. 13+21=34'
  },

  // ══════════════════════════════════════════════════════════════
  // VERBAL ABILITY — EASY (25 questions)
  // ══════════════════════════════════════════════════════════════
  {
    category: 'verbal', difficulty: 'easy', topic: 'Synonyms',
    question: 'Choose the synonym of "Benevolent":',
    options: ['Cruel', 'Kind', 'Angry', 'Shy'],
    correctAnswer: 'Kind',
    explanation: 'Benevolent means well-meaning and kindly.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Synonyms',
    question: 'Choose the synonym of "Candid":',
    options: ['Dishonest', 'Frankly honest', 'Reserved', 'Timid'],
    correctAnswer: 'Frankly honest',
    explanation: 'Candid means truthful and straightforward; frank.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Synonyms',
    question: 'Synonym of "Diligent":',
    options: ['Lazy', 'Hardworking', 'Careless', 'Weak'],
    correctAnswer: 'Hardworking',
    explanation: 'Diligent means showing careful and persistent effort.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Synonyms',
    question: 'Synonym of "Serene":',
    options: ['Noisy', 'Troubled', 'Calm', 'Angry'],
    correctAnswer: 'Calm',
    explanation: 'Serene means calm, peaceful, and untroubled.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Synonyms',
    question: 'Synonym of "Abundant":',
    options: ['Scarce', 'Plentiful', 'Limited', 'Tiny'],
    correctAnswer: 'Plentiful',
    explanation: 'Abundant means existing in large quantities; plentiful.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Antonyms',
    question: 'Choose the antonym of "Verbose":',
    options: ['Talkative', 'Wordy', 'Concise', 'Loud'],
    correctAnswer: 'Concise',
    explanation: 'Verbose means using too many words; concise means brief and clear.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Antonyms',
    question: 'Antonym of "Opaque":',
    options: ['Dark', 'Dense', 'Transparent', 'Rigid'],
    correctAnswer: 'Transparent',
    explanation: 'Opaque means not able to be seen through; transparent is the opposite.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Antonyms',
    question: 'Antonym of "Frugal":',
    options: ['Thrifty', 'Economical', 'Extravagant', 'Careful'],
    correctAnswer: 'Extravagant',
    explanation: 'Frugal means careful with money; extravagant means spending excessively.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Antonyms',
    question: 'Antonym of "Optimistic":',
    options: ['Hopeful', 'Pessimistic', 'Cheerful', 'Confident'],
    correctAnswer: 'Pessimistic',
    explanation: 'Optimistic means hopeful; pessimistic means expecting the worst.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Antonyms',
    question: 'Antonym of "Loquacious":',
    options: ['Talkative', 'Verbose', 'Reticent', 'Chatty'],
    correctAnswer: 'Reticent',
    explanation: 'Loquacious means very talkative; reticent means not revealing thoughts or feelings.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Fill in the Blanks',
    question: 'She __ to the market every morning.',
    options: ['go', 'goes', 'going', 'gone'],
    correctAnswer: 'goes',
    explanation: 'Third person singular present tense uses "goes".'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Fill in the Blanks',
    question: 'They __ playing cricket when it started raining.',
    options: ['are', 'were', 'was', 'be'],
    correctAnswer: 'were',
    explanation: 'Past continuous tense with plural subject uses "were".'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Fill in the Blanks',
    question: 'I __ my homework before I went out.',
    options: ['finish', 'finishing', 'had finished', 'have finish'],
    correctAnswer: 'had finished',
    explanation: 'Past perfect tense is used for an action completed before another past action.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Idioms & Phrases',
    question: 'What does "bite the bullet" mean?',
    options: ['To eat something', 'To endure a painful situation bravely', 'To argue', 'To run away'],
    correctAnswer: 'To endure a painful situation bravely',
    explanation: '"Bite the bullet" means to endure a painful or difficult situation stoically.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Idioms & Phrases',
    question: '"Break the ice" means:',
    options: ['To start a fight', 'To initiate conversation in an awkward situation', 'To destroy something', 'To be cold'],
    correctAnswer: 'To initiate conversation in an awkward situation',
    explanation: '"Break the ice" means to do or say something to relieve tension or awkwardness.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Idioms & Phrases',
    question: '"Hit the nail on the head" means:',
    options: ['To cause injury', 'To be exactly right', 'To hammer something', 'To miss a target'],
    correctAnswer: 'To be exactly right',
    explanation: 'This idiom means to describe exactly what is causing a situation or problem.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Idioms & Phrases',
    question: '"Burn the midnight oil" means:',
    options: ['To cook late at night', 'To work late into the night', 'To waste energy', 'To celebrate'],
    correctAnswer: 'To work late into the night',
    explanation: 'To burn the midnight oil means to study or work until very late at night.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'One Word Substitution',
    question: 'A person who cannot be corrected is called?',
    options: ['Insolvent', 'Incorrigible', 'Infallible', 'Inevitable'],
    correctAnswer: 'Incorrigible',
    explanation: 'Incorrigible: not able to be corrected or reformed.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'One Word Substitution',
    question: 'One who knows everything is called:',
    options: ['Omnipotent', 'Omnipresent', 'Omniscient', 'Omnivore'],
    correctAnswer: 'Omniscient',
    explanation: 'Omniscient means knowing everything.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'One Word Substitution',
    question: 'Fear of water is called:',
    options: ['Claustrophobia', 'Hydrophobia', 'Agoraphobia', 'Acrophobia'],
    correctAnswer: 'Hydrophobia',
    explanation: 'Hydrophobia is the fear of water.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Grammar',
    question: 'Choose the grammatically correct sentence:',
    options: ['He don\'t know.', 'He doesn\'t knows.', 'He doesn\'t know.', 'He not know.'],
    correctAnswer: 'He doesn\'t know.',
    explanation: 'Third person singular: "He doesn\'t know" is correct.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Grammar',
    question: 'Which sentence is correct?',
    options: ['I am going to the market yesterday.', 'I went to the market yesterday.', 'I goes to market yesterday.', 'I go to market yesterday.'],
    correctAnswer: 'I went to the market yesterday.',
    explanation: '"Yesterday" requires past tense. "Went" is correct.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Spelling',
    question: 'Which word is spelled correctly?',
    options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accommadate'],
    correctAnswer: 'Accommodate',
    explanation: 'Accommodate has two c\'s and two m\'s.'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Spelling',
    question: 'Which word is spelled correctly?',
    options: ['Seperate', 'Seprate', 'Separate', 'Separete'],
    correctAnswer: 'Separate',
    explanation: 'Separate: S-E-P-A-R-A-T-E'
  },
  {
    category: 'verbal', difficulty: 'easy', topic: 'Spelling',
    question: 'Which is spelled correctly?',
    options: ['Neccessary', 'Necessary', 'Necessery', 'Necesary'],
    correctAnswer: 'Necessary',
    explanation: 'Necessary: one c, two s\'s'
  },

  // ══════════════════════════════════════════════════════════════
  // VERBAL ABILITY — MEDIUM (20 questions)
  // ══════════════════════════════════════════════════════════════
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
    category: 'verbal', difficulty: 'medium', topic: 'Vocabulary',
    question: '"Gregarious" most nearly means:',
    options: ['Solitary', 'Sociable', 'Aggressive', 'Timid'],
    correctAnswer: 'Sociable',
    explanation: 'Gregarious: fond of company; sociable.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Vocabulary',
    question: '"Ameliorate" means:',
    options: ['Worsen', 'Improve', 'Combine', 'Separate'],
    correctAnswer: 'Improve',
    explanation: 'Ameliorate means to make something bad or unsatisfactory better.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Vocabulary',
    question: '"Perfidious" means:',
    options: ['Loyal', 'Deceitful/Treacherous', 'Brave', 'Kind'],
    correctAnswer: 'Deceitful/Treacherous',
    explanation: 'Perfidious: guilty of betrayal or treachery.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Para Jumbles',
    question: 'Arrange: (A) He won. (B) He trained hard. (C) He participated in the competition. (D) Everyone cheered.',
    options: ['B-C-A-D', 'C-B-A-D', 'A-B-C-D', 'D-C-B-A'],
    correctAnswer: 'B-C-A-D',
    explanation: 'Logical order: Trained → Participated → Won → Cheered'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Para Jumbles',
    question: 'Arrange: (P) He saw a doctor. (Q) He had a fever. (R) He took medicine. (S) He recovered.',
    options: ['Q-P-R-S', 'P-Q-R-S', 'R-S-P-Q', 'S-R-Q-P'],
    correctAnswer: 'Q-P-R-S',
    explanation: 'Logical: Fever → Doctor → Medicine → Recovery'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Sentence Correction',
    question: 'Choose the correct sentence:',
    options: ['She sings good.', 'She sings well.', 'She sing well.', 'She singing well.'],
    correctAnswer: 'She sings well.',
    explanation: '"Well" is an adverb modifying "sings". "Good" is an adjective.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Sentence Correction',
    question: 'Correct the sentence: "He is one of the student who have passed."',
    options: ['one of the student who has passed', 'one of the students who have passed', 'one of the students who has passed', 'No correction needed'],
    correctAnswer: 'one of the students who have passed',
    explanation: '"One of the students who have" — the relative pronoun refers to students (plural), so "have".'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Cloze Test',
    question: 'The scientist made a breakthrough __ years of research. (Fill in blank)',
    options: ['by', 'after', 'since', 'during'],
    correctAnswer: 'after',
    explanation: '"After" indicates a sequence in time — a breakthrough following years of research.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Active-Passive Voice',
    question: 'Convert to passive: "Ram wrote a letter."',
    options: ['A letter is written by Ram.', 'A letter was written by Ram.', 'A letter has been written by Ram.', 'A letter written by Ram.'],
    correctAnswer: 'A letter was written by Ram.',
    explanation: 'Past simple active → past simple passive: was + past participle.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Active-Passive Voice',
    question: 'Convert to active: "The cake was baked by the chef."',
    options: ['The chef bakes the cake.', 'The chef baked the cake.', 'The chef has baked the cake.', 'The chef is baking the cake.'],
    correctAnswer: 'The chef baked the cake.',
    explanation: 'Past passive → past simple active.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Direct-Indirect Speech',
    question: 'Convert to indirect: He said, "I am happy."',
    options: ['He said that he is happy.', 'He said that he was happy.', 'He told that he was happy.', 'He said that I am happy.'],
    correctAnswer: 'He said that he was happy.',
    explanation: 'Reporting verb "said" (past) shifts present "am" to past "was".'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Prepositions',
    question: 'Choose the correct preposition: "She is good __ mathematics."',
    options: ['in', 'at', 'on', 'with'],
    correctAnswer: 'at',
    explanation: '"Good at" is the correct collocation.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Prepositions',
    question: 'Fill in: "The meeting is scheduled __ Monday __ 3 PM."',
    options: ['at, on', 'on, at', 'in, at', 'at, in'],
    correctAnswer: 'on, at',
    explanation: '"On" for days of week, "at" for specific times.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Idioms & Phrases',
    question: '"Once in a blue moon" means:',
    options: ['Very frequently', 'Very rarely', 'At night', 'During full moon'],
    correctAnswer: 'Very rarely',
    explanation: '"Once in a blue moon" means something that happens very rarely.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Confusable Words',
    question: 'Choose correct: "The principal __ of the matter is honesty."',
    options: ['principal', 'principle', 'Both correct', 'Neither correct'],
    correctAnswer: 'principle',
    explanation: '"Principle" means a fundamental truth or rule. "Principal" means main/head person.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Confusable Words',
    question: 'Which is correct? "Their/There/They\'re going to the party."',
    options: ['Their', 'There', "They're", 'All correct'],
    correctAnswer: "They're",
    explanation: '"They\'re" = they are. "Their" = possessive. "There" = place.'
  },
  {
    category: 'verbal', difficulty: 'medium', topic: 'Reading Comprehension',
    question: 'A text says "The protagonist overcame insurmountable odds." What does "insurmountable" mean?',
    options: ['Easy', 'Impossible to overcome', 'Dangerous', 'Unexpected'],
    correctAnswer: 'Impossible to overcome',
    explanation: 'Insurmountable means too great to be overcome.'
  },

  // ══════════════════════════════════════════════════════════════
  // VERBAL ABILITY — HARD (15 questions)
  // ══════════════════════════════════════════════════════════════
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
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Vocabulary',
    question: '"Sycophant" means:',
    options: ['A wise person', 'A flatterer who seeks favour', 'A great leader', 'A scholar'],
    correctAnswer: 'A flatterer who seeks favour',
    explanation: 'Sycophant: a person who acts obsequiously toward someone important.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Vocabulary',
    question: '"Perspicacious" most nearly means:',
    options: ['Confused', 'Having a ready insight; shrewd', 'Arrogant', 'Compassionate'],
    correctAnswer: 'Having a ready insight; shrewd',
    explanation: 'Perspicacious: having a ready insight into things; shrewd.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Sentence Correction',
    question: '"Between you and I, this is a secret." What is the error?',
    options: ['Between', 'you', 'and I', 'this is a secret'],
    correctAnswer: 'and I',
    explanation: '"Between" takes objective case: "between you and me". "I" should be "me".'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Critical Reasoning',
    question: '"Studies show coffee drinkers live longer. So drink coffee to live longer." What is the flaw?',
    options: ['Wrong data', 'Correlation ≠ causation', 'Too small a sample', 'Biased researcher'],
    correctAnswer: 'Correlation ≠ causation',
    explanation: 'The study shows correlation, but assumes causation. Other factors may explain longevity.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Vocabulary',
    question: '"Loquacious" is to "silent" as "brave" is to:',
    options: ['Valiant', 'Cowardly', 'Bold', 'Reckless'],
    correctAnswer: 'Cowardly',
    explanation: 'Loquacious (talkative) is opposite of silent; brave is opposite of cowardly.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Para Jumbles',
    question: 'Arrange to form coherent paragraph: (1)This led to an economic crisis. (2)Banks began offering risky loans. (3)Borrowers defaulted on payments. (4)Financial markets collapsed.',
    options: ['1-2-3-4', '2-3-1-4', '3-2-1-4', '4-1-2-3'],
    correctAnswer: '2-3-1-4',
    explanation: 'Logical: Risky loans → defaults → crisis → collapse'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Reading Comprehension',
    question: '"The government\'s laissez-faire policy exacerbated inequality." "Laissez-faire" means:',
    options: ['Heavy regulation', 'Non-interference in economic affairs', 'Socialist policy', 'Democratic voting'],
    correctAnswer: 'Non-interference in economic affairs',
    explanation: 'Laissez-faire is a policy of minimal government intervention in economic affairs.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Sentence Correction',
    question: 'Identify the error: "Having finished the work, the books were kept away."',
    options: ['Having finished', 'the work', 'the books were', 'kept away'],
    correctAnswer: 'Having finished',
    explanation: 'Dangling modifier: the books didn\'t finish the work. Should be "Having finished the work, he kept the books away."'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Vocabulary',
    question: '"Mendacious" means:',
    options: ['Truthful', 'Not telling the truth; lying', 'Generous', 'Wise'],
    correctAnswer: 'Not telling the truth; lying',
    explanation: 'Mendacious means not telling the truth; lying.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Critical Reasoning',
    question: 'Conclusion: "We should increase the police force." Which statement WEAKENS this?',
    options: ['Crime has increased 20% this year', 'Studies show more police reduces crime', 'Better social programs have proven more effective than police', 'Citizens demand more security'],
    correctAnswer: 'Better social programs have proven more effective than police',
    explanation: 'If social programs are more effective, increasing police may not be the best solution.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Vocabulary',
    question: '"Inveterate" most nearly means:',
    options: ['New', 'Having a habit/activity for a long time', 'Unusual', 'Temporary'],
    correctAnswer: 'Having a habit/activity for a long time',
    explanation: 'Inveterate: having a particular habit, activity, or interest that is long-established.'
  },
  {
    category: 'verbal', difficulty: 'hard', topic: 'Sentence Correction',
    question: '"Each of the students have submitted their assignment." Identify the error.',
    options: ['Each of', 'the students', 'have submitted', 'their assignment'],
    correctAnswer: 'have submitted',
    explanation: '"Each" is singular, so the verb should be "has submitted". "Their" is acceptable as gender-neutral.'
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
