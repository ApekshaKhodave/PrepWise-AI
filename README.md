# PrepWise AI - Smart Placement Preparation Portal

A modern, full-stack AI-powered placement preparation platform for engineering students.

## Features

- **Aptitude Tests**: Quantitative, Logical, and Verbal reasoning tests with detailed analytics
- **Coding Practice**: 1000+ coding problems with difficulty levels and company tags
- **AI Resume Analyzer**: Get ATS score and improvement suggestions
- **AI Mock Interviews**: Practice with AI interviewer and get real-time feedback
- **Company Roadmaps**: Curated preparation paths for top companies
- **Gamification**: XP points, streaks, achievements, and leaderboards
- **Analytics Dashboard**: Track your progress with interactive charts
- **Dark/Light Theme**: Modern UI with theme support

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Chart.js for analytics
- Font Awesome icons
- AOS (Animate On Scroll)
- Responsive design with CSS Grid & Flexbox

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for file uploads

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd prepwise-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prepwise-ai
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo systemctl start mongod
```

5. **Create required directories**
```bash
mkdir -p uploads/resumes
```

6. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

7. **Access the application**
Open your browser and navigate to:
```
http://localhost:5000
```

## Project Structure

```
prepwise-ai/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── middleware/      # Authentication middleware
├── public/
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   ├── *.html          # HTML pages
│   └── uploads/        # Uploaded files
├── server.js           # Main server file
├── package.json        # Dependencies
└── README.md          # Documentation
```

## Pages

1. **Landing Page** (`index.html`) - Hero section, features, testimonials
2. **Login/Signup** (`login.html`, `signup.html`) - Authentication pages
3. **Dashboard** (`dashboard.html`) - Main dashboard with stats and charts
4. **Aptitude Tests** (`aptitude.html`) - Take timed aptitude tests
5. **Coding Practice** (`coding.html`) - Solve coding problems
6. **Resume Analyzer** (`resume.html`) - Upload and analyze resume
7. **Mock Interview** (`interview.html`) - AI-powered interview practice
8. **Company Roadmaps** (`roadmap.html`) - Preparation roadmaps
9. **Leaderboard** (`leaderboard.html`) - Global rankings
10. **Profile & Settings** (`profile.html`) - User profile management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Tests
- `GET /api/tests/questions` - Get test questions
- `POST /api/tests/submit` - Submit test answers
- `GET /api/tests/history` - Get test history

### Coding
- `GET /api/coding/problems` - Get coding problems
- `GET /api/coding/problems/:id` - Get single problem
- `POST /api/coding/submit` - Submit solution

### Resume
- `POST /api/resume/analyze` - Analyze resume
- `GET /api/resume/reports` - Get previous reports

### Interview
- `GET /api/interview/questions` - Get interview questions
- `POST /api/interview/submit` - Submit interview
- `GET /api/interview/history` - Get interview history

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard

### User
- `GET /api/user/dashboard` - Get dashboard data
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/preferences` - Update preferences

## Features in Detail

### Gamification System
- **XP Points**: Earn points for completing tests, solving problems
- **Streaks**: Maintain daily activity streaks
- **Achievements**: Unlock badges for milestones
- **Leaderboard**: Compete with other students

### Analytics
- Performance tracking over time
- Skill distribution charts
- Weak topic identification
- Progress visualization

### AI Features
- Resume ATS scoring
- Mock interview feedback
- Personalized recommendations
- Weak area analysis

## Development

### Adding New Features
1. Create backend routes in `backend/routes/`
2. Create frontend pages in `public/`
3. Add corresponding JavaScript in `public/js/`
4. Update API endpoints in JavaScript files

### Database Models
- User: User profile and stats
- Test: Test results and analytics
- Question: Test questions
- CodingProblem: Coding challenges
- ResumeReport: Resume analysis reports
- InterviewFeedback: Interview feedback

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- File upload restrictions
- CORS enabled
- Environment variables for sensitive data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For support, email support@prepwise.ai or create an issue in the repository.

## Acknowledgments

- Font Awesome for icons
- Chart.js for charts
- AOS for animations
- MongoDB for database
- Express.js for backend framework

---

**PrepWise AI** - Your AI-Powered Placement Preparation Partner 🚀
