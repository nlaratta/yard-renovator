# Yard Renovator

A secure web application that allows users to upload a picture of their yard or outdoor space and receive a renovated version generated using Google's Gemini API for image generation with OpenAI's GPT for prompt creation. The app focuses on themes related to growing and building, with renovation options that result in realistic, purchasable products from Amazon.

## Features

- Secure user authentication via Google OAuth 2.0
- Image upload and capture functionality
- AI-powered yard renovation with OpenAI for prompt generation and Google Gemini Imagen3 for image generation
- Credit system for image generation
- Amazon affiliate product integration
- Mobile-responsive design with nature-inspired theme

## Tech Stack

- **Frontend**: React with TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: Server-side Google OAuth 2.0
- **Payment Processing**: PayPal SDK
- **APIs**: OpenAI (prompt creation), Google Gemini (image generation), Amazon Affiliate

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- API keys for:
  - Google OAuth
  - OpenAI
  - Google Gemini API
  - PayPal
  - Amazon Affiliate

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd client && npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   
   # Database
   DATABASE_URL=postgres://username:password@localhost:5432/yard_renovator
   
   # Authentication
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_session_secret
   
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   
   # Google Gemini
   GEMINI_API_KEY=your_gemini_api_key
   
   # PayPal
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   
   # Amazon Affiliate
   AMAZON_AFFILIATE_ID=your_amazon_affiliate_id
   AMAZON_API_KEY=your_amazon_api_key
   ```
4. Initialize the database:
   ```
   npm run db:init
   ```
5. Start the development server:
   ```
   npm run dev
   ```

### Production Deployment

1. Build the client:
   ```
   cd client && npm run build
   ```
2. Start the production server:
   ```
   npm start
   ```
