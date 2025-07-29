# AutoDevelop Chatbot

A modern React-based chatbot application with OpenAI integration, featuring a contact form and domain purchase inquiries.

## 🚀 Features

- **AI-Powered Chat**: Integrates with OpenAI's GPT-3.5-turbo for intelligent conversations
- **Contact Form**: Allows users to submit domain purchase inquiries
- **Modern UI**: Dark theme with responsive design
- **Robust Backend**: Express.js server with comprehensive error handling
- **Email Integration**: Automated email notifications via SMTP2GO
- **Input Validation**: Comprehensive validation and sanitization
- **Logging**: File-based logging for visitor tracking and contact submissions

## 🛠 Architecture

```
├── src/              # React frontend components
├── api/              # Express.js API routes
├── server.js         # Main server file
├── public/           # Static assets
└── build/            # Production build output
```

### Frontend (React)
- `App.js` - Main application component
- `Chat.js` - Chatbot interface with OpenAI integration
- `App.css` - Modern dark theme styling

### Backend (Express.js)
- `server.js` - Main server with static file serving and API routing
- `api/chat.js` - OpenAI chat integration endpoint
- `api/contact.js` - Contact form processing with email notifications
- `api/webhook.js` - Stripe webhook handler (for future payments)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (for chat functionality)
- SMTP2GO credentials (for email functionality)

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/kev7n11f/autodevelop-chatbot.git
cd autodevelop-chatbot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (SMTP2GO)
CONTACT_EMAIL_USER=your_smtp2go_username
CONTACT_EMAIL_PASS=your_smtp2go_password

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Server Configuration
PORT=3000
```

### 4. Build the React Application
```bash
npm run build
```

### 5. Start the Server
```bash
node server.js
```

The application will be available at `http://localhost:3000`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode during development:
```bash
npm test -- --watch
```

## 📡 API Endpoints

### POST /api/chat
Process chat messages using OpenAI.

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"}
  ]
}
```

**Response:**
```json
{
  "reply": "I'm doing great! How can I help you?",
  "history": [
    {"role": "user", "content": "Previous message"},
    {"role": "assistant", "content": "Previous response"},
    {"role": "user", "content": "Hello, how are you?"},
    {"role": "assistant", "content": "I'm doing great! How can I help you?"}
  ]
}
```

### POST /api/contact
Submit domain purchase inquiry.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "telephone": "+1234567890",
  "subject": "Domain Purchase Inquiry",
  "msg": "I'm interested in purchasing this domain."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

## 🎨 Usage Examples

### Chatbot Commands
The chatbot responds to natural language queries and can help with:
- General information and questions
- Technical support
- Business inquiries
- Casual conversation

### Domain Purchase Flow
1. Click the "Buy this Domain" floating button
2. Fill out the contact form with:
   - Your name
   - Valid email address
   - Phone number
   - Subject line
   - Detailed message
3. Submit the form
4. Receive confirmation message

## 🔐 Security Features

- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: Built-in protection against spam
- **Email Validation**: RFC-compliant email format checking
- **Content Length Limits**: Prevents abuse through oversized inputs
- **Error Handling**: Graceful error responses without exposing internals

## 📊 Logging

The application logs:
- **Visitor Data**: IP addresses and user agents (`logs/visitor_logs.json`)
- **Contact Submissions**: All form submissions (`logs/contact_logs.json`)

Logs are stored in JSON format for easy parsing and analysis.

## 🚀 Deployment

### Production Build
```bash
npm run build
node server.js
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure reverse proxy (nginx recommended)
- Set up SSL certificates
- Configure monitoring and logging

### Vercel Deployment
The app includes `vercel.json` for easy Vercel deployment:
```bash
vercel --prod
```

## 🔧 Development

### Start Development Server
```bash
npm start  # React development server
```

### Build for Production
```bash
npm run build
```

### Code Style
- Use ESLint for code linting
- Follow React best practices
- Maintain consistent error handling patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details.

## 🙋‍♂️ Support

For support, email kev7n11@outlook.com or create an issue in the GitHub repository.
