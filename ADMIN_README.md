# Admin System - Wedding Website

## Overview
The admin system provides a secure way to manage guests, RSVPs, and gifts for the wedding website.

## Access
- **URL**: `/admin/login`
- **Username**: `admin`
- **Password**: `wedding2025`

## Features

### Dashboard
- Overview statistics (total guests, confirmed RSVPs, total gifts, reserved gifts)
- Quick navigation to all admin sections

### RSVP Management
- View all guests and their RSVP status
- Search guests by name, email, or phone
- Filter by RSVP status (pending, confirmed, declined)
- Edit guest information including:
  - Name, email, phone
  - RSVP status
  - Plus one information
  - Dietary restrictions
  - Notes
- Add new guests

### Gift Management
- View all gifts in the registry
- Search gifts by name or description
- Filter by status (available, reserved, purchased)
- Edit gift information including:
  - Name, description, price
  - Image URL and purchase URL
  - Status and reserved by information
  - Favorite status
- Add new gifts
- Delete gifts

## Security
- Simple username/password authentication
- Protected routes that redirect to login if not authenticated
- Session persistence using localStorage
- Logout functionality

## Technical Details

### Authentication
- Uses React Context for state management
- Protected routes with automatic redirect
- Session stored in localStorage

### Data Management
- Currently uses mock data (can be replaced with API calls)
- Real-time filtering and search
- Pagination for large datasets

### Styling
- Consistent with main website design
- Responsive design for mobile and desktop
- Material-UI components

## Future Enhancements
- Backend API integration
- Real-time updates
- Export functionality (CSV, PDF)
- Email notifications
- Advanced analytics
- Multiple admin users with roles

## Development Notes
- Replace mock data with actual API calls
- Add proper error handling
- Implement proper security measures for production
- Add loading states and error boundaries
- Consider adding data validation 