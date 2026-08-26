# Podcast Backend

This backend is built with Node.js, Express.js, PostgreSQL, and Sequelize.

## Features

- JWT authentication with access and refresh tokens
- User, podcast, and episode modules
- Local file uploads for thumbnails, banners, avatars, and audio
- Pagination, filtering, search, and sorting support
- Centralized error handling and request logging

## Setup

1. Copy .env.example to .env and configure PostgreSQL settings.
2. Install dependencies:
   npm install
3. Run migrations:
   npm run db:migrate
4. Run seeders:
   npm run db:seed
5. Start the server:
   npm run dev
