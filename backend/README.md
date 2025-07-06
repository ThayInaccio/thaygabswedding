# Wedding App Backend

This is the backend API for the wedding management application.

## Features

- RSVP management
- Gift management with image uploads
- File upload handling with size limits
- Image optimization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
# Edit .env with your database configuration
```

3. Set up the database:
```bash
# Follow instructions in DATABASE_SETUP.md
```

4. Start the development server:
```bash
npm run dev
```

## File Upload Configuration

The backend now supports file uploads with the following configuration:

- **Maximum file size**: 5MB
- **Accepted formats**: Images only (JPG, PNG, GIF)
- **Storage**: Local file system in `uploads/` directory
- **Payload limit**: 10MB for JSON requests

### Upload Endpoint

- **POST** `/api/upload`
- **Content-Type**: `multipart/form-data`
- **Field name**: `image`

### Response Format

```json
{
  "success": true,
  "data": {
    "filename": "image-1234567890.jpg",
    "originalName": "original-image.jpg",
    "url": "http://localhost:3001/uploads/image-1234567890.jpg",
    "size": 1024000
  }
}
```

## API Endpoints

### RSVP
- `GET /api/rsvp` - Get all RSVPs
- `POST /api/rsvp` - Create new RSVP
- `PUT /api/rsvp/:id` - Update RSVP
- `DELETE /api/rsvp/:id` - Delete RSVP

### Gifts
- `GET /api/gifts` - Get all gifts
- `POST /api/gifts` - Create new gift
- `GET /api/gifts/:id` - Get gift by ID
- `PUT /api/gifts/:id` - Update gift
- `PUT /api/gifts/:id/reserve` - Reserve gift
- `PUT /api/gifts/:id/unreserve` - Unreserve gift
- `DELETE /api/gifts/:id` - Delete gift

## Error Handling

The application includes comprehensive error handling for:
- File size limits
- Invalid file types
- Database errors
- Validation errors

## Security

- Rate limiting (100 requests per 15 minutes per IP)
- Helmet.js for security headers
- CORS configuration
- File type validation

## Database Schema

### RSVPs Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `attending` (BOOLEAN)
- `number_of_guests` (INTEGER)
- `dietary_restrictions` (TEXT, Optional)
- `message` (TEXT, Optional)
- `created_at` (TIMESTAMP)

### Gifts Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `image_url` (TEXT, Optional)
- `is_reserved` (BOOLEAN)
- `reserved_by` (VARCHAR, Optional)
- `reserved_at` (TIMESTAMP, Optional)
- `created_at` (TIMESTAMP)

## Development

The server runs on port 3001 by default. You can change this in the `.env` file.

Health check endpoint: `GET /health` 