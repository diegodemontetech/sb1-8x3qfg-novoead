# VPJ Learning Platform - API Documentation

## Stack Overview

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Lucide React for icons
- React Router for navigation
- Framer Motion for animations

### Backend
- Supabase for database and authentication
- PostgreSQL as the database
- Netlify Functions for serverless API endpoints
- Supabase Storage for file uploads

### Deployment
- Frontend: Netlify
- Backend: Supabase
- Storage: Supabase Storage Buckets (videos, pdfs, images)

## Environment Setup

```env
VITE_SUPABASE_URL=https://vrbdlyfkzelfuruelams.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## API Endpoints

### Authentication

#### Login
```typescript
POST /auth/login
Body: { email: string, password: string }
Response: { user: User, token: string }
```

#### Register
```typescript
POST /auth/register
Body: { name: string, email: string, password: string }
Response: { user: User, token: string }
```

### Courses

#### Get All Courses
```typescript
GET /courses
Response: Course[]
```

#### Get Course by ID
```typescript
GET /courses/:id
Response: Course
```

#### Create Course
```typescript
POST /courses
Body: {
  title: string
  description: string
  thumbnail: string
  duration: string
  category: string
  instructor: string
  isFeatured: boolean
}
Response: Course
```

### Lessons

#### Get Lessons by Course
```typescript
GET /courses/:courseId/lessons
Response: Lesson[]
```

#### Create Lesson
```typescript
POST /courses/:courseId/lessons
Body: {
  title: string
  description: string
  videoUrl: string
  duration: string
  order: number
  attachments?: { name: string, url: string }[]
}
Response: Lesson
```

### Quiz

#### Get Quiz by Lesson
```typescript
GET /quiz/lesson/:lessonId
Response: Quiz
```

#### Submit Quiz
```typescript
POST /quiz/:id/submit
Body: { answers: number[] }
Response: { grade: number, passed: boolean }
```

### Categories

#### Get All Categories
```typescript
GET /categories
Response: Category[]
```

#### Create Category
```typescript
POST /categories
Body: {
  name: string
  description: string
  isActive: boolean
  usedInCourses: boolean
  usedInEbooks: boolean
}
Response: Category
```

### E-books

#### Get All E-books
```typescript
GET /ebooks
Response: Ebook[]
```

#### Get E-book by ID
```typescript
GET /ebooks/:id
Response: Ebook
```

#### Update Reading Progress
```typescript
POST /ebooks/:id/progress
Body: { currentPage: number, completed: boolean }
Response: EbookProgress
```

### News

#### Get Latest News
```typescript
GET /news
Query: { limit?: number }
Response: News[]
```

#### Get News by ID
```typescript
GET /news/:id
Response: News
```

#### Add Comment
```typescript
POST /news/:id/comments
Body: { content: string, parentId?: string }
Response: Comment
```

### Certificates

#### Get User Certificates
```typescript
GET /certificates
Response: Certificate[]
```

#### Get Certificate by ID
```typescript
GET /certificates/:id
Response: Certificate
```

### User Management

#### Get User Profile
```typescript
GET /users/profile
Response: User
```

#### Update Profile
```typescript
PUT /users/profile
Body: { name?: string, avatar?: string }
Response: User
```

## File Storage

### Storage Buckets
- videos: Course video content
- pdfs: Documents and e-books
- images: Thumbnails and avatars

### Upload Endpoints
```typescript
POST /storage/upload/video
POST /storage/upload/pdf
POST /storage/upload/image
Body: FormData
Response: { url: string }
```

## Deployment Instructions

1. Database Setup (Supabase)
```bash
# Run migrations
npx supabase db push

# Seed initial data
npm run seed-db
```

2. Frontend Deployment (Netlify)
```bash
# Install dependencies
npm install

# Build
npm run build

# Deploy
npm run netlify:deploy
```

3. Environment Variables (Netlify)
```bash
netlify env:set VITE_SUPABASE_URL "your-supabase-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set VITE_SUPABASE_SERVICE_ROLE_KEY "your-service-role-key"
```

## Error Handling

All API endpoints follow this error format:
```typescript
{
  error: {
    message: string
    code?: string
    details?: any
  }
}
```

## Rate Limiting

- Authentication: 100 requests per hour
- API endpoints: 1000 requests per hour
- File uploads: 100 uploads per hour

## Security

- JWT-based authentication
- Row Level Security in Supabase
- CORS configured for production domain
- File upload size limits:
  - Videos: 100MB
  - PDFs: 10MB
  - Images: 5MB