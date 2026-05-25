// Aptitude Test JavaScript

// API Configuration - works for both local and production
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';
let currentCategory = '';
let currentDifficulty = '';
let questions = [];
let currentQuestionIndex = 0;
let answers = [];
let timerInterval;
let timeRemaining = 0;

// Check Auth
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return token;
}

// Get Auth Headers
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
}

// Show Test Options
function showTestOptions(category) {
    currentCategory = category;
    const modal = document.getElementById('testModal');
    modal.classList.add('show');
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('testModal');
    modal.classList.remove('show');
}

// Start Test
async function startTest(difficulty) {
    currentDifficulty = difficulty;
    closeModal();
    
    // Set timer based on difficulty
    const timers = { easy: 15 * 60, medium: 25 * 60, hard: 35 * 60 };
    timeRemaining = timers[difficulty];
    
    // Fetch questions
    await fetchQuestions();
    
    // Show test interface
    document.querySelector('.dashboard-content').style.display = 'none';
    document.getElementById('testInterface').style.display = 'block';
    
    // Start timer
    startTimer();
    
    // Load first question
    loadQuestion(0);
    
    // Create question palette
    createQuestionPalette();
}

// Fetch Questions
async function fetchQuestions() {
    try {
        const response = await fetch(
            `${API_URL}/tests/questions?category=${currentCategory}&difficulty=${currentDifficulty}&limit=10`,
            { headers: getAuthHeaders() }
        );
        
        if (response.ok) {
            const data = await response.json();
            questions = data.questions;
            answers = new Array(questions.length).fill(null);
        } else {
            // Mock questions for demo
            questions = generateMockQuestions(10);
            answers = new Array(questions.length).fill(null);
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        questions = generateMockQuestions(10);
        answers = new Array(questions.length).fill(null);
    }
}

// Real Question Bank
const questionBank = {
    quantitative: {
        easy: [
            { _id: 'q1', question: 'If 20% of a number is 50, what is the number?', options: ['200', '250', '300', '350'], correctAnswer: '250', topic: 'Percentage' },
            { _id: 'q2', question: 'What is 15% of 200?', options: ['25', '30', '35', '40'], correctAnswer: '30', topic: 'Percentage' },
            { _id: 'q3', question: 'A train travels 60 km in 1 hour. How far will it travel in 3.5 hours?', options: ['180 km', '200 km', '210 km', '220 km'], correctAnswer: '210 km', topic: 'Speed & Distance' },
            { _id: 'q4', question: 'The average of 5 numbers is 20. If one number is excluded, the average becomes 15. What is the excluded number?', options: ['35', '40', '45', '50'], correctAnswer: '40', topic: 'Average' },
            { _id: 'q5', question: 'If the cost price of 12 pens is equal to the selling price of 10 pens, what is the profit percentage?', options: ['10%', '15%', '20%', '25%'], correctAnswer: '20%', topic: 'Profit & Loss' },
            { _id: 'q6', question: 'What is the simple interest on Rs. 1000 for 2 years at 5% per annum?', options: ['Rs. 50', 'Rs. 100', 'Rs. 150', 'Rs. 200'], correctAnswer: 'Rs. 100', topic: 'Simple Interest' },
            { _id: 'q7', question: 'If 3x + 5 = 20, what is the value of x?', options: ['3', '4', '5', '6'], correctAnswer: '5', topic: 'Algebra' },
            { _id: 'q8', question: 'The ratio of boys to girls in a class is 3:2. If there are 15 boys, how many girls are there?', options: ['8', '10', '12', '15'], correctAnswer: '10', topic: 'Ratio & Proportion' },
            { _id: 'q9', question: 'What is the area of a rectangle with length 10 cm and width 5 cm?', options: ['40 sq cm', '45 sq cm', '50 sq cm', '55 sq cm'], correctAnswer: '50 sq cm', topic: 'Mensuration' },
            { _id: 'q10', question: 'If a number is increased by 25% and then decreased by 20%, what is the net change?', options: ['0%', '5% increase', '5% decrease', '10% increase'], correctAnswer: '0%', topic: 'Percentage' }
        ],
        medium: [
            { _id: 'q11', question: 'A can complete a work in 12 days and B can complete it in 18 days. How many days will they take to complete it together?', options: ['6.5 days', '7.2 days', '8 days', '9 days'], correctAnswer: '7.2 days', topic: 'Time & Work' },
            { _id: 'q12', question: 'The compound interest on Rs. 10,000 for 2 years at 10% per annum is:', options: ['Rs. 2000', 'Rs. 2100', 'Rs. 2200', 'Rs. 2500'], correctAnswer: 'Rs. 2100', topic: 'Compound Interest' },
            { _id: 'q13', question: 'A shopkeeper marks his goods 40% above cost price but allows a discount of 20%. What is his profit percentage?', options: ['10%', '12%', '15%', '18%'], correctAnswer: '12%', topic: 'Profit & Loss' },
            { _id: 'q14', question: 'The sum of three consecutive odd numbers is 63. What is the largest number?', options: ['19', '21', '23', '25'], correctAnswer: '23', topic: 'Number Series' },
            { _id: 'q15', question: 'A boat travels 30 km upstream in 6 hours and 44 km downstream in 4 hours. What is the speed of the stream?', options: ['3 km/h', '4 km/h', '5 km/h', '6 km/h'], correctAnswer: '3 km/h', topic: 'Boats & Streams' },
            { _id: 'q16', question: 'If the price of a commodity increases by 40%, by what percentage should consumption be reduced so that expenditure remains the same?', options: ['28.57%', '30%', '33.33%', '40%'], correctAnswer: '28.57%', topic: 'Percentage' },
            { _id: 'q17', question: 'The ages of A and B are in the ratio 3:5. After 4 years, the ratio will be 2:3. What is the present age of A?', options: ['12 years', '16 years', '18 years', '20 years'], correctAnswer: '12 years', topic: 'Age Problems' },
            { _id: 'q18', question: 'A mixture contains milk and water in the ratio 5:3. If 8 liters of water is added, the ratio becomes 5:5. What was the initial quantity of milk?', options: ['20 liters', '25 liters', '30 liters', '35 liters'], correctAnswer: '20 liters', topic: 'Mixture & Alligation' },
            { _id: 'q19', question: 'The diagonal of a square is 10√2 cm. What is its area?', options: ['100 sq cm', '120 sq cm', '140 sq cm', '200 sq cm'], correctAnswer: '100 sq cm', topic: 'Mensuration' },
            { _id: 'q20', question: 'If log₁₀ 2 = 0.3010, what is log₁₀ 8?', options: ['0.6020', '0.9030', '1.2040', '1.5050'], correctAnswer: '0.9030', topic: 'Logarithms' }
        ],
        hard: [
            { _id: 'q21', question: 'A and B can complete a work in 12 days, B and C in 15 days, C and A in 20 days. How many days will A alone take to complete the work?', options: ['20 days', '24 days', '30 days', '40 days'], correctAnswer: '30 days', topic: 'Time & Work' },
            { _id: 'q22', question: 'The difference between compound interest and simple interest on a sum for 2 years at 10% per annum is Rs. 100. What is the sum?', options: ['Rs. 8000', 'Rs. 10000', 'Rs. 12000', 'Rs. 15000'], correctAnswer: 'Rs. 10000', topic: 'Interest' },
            { _id: 'q23', question: 'A train crosses a platform 100 m long in 15 seconds and a man standing on the platform in 10 seconds. What is the length of the train?', options: ['150 m', '200 m', '250 m', '300 m'], correctAnswer: '200 m', topic: 'Speed & Distance' },
            { _id: 'q24', question: 'The average weight of 8 persons increases by 2.5 kg when a new person replaces one of them weighing 65 kg. What is the weight of the new person?', options: ['75 kg', '80 kg', '85 kg', '90 kg'], correctAnswer: '85 kg', topic: 'Average' },
            { _id: 'q25', question: 'A sum of money doubles itself in 8 years at simple interest. In how many years will it become 5 times?', options: ['24 years', '28 years', '32 years', '36 years'], correctAnswer: '32 years', topic: 'Simple Interest' },
            { _id: 'q26', question: 'If x² + 1/x² = 7, what is the value of x³ + 1/x³?', options: ['15', '18', '20', '24'], correctAnswer: '18', topic: 'Algebra' },
            { _id: 'q27', question: 'A cistern has two pipes. One can fill it in 3 hours and the other can empty it in 5 hours. If both pipes are opened simultaneously, in how many hours will the cistern be filled?', options: ['6.5 hours', '7 hours', '7.5 hours', '8 hours'], correctAnswer: '7.5 hours', topic: 'Pipes & Cisterns' },
            { _id: 'q28', question: 'The probability of getting at least one head when three coins are tossed is:', options: ['1/8', '3/8', '5/8', '7/8'], correctAnswer: '7/8', topic: 'Probability' },
            { _id: 'q29', question: 'A number when divided by 5 leaves remainder 3. What will be the remainder when the square of this number is divided by 5?', options: ['1', '2', '3', '4'], correctAnswer: '4', topic: 'Number Theory' },
            { _id: 'q30', question: 'The sum of the first n natural numbers is 210. What is the value of n?', options: ['18', '19', '20', '21'], correctAnswer: '20', topic: 'Series' }
        ]
    },
    logical: {
        easy: [
            { _id: 'l1', question: 'Find the next number in the series: 2, 4, 8, 16, ?', options: ['24', '28', '32', '36'], correctAnswer: '32', topic: 'Number Series' },
            { _id: 'l2', question: 'If BOOK is coded as CPPL, how is PAGE coded?', options: ['QBHF', 'QBGF', 'QAHF', 'PBHF'], correctAnswer: 'QBHF', topic: 'Coding-Decoding' },
            { _id: 'l3', question: 'Which one is different from the rest? Dog, Cat, Lion, Table', options: ['Dog', 'Cat', 'Lion', 'Table'], correctAnswer: 'Table', topic: 'Odd One Out' },
            { _id: 'l4', question: 'Complete the analogy: Day : Night :: Summer : ?', options: ['Winter', 'Rain', 'Hot', 'Cold'], correctAnswer: 'Winter', topic: 'Analogy' },
            { _id: 'l5', question: 'If all roses are flowers and some flowers are red, which statement is definitely true?', options: ['All roses are red', 'Some roses are red', 'Some flowers are roses', 'All red things are flowers'], correctAnswer: 'Some flowers are roses', topic: 'Syllogism' },
            { _id: 'l6', question: 'Find the missing number: 3, 6, 11, 18, ?', options: ['25', '27', '29', '31'], correctAnswer: '27', topic: 'Number Series' },
            { _id: 'l7', question: 'If South-East becomes North and North-East becomes West, what will West become?', options: ['North-East', 'South-East', 'South-West', 'North-West'], correctAnswer: 'South-East', topic: 'Direction Sense' },
            { _id: 'l8', question: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?', options: ['EOJDEJFM', 'EOJDJEFM', 'EOJDEJNF', 'EOJDJFEM'], correctAnswer: 'EOJDJEFM', topic: 'Coding-Decoding' },
            { _id: 'l9', question: 'Which number should replace the question mark? 4, 9, 16, 25, ?', options: ['30', '32', '34', '36'], correctAnswer: '36', topic: 'Number Series' },
            { _id: 'l10', question: 'If A is the father of B, but B is not the son of A, what is B to A?', options: ['Nephew', 'Daughter', 'Niece', 'Sister'], correctAnswer: 'Daughter', topic: 'Blood Relations' }
        ],
        medium: [
            { _id: 'l11', question: 'Find the next term: 1, 4, 9, 16, 25, 36, ?', options: ['42', '45', '49', '52'], correctAnswer: '49', topic: 'Number Series' },
            { _id: 'l12', question: 'In a row of children, Ravi is 9th from left and Mohan is 12th from right. When they interchange positions, Ravi becomes 17th from left. How many children are there in the row?', options: ['26', '27', '28', '29'], correctAnswer: '28', topic: 'Seating Arrangement' },
            { _id: 'l13', question: 'If FRIEND is coded as HUMJTK, how is CANDLE coded?', options: ['EDRIRL', 'ECSIRL', 'EDRPJM', 'ECSNJM'], correctAnswer: 'EDRPJM', topic: 'Coding-Decoding' },
            { _id: 'l14', question: 'A clock shows 3:15. What is the angle between hour and minute hands?', options: ['0°', '7.5°', '15°', '22.5°'], correctAnswer: '7.5°', topic: 'Clock & Calendar' },
            { _id: 'l15', question: 'If the day before yesterday was Thursday, what will be the day after tomorrow?', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], correctAnswer: 'Monday', topic: 'Calendar' },
            { _id: 'l16', question: 'Complete the series: Z, X, V, T, R, ?', options: ['O', 'P', 'Q', 'S'], correctAnswer: 'P', topic: 'Letter Series' },
            { _id: 'l17', question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. How is A related to D?', options: ['Grandmother', 'Granddaughter', 'Daughter', 'Sister'], correctAnswer: 'Granddaughter', topic: 'Blood Relations' },
            { _id: 'l18', question: 'Find the odd one out: 3, 5, 11, 14, 17, 21', options: ['3', '5', '14', '21'], correctAnswer: '14', topic: 'Odd One Out' },
            { _id: 'l19', question: 'If in a code language, MADRAS is written as NBESBT, how is BOMBAY written?', options: ['CPNCBZ', 'CPOCBZ', 'CPNCAZ', 'DPNCBZ'], correctAnswer: 'CPNCBZ', topic: 'Coding-Decoding' },
            { _id: 'l20', question: 'A man walks 5 km toward south and then turns to the right. After walking 3 km he turns to the left and walks 5 km. In which direction is he from the starting point?', options: ['West', 'South', 'North-East', 'South-West'], correctAnswer: 'South-West', topic: 'Direction Sense' }
        ],
        hard: [
            { _id: 'l21', question: 'Find the missing number in the series: 2, 5, 10, 17, 26, 37, ?', options: ['48', '50', '52', '54'], correctAnswer: '50', topic: 'Number Series' },
            { _id: 'l22', question: 'In a certain code, BREAKTHROUGH is written as EAOUHRBRGHKT. How is DISTRIBUTION written?', options: ['STIDIIBUNOTR', 'STIDIIBUNORT', 'STIDIIBUTNOR', 'STIDIIBNUTOR'], correctAnswer: 'STIDIIBUNORT', topic: 'Coding-Decoding' },
            { _id: 'l23', question: 'Five friends A, B, C, D and E are sitting in a row. C is sitting at one end. B is sitting next to E. D is not sitting with C. Who is sitting in the middle?', options: ['A', 'B', 'D', 'E'], correctAnswer: 'E', topic: 'Seating Arrangement' },
            { _id: 'l24', question: 'If 1st January 2000 was Saturday, what day was 1st January 2001?', options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday'], correctAnswer: 'Monday', topic: 'Calendar' },
            { _id: 'l25', question: 'A cube is painted red on all faces. It is cut into 64 smaller cubes of equal size. How many cubes have no face painted?', options: ['8', '16', '24', '32'], correctAnswer: '8', topic: 'Cube & Dice' },
            { _id: 'l26', question: 'In a family of six persons A, B, C, D, E and F, there are two married couples. D is grandmother of A and mother of B. C is wife of B and mother of F. F is the granddaughter of D. Who is the husband of E?', options: ['A', 'B', 'C', 'F'], correctAnswer: 'B', topic: 'Blood Relations' },
            { _id: 'l27', question: 'Find the next term: 1, 1, 2, 3, 5, 8, 13, ?', options: ['18', '19', '20', '21'], correctAnswer: '21', topic: 'Fibonacci Series' },
            { _id: 'l28', question: 'A clock is set right at 8 AM. The clock gains 10 minutes in 24 hours. What will be the true time when the clock indicates 1 PM on the following day?', options: ['12:48 PM', '12:46 PM', '1:00 PM', '12:50 PM'], correctAnswer: '12:48 PM', topic: 'Clock' },
            { _id: 'l29', question: 'If PALE is coded as 2134, EARTH is coded as 41590, how is PEARL coded?', options: ['29530', '24153', '25413', '25430'], correctAnswer: '24153', topic: 'Coding-Decoding' },
            { _id: 'l30', question: 'A man is facing north. He turns 45° in the clockwise direction and then another 180° in the same direction and then 270° in the anticlockwise direction. Which direction is he facing now?', options: ['South', 'North-West', 'West', 'South-West'], correctAnswer: 'South-West', topic: 'Direction Sense' }
        ]
    },
    verbal: {
        easy: [
            { _id: 'v1', question: 'Choose the synonym of "Happy":', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correctAnswer: 'Joyful', topic: 'Synonyms' },
            { _id: 'v2', question: 'Choose the antonym of "Hot":', options: ['Warm', 'Cold', 'Cool', 'Mild'], correctAnswer: 'Cold', topic: 'Antonyms' },
            { _id: 'v3', question: 'Fill in the blank: She is good ___ mathematics.', options: ['in', 'at', 'on', 'with'], correctAnswer: 'at', topic: 'Prepositions' },
            { _id: 'v4', question: 'Identify the correctly spelled word:', options: ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'], correctAnswer: 'Accommodate', topic: 'Spelling' },
            { _id: 'v5', question: 'Choose the correct sentence:', options: ['He don\'t like coffee', 'He doesn\'t likes coffee', 'He doesn\'t like coffee', 'He don\'t likes coffee'], correctAnswer: 'He doesn\'t like coffee', topic: 'Grammar' },
            { _id: 'v6', question: 'What is the meaning of "Benevolent"?', options: ['Kind', 'Cruel', 'Angry', 'Sad'], correctAnswer: 'Kind', topic: 'Vocabulary' },
            { _id: 'v7', question: 'Choose the synonym of "Brave":', options: ['Coward', 'Courageous', 'Weak', 'Timid'], correctAnswer: 'Courageous', topic: 'Synonyms' },
            { _id: 'v8', question: 'Fill in the blank: I have been waiting ___ two hours.', options: ['since', 'for', 'from', 'till'], correctAnswer: 'for', topic: 'Prepositions' },
            { _id: 'v9', question: 'Choose the antonym of "Ancient":', options: ['Old', 'Modern', 'Historic', 'Traditional'], correctAnswer: 'Modern', topic: 'Antonyms' },
            { _id: 'v10', question: 'Identify the noun in the sentence: "The cat is sleeping."', options: ['The', 'cat', 'is', 'sleeping'], correctAnswer: 'cat', topic: 'Parts of Speech' }
        ],
        medium: [
            { _id: 'v11', question: 'Choose the word that best completes the analogy: Book : Author :: Painting : ?', options: ['Canvas', 'Artist', 'Museum', 'Color'], correctAnswer: 'Artist', topic: 'Analogies' },
            { _id: 'v12', question: 'Identify the error: "Neither of the two boys are present."', options: ['Neither', 'two boys', 'are', 'present'], correctAnswer: 'are', topic: 'Error Detection' },
            { _id: 'v13', question: 'Choose the correct idiom meaning for "Piece of cake":', options: ['Very difficult', 'Very easy', 'Very expensive', 'Very sweet'], correctAnswer: 'Very easy', topic: 'Idioms' },
            { _id: 'v14', question: 'Fill in the blank with the correct phrasal verb: "The meeting was ___ due to bad weather."', options: ['put off', 'put on', 'put up', 'put down'], correctAnswer: 'put off', topic: 'Phrasal Verbs' },
            { _id: 'v15', question: 'Choose the synonym of "Eloquent":', options: ['Silent', 'Articulate', 'Confused', 'Hesitant'], correctAnswer: 'Articulate', topic: 'Synonyms' },
            { _id: 'v16', question: 'What is the passive voice of "She writes a letter"?', options: ['A letter is written by her', 'A letter was written by her', 'A letter is being written by her', 'A letter has been written by her'], correctAnswer: 'A letter is written by her', topic: 'Voice' },
            { _id: 'v17', question: 'Choose the antonym of "Abundant":', options: ['Plentiful', 'Scarce', 'Sufficient', 'Ample'], correctAnswer: 'Scarce', topic: 'Antonyms' },
            { _id: 'v18', question: 'Identify the figure of speech: "The classroom was a zoo."', options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'], correctAnswer: 'Metaphor', topic: 'Figures of Speech' },
            { _id: 'v19', question: 'Choose the correctly punctuated sentence:', options: ['Let\'s eat grandma', 'Lets eat, grandma', 'Let\'s eat, grandma', 'Lets eat grandma'], correctAnswer: 'Let\'s eat, grandma', topic: 'Punctuation' },
            { _id: 'v20', question: 'What does "Break the ice" mean?', options: ['To start a conversation', 'To break something', 'To feel cold', 'To make ice'], correctAnswer: 'To start a conversation', topic: 'Idioms' }
        ],
        hard: [
            { _id: 'v21', question: 'Choose the word closest in meaning to "Ephemeral":', options: ['Permanent', 'Temporary', 'Eternal', 'Lasting'], correctAnswer: 'Temporary', topic: 'Vocabulary' },
            { _id: 'v22', question: 'Identify the sentence with correct subject-verb agreement:', options: ['The team are playing well', 'The team is playing well', 'The team were playing well', 'The team have playing well'], correctAnswer: 'The team is playing well', topic: 'Grammar' },
            { _id: 'v23', question: 'Choose the antonym of "Cacophony":', options: ['Noise', 'Harmony', 'Discord', 'Chaos'], correctAnswer: 'Harmony', topic: 'Antonyms' },
            { _id: 'v24', question: 'What is the meaning of "Ubiquitous"?', options: ['Rare', 'Present everywhere', 'Ancient', 'Modern'], correctAnswer: 'Present everywhere', topic: 'Vocabulary' },
            { _id: 'v25', question: 'Convert to indirect speech: He said, "I am going to school."', options: ['He said that he was going to school', 'He said that he is going to school', 'He said that he has been going to school', 'He said that he will go to school'], correctAnswer: 'He said that he was going to school', topic: 'Narration' },
            { _id: 'v26', question: 'Choose the synonym of "Meticulous":', options: ['Careless', 'Careful', 'Hasty', 'Rough'], correctAnswer: 'Careful', topic: 'Synonyms' },
            { _id: 'v27', question: 'Identify the type of clause: "Although it was raining, we went out."', options: ['Noun clause', 'Adjective clause', 'Adverb clause', 'Independent clause'], correctAnswer: 'Adverb clause', topic: 'Clauses' },
            { _id: 'v28', question: 'What does "Blessing in disguise" mean?', options: ['A hidden curse', 'A good thing that seemed bad at first', 'A religious blessing', 'A costume party'], correctAnswer: 'A good thing that seemed bad at first', topic: 'Idioms' },
            { _id: 'v29', question: 'Choose the correct form: "If I ___ you, I would accept the offer."', options: ['am', 'was', 'were', 'be'], correctAnswer: 'were', topic: 'Conditionals' },
            { _id: 'v30', question: 'What is the meaning of "Pragmatic"?', options: ['Idealistic', 'Practical', 'Theoretical', 'Imaginative'], correctAnswer: 'Practical', topic: 'Vocabulary' }
        ]
    }
};

// Generate Mock Questions
function generateMockQuestions(count) {
    const categoryQuestions = questionBank[currentCategory];
    if (!categoryQuestions) {
        return [];
    }
    
    const difficultyQuestions = categoryQuestions[currentDifficulty];
    if (!difficultyQuestions) {
        return [];
    }
    
    // Shuffle and return requested number of questions
    const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Start Timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitTest();
        }
    }, 1000);
}

// Update Timer Display
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Load Question
function loadQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    
    document.getElementById('currentQuestion').textContent = index + 1;
    document.getElementById('totalQuestions').textContent = questions.length;
    document.getElementById('questionText').textContent = question.question;
    
    // Load options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        if (answers[index] === option) {
            optionDiv.classList.add('selected');
        }
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(option);
        optionsContainer.appendChild(optionDiv);
    });
    
    updateQuestionPalette();
}

// Select Option
function selectOption(option) {
    answers[currentQuestionIndex] = option;
    loadQuestion(currentQuestionIndex);
}

// Create Question Palette
function createQuestionPalette() {
    const palette = document.getElementById('questionPalette');
    palette.innerHTML = '';
    
    questions.forEach((_, index) => {
        const btn = document.createElement('button');
        btn.className = 'question-number';
        btn.textContent = index + 1;
        btn.onclick = () => loadQuestion(index);
        palette.appendChild(btn);
    });
}

// Update Question Palette
function updateQuestionPalette() {
    const buttons = document.querySelectorAll('.question-number');
    buttons.forEach((btn, index) => {
        btn.classList.remove('current', 'answered');
        if (index === currentQuestionIndex) {
            btn.classList.add('current');
        } else if (answers[index] !== null) {
            btn.classList.add('answered');
        }
    });
}

// Previous Question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

// Next Question
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        loadQuestion(currentQuestionIndex + 1);
    }
}

// Submit Test
async function submitTest() {
    clearInterval(timerInterval);
    
    // Calculate score locally
    let correctAnswers = 0;
    const weakTopicsSet = new Set();
    
    questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
            correctAnswers++;
        } else if (answers[index]) {
            weakTopicsSet.add(q.topic);
        }
    });
    
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const timeTaken = (currentDifficulty === 'easy' ? 15 : currentDifficulty === 'medium' ? 25 : 35) * 60 - timeRemaining;
    
    const result = {
        score,
        correctAnswers,
        totalQuestions,
        accuracy: score,
        weakTopics: Array.from(weakTopicsSet),
        xpEarned: score
    };
    
    // Try to submit to server
    const testAnswers = questions.map((q, index) => ({
        questionId: q._id,
        selectedAnswer: answers[index] || ''
    }));
    
    try {
        const response = await fetch(`${API_URL}/tests/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                category: currentCategory,
                difficulty: currentDifficulty,
                answers: testAnswers,
                timeTaken
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            showResult(data.result);
        } else {
            showResult(result);
        }
    } catch (error) {
        console.error('Error submitting test:', error);
        showResult(result);
    }
}

// Show Result
function showResult(result) {
    document.getElementById('testInterface').style.display = 'none';
    
    const modal = document.getElementById('resultModal');
    modal.classList.add('show');
    
    // Animate score circle
    const scoreCircle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (result.score / 100) * circumference;
    scoreCircle.style.strokeDashoffset = offset;
    
    // Update result data
    document.getElementById('finalScore').textContent = result.score + '%';
    document.getElementById('correctAnswers').textContent = result.correctAnswers;
    document.getElementById('wrongAnswers').textContent = result.totalQuestions - result.correctAnswers;
    document.getElementById('xpEarned').textContent = result.xpEarned;
    
    // Weak topics
    const weakTopicsList = document.getElementById('weakTopicsList');
    weakTopicsList.innerHTML = '';
    result.weakTopics.forEach(topic => {
        const badge = document.createElement('span');
        badge.className = 'badge badge-orange';
        badge.textContent = topic;
        weakTopicsList.appendChild(badge);
    });
}

// Close Result
function closeResult() {
    document.getElementById('resultModal').classList.remove('show');
    document.querySelector('.dashboard-content').style.display = 'block';
    window.location.reload();
}

// Retake Test
function retakeTest() {
    closeResult();
    startTest(currentDifficulty);
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}
