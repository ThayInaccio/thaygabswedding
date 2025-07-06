# Wedding Website

A beautiful and modern wedding website built with React, TypeScript, and Material-UI for the frontend, and Express.js with PostgreSQL for the backend.

## Features

### Frontend
- **Home Page**: Beautiful hero section with wedding details and call-to-action
- **About Page**: Information about the couple and their story
- **Wedding Details**: Comprehensive information about ceremony and reception
- **RSVP System**: Interactive form for guests to confirm attendance
- **Gift Registry**: Gift list with reservation functionality
- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Beautiful Material-UI components with custom styling

### Backend
- **RESTful API**: Complete CRUD operations for RSVP and gifts
- **PostgreSQL Database**: Robust data storage with proper relationships
- **Security**: Helmet, rate limiting, and CORS protection
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
wedding-website/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   │   ├── Layout/        # Header, Footer, Layout
│   │   └── common/        # Common UI components
│   ├── pages/             # Page components
│   │   ├── Home/          # Home page
│   │   ├── About/         # About page
│   │   ├── RSVP/          # RSVP page
│   │   ├── Wedding/       # Wedding details page
│   │   └── Gifts/         # Gift registry page
│   ├── services/          # API service functions
│   └── types/             # TypeScript type definitions
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── config/        # Database and app configuration
│   └── package.json       # Backend dependencies
└── package.json           # Frontend dependencies
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database:**
   - Create a database named `wedding_db`
   - Run the SQL script in `backend/src/config/init-db.sql`

4. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your database credentials.

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

## Customization

### Wedding Details
Update the following files to customize the wedding information:
- `src/pages/Home/Home.tsx` - Wedding date and basic info
- `src/pages/About/About.tsx` - Couple information and story
- `src/pages/Wedding/WeddingDetails.tsx` - Ceremony and reception details
- `src/components/Layout/Header.tsx` - Couple names in header

### Styling
The website uses a gold theme (`#d4af37`) which can be customized in:
- `src/App.tsx` - Theme configuration
- Individual component files - Custom styling

### Database
Sample gifts are included in the database initialization script. You can modify `backend/src/config/init-db.sql` to add or change gifts.

## API Documentation

### RSVP Endpoints
- `POST /api/rsvp` - Submit RSVP
- `GET /api/rsvp` - Get all RSVPs (admin)
- `GET /api/rsvp/:email` - Get RSVP by email
- `PUT /api/rsvp/:id` - Update RSVP
- `DELETE /api/rsvp/:id` - Delete RSVP

### Gift Endpoints
- `GET /api/gifts` - Get all gifts
- `GET /api/gifts/:id` - Get gift by ID
- `PUT /api/gifts/:id/reserve` - Reserve gift
- `PUT /api/gifts/:id/unreserve` - Unreserve gift
- `POST /api/gifts` - Add new gift (admin)
- `PUT /api/gifts/:id` - Update gift (admin)
- `DELETE /api/gifts/:id` - Delete gift (admin)

## Deployment

### Frontend
The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

### Backend
The backend can be deployed to:
- Heroku
- DigitalOcean
- AWS EC2
- Railway

Remember to:
1. Set up environment variables
2. Configure database connection
3. Update CORS settings for production domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.
