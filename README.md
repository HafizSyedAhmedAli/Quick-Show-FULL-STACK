# QuickShow - Movie Ticket Booking Platform

![QuickShow Logo](client/src/assets/logo.svg)

QuickShow is a modern web application for booking movie tickets online. Experience seamless movie ticket booking with real-time seat selection, trailer previews, and an intuitive user interface.

Live Demo: [QuickShow](https://quickshow-frontend-two.vercel.app/)

## Features

### For Users
- Browse currently playing movies with trailers and details
- Real-time seat selection and booking
- Secure payment processing
- View booking history and e-tickets
- Favorite movies list
- Email notifications for bookings and upcoming shows
- Mobile responsive design

### For Admins
- Comprehensive admin dashboard
- Add new movies and showtimes
- Monitor bookings and revenue
- Manage show schedules
- Track user statistics

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Clerk for authentication
- Axios for API requests
- React Router for navigation
- React Player for video playback

### Backend
- Node.js & Express
- MongoDB with Mongoose
- Swagger for API documentation
- Inngest for background jobs
- Stripe for payments
- NodeMailer for emails

## Environment Variables

The frontend requires the following environment variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BASE_URL=your_api_url
VITE_TMDB_IMAGE_BASE_URL=tmdb_image_url
VITE_CURRENCY=currency_symbol
```

## Getting Started

1. Clone the repository:
```sh
git clone [repository-url]
```

2. Install dependencies:
```sh
cd client
npm install
```

3. Start development server:
```sh
npm run dev
```

4. Visit `http://localhost:5173` in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TMDB API for movie data
- Clerk for authentication services
- Stripe for payment processing
