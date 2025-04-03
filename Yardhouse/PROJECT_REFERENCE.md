# Yard Renovator Project Reference

## Architecture Overview

### Frontend (React + TypeScript)
- **Entry Point**: `client/src/index.tsx` - Wraps app with `AuthProvider`
- **Main Component**: `App.tsx` - Sets up routing and page structure
- **Key Pages**:
  - `HomePage`: Landing page with hero section
  - `RenovatePage`: Main renovation interface
  - `ResultPage`: Displays renovation results
  - `DashboardPage`: User dashboard
  - `LoginPage`: Authentication
  - `PricingPage`: Credit packages

### Backend (Node.js + Express)
- **API Routes**:
  - `/api/auth/*`: Google OAuth authentication
  - `/api/credits/*`: Credit management
  - `/api/images/*`: Image processing
  - `/api/user/*`: User management
  - `/api/affiliate/*`: Amazon product integration

### Core Features
1. **Authentication**: Google OAuth 2.0
2. **Credit System**: PayPal integration for purchasing credits
3. **Image Processing**: 
   - OpenAI GPT for prompt generation
   - Google Gemini for image transformation
4. **Affiliate Integration**: Amazon product suggestions

## Data Models

### Key Types (TypeScript)
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
  creditBalance: number;
}

interface ImageRequest {
  request_id: number;
  user_id: number;
  renovation_options: RenovationOptions;
  generated_image_url: string | null;
  affiliate_links: ProductSuggestion[] | null;
  status: 'processing' | 'completed' | 'failed';
}

interface RenovationOptions {
  theme: string;
  level: string;
  notes?: string;
}
```

## API Integration

### OpenAI
- Used for generating detailed prompts
- Model: GPT-4
- Endpoint: `/utils/openai.js`

### Google Gemini
- Used for image generation
- Model: gemini-2.0-flash-exp-image-generation
- Endpoint: `/utils/gemini.js`

### Amazon Affiliate
- Product suggestions based on renovation theme
- Caching system for affiliate links

## UI/UX

### Color Scheme
- Primary: Deep Green (#2D5F2D)
- Secondary: Earth Brown (#8B5A2B)
- Accent: 
  - Light Green (#7CAA7C)
  - Sandy Beige (#D2B48C)
  - Terracotta (#CD5C5C)

### Key Components
- `Layout`: Common page structure with header/footer
- `ProtectedRoute`: Authentication wrapper
- Tailwind CSS for styling

## Development Notes

### State Management
- Context API for auth state (`AuthContext`)
- Local state for component-specific data
- API utilities in `utils/api.ts`

### Security
- Server-side session management
- Protected routes with credit requirements
- Secure file upload handling

### Error Handling
- Comprehensive API response types
- Client-side validation
- Fallback UI states

## Quick Links
- Types: `client/src/types/index.ts`
- API Utils: `client/src/utils/api.ts`
- Main Styles: `client/src/index.css`
- Routes: `App.tsx` 