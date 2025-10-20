# WhenWhere

A collaborative event scheduling application that helps groups coordinate meetings by finding optimal times and locations.

## Features

- Create events with multiple date/time options and location suggestions
- Vote on availability and preferred locations
- Share events via unique links
- Firebase authentication
- Google Maps integration for location selection

## Technology Stack

### Frontend

- React 19 + TypeScript + Vite
- MobX (state management)
- Material-UI + Styled Components
- Firebase Authentication
- Google Maps API

### Backend

- Node.js + Express 5
- MongoDB + Mongoose
- TypeScript

## Architecture

**Frontend**: MVP (Model-View-Presenter) pattern

- **Models**: MobX stores for reactive state
- **Views**: Pure presentation components
- **Presenters**: Business logic and data fetching

**Backend**: Service layer pattern with Express controllers

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB
- Firebase project
- Google Maps API key

### Installation

1. Clone and install dependencies:

```bash
git clone https://github.com/joel90688/WhenWhere.git
cd WhenWhere
npm i
npm run install:all
```

2. Configure environment variables:

**Backend** (`backend/.env`):

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000

FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

**Frontend**: (`frontend/.env`)
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_REACT_GOOGLE_PLACES_API_KEY=...

VITE_BACKEND_URL=...

```

3. Run development servers:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Build for Production

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start frontend and backend dev servers
- `npm run build` - Build both frontend and backend
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

ISC
