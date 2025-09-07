# Smart Civic Issue Reporting & Resolution System

![PragatiPath Banner](https://img.shields.io/badge/CivicFix-Community%20Powered%20Solutions-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-brightgreen)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A comprehensive mobile-first platform that empowers citizens to report, track, and help resolve civic issues in their communities while promoting transparency and accountability through gamification and AI-powered prioritization.

## 🌟 Features

### For Citizens
- **Issue Reporting**: Report issues with photos, voice notes, text descriptions, and geotagging
- **Real-time Tracking**: Monitor issue status from reported → acknowledged → in progress → resolved
- **Interactive Map**: Visualize issues in your area with live Google Maps integration
- **Community Engagement**: Upvote important issues and add comments
- **Gamification**: Earn points, badges, and climb the leaderboard
- **Multi-language Support**: Accessible interface with voice input capabilities

### For Administrators
- **Secure Dashboard**: JWT authentication with optional 2FA
- **Issue Management**: Assign issues to departments and track resolution progress
- **Advanced Analytics**: Heatmaps, response time metrics, and predictive insights
- **AI-Powered Prioritization**: Automatic issue classification and priority scoring
- **Department Coordination**: Streamlined workflow for issue resolution

### AI/ML Integration
- **Computer Vision**: Automatic image classification for issue categorization
- **Natural Language Processing**: Text analysis for description categorization
- **Predictive Analytics**: Hotspot detection and recurrence prediction
- **Priority Engine**: Smart scoring based on severity, upvotes, and location sensitivity

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB 5.0+
- Google Maps API key
- Python 3.8+ (for AI services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/civic-issue-platform.git
   cd civic-issue-platform
   ```

2. **Setup Environment Variables**
   ```bash
   # Backend (.env)
   cp server/.env.example server/.env
   
   # Frontend (.env)
   cp client/.env.example client/.env
   
   # Update with your actual API keys and configurations
   ```

3. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   
   # Install AI service dependencies (optional)
   cd ../ai
   pip install -r requirements.txt
   ```

4. **Start the Development Servers**
   ```bash
   # Terminal 1: Start backend
   cd server
   npm run dev
   
   # Terminal 2: Start frontend
   cd client
   npm run dev
   
   # Terminal 3: Start AI service (optional)
   cd ai
   python main.py
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:8000

### Docker Deployment

```bash
# Using Docker Compose
docker-compose up -d

# Or build individually
docker-compose build
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express.js + MongoDB/Mongoose
- **AI/ML**: Python + TensorFlow/PyTorch + Google Vision API
- **Maps**: Google Maps JavaScript API
- **Authentication**: JWT with optional 2FA
- **Deployment**: Docker + Nginx

### Project Structure
```
citizen-issue-platform/
├── client/                 # React frontend application
├── server/                 # Node.js backend API
├── ai/                     # Python AI/ML services
├── docs/                   # Documentation
└── scripts/                # Utility scripts
```

## 📁 Key Components

### Frontend (Client)
- **Home**: Animated hero section with live issue map
- **ReportIssue**: Multi-step issue reporting with image upload
- **IssuesFeed**: Filterable grid of community issues
- **IssueDetails**: Detailed view with comments and timeline
- **Leaderboard**: Gamification system with user rankings
- **Dashboard**: Admin interface for issue management
- **Profile**: User profile with achievements and stats

### Backend (Server)
- **Auth System**: JWT authentication with role-based access
- **Issue Management**: CRUD operations with geospatial queries
- **AI Integration**: Hooks for image and text analysis
- **Gamification Engine**: Points, badges, and leaderboard logic
- **Analytics API**: Heatmaps and predictive insights
- **Email Services**: Notifications and password reset

### AI Services
- **CV Model**: Image classification for issue categorization
- **NLP Model**: Text analysis for severity assessment
- **Priority Engine**: Multi-factor priority scoring algorithm
- **Predictive Models**: Recurring issue detection and hotspot prediction

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civic-issue-platform
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
GOOGLE_MAPS_API_KEY=your-google-maps-key
GOOGLE_VISION_API_KEY=your-vision-api-key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### Database Setup

The application uses MongoDB with the following main collections:
- `users`: Citizen and admin accounts with gamification data
- `issues`: Reported issues with status timeline and comments
- `badges`: Gamification badge definitions
- `auditlogs`: System activity tracking
- `leaderboards`: Periodic ranking data

## 🎮 Gamification System

### Points System
- **Report Issue**: +10 points
- **Issue Resolved**: +25 points
- **Upvote Received**: +2 points per upvote
- **Comment Received**: +1 point per comment
- **First Report**: +100 points bonus
- **Weekly Bonus**: +50 points for consistent reporting

### Badges
- **First Step**: Report your first issue
- **Community Champion**: Report 10+ issues
- **Quality Observer**: 5+ reports resolved
- **Popular Reporter**: Report with 10+ upvotes
- **Early Bird**: Report issues for 7 consecutive days

### Leaderboard
- Weekly, monthly, and all-time rankings
- Points-based scoring with activity multipliers
- Category-specific leaderboards (by issue type)

## 🤖 AI Integration

### Computer Vision
- Classifies uploaded images into issue categories
- Detects severity level from visual cues
- Supports multiple image formats and sizes

### Natural Language Processing
- Analyzes issue descriptions for categorization
- Extracts key entities and sentiment
- Identifies urgency from textual context

### Priority Engine
```javascript
// Priority scoring algorithm
priorityScore = 
  (categoryWeight * 0.3) +
  (aiSeverity * 0.25) + 
  (upvoteDensity * 0.2) +
  (locationDensity * 0.15) +
  (timeFactor * 0.1)
```

## 📊 Analytics & Reporting

### Live Dashboards
- **Issue Heatmap**: Visual concentration of problems by area
- **Response Times**: Average resolution times by department
- **Category Analysis**: Most common issue types and trends
- **User Engagement**: Citizen participation metrics

### Predictive Insights
- **Hotspot Detection**: Identifies areas prone to specific issues
- **Recurrence Prediction**: Forecasts repeat issues based on historical data
- **Resource Allocation**: Suggests optimal deployment of municipal resources

## 🔐 Security Features

- JWT-based authentication with secure token storage
- Optional two-factor authentication for admin accounts
- Role-based access control (Citizen, Department Staff, Admin)
- Rate limiting and request throttling
- Input validation and sanitization
- Secure file upload handling
- Audit logging for all sensitive operations

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd server
npm start
```

### Docker Production
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### Environment Setup
- Use PM2 or similar process manager for Node.js services
- Configure reverse proxy (Nginx) for static files and API routing
- Set up MongoDB replica set for production
- Enable SSL/TLS encryption
- Configure proper firewall rules and security groups

## 📈 Performance Optimization

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database indexing, query optimization, caching
- **CDN**: Static assets delivery via content delivery network
- **Compression**: Gzip compression for API responses
- **Pagination**: Efficient data loading for large datasets

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@civicfix.org
- 🐛 [Issue Tracker](https://github.com/your-username/civic-issue-platform/issues)
- 📖 [Documentation](docs/README.md)
- 💬 [Community Forum](https://github.com/your-username/civic-issue-platform/discussions)

## 🙏 Acknowledgments

- Google Maps API for geospatial services
- TensorFlow/PyTorch teams for ML frameworks
- React community for excellent component ecosystem
- OpenStreetMap for base map data
- All our contributors and community reporters

---

