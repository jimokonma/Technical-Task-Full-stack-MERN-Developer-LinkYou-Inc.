# Full Stack Cart System

A modern, full-stack e-commerce cart system built with Next.js, React, Node.js, Express, and MongoDB. Features real-time cart management, secure authentication, and responsive design.

## 🚀 Features

### Core Features
- **Real-time Cart Management**: Add, update, remove items with instant synchronization
- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Product Management**: Browse, search, and filter products
- **Responsive Design**: Mobile-first design that works on all devices
- **Data Persistence**: Cart data persists across browser sessions
- **Price Calculation**: Real-time total calculation with tax support

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Modern Stack**: Next.js 15, React 19, Node.js, Express, MongoDB
- **API-First**: RESTful API with proper error handling
- **Security**: JWT authentication, password hashing, rate limiting
- **Performance**: Optimized queries, caching, and efficient state management

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with hooks
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── contexts/        # React Context providers
│   │   ├── lib/            # Utility functions and API
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── server/                  # Node.js backend application
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LinkYouTechnicalTask
   ```

   **Note**: The repository includes `.gitignore` files to prevent sensitive files from being committed. Make sure to create your `.env` files as described below.

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the server directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/cart-system
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   ```

   **Environment Variables Reference:**

   | Variable | Description | Default | Required |
   |----------|-------------|---------|----------|
   | `PORT` | Server port number | `5000` | No |
   | `NODE_ENV` | Environment mode | `development` | No |
   | `MONGODB_URI` | MongoDB connection string | - | **Yes** |
   | `JWT_SECRET` | Secret key for JWT tokens | - | **Yes** |
   | `JWT_EXPIRES_IN` | Access token expiration | `15m` | No |
   | `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` | No |
   | `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` | No |

   **Production Environment Variables:**
   ```env
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cart-system
   JWT_SECRET=your-production-jwt-secret-key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=https://yourdomain.com
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication)

### Product Endpoints

#### GET /api/products
Get all products with pagination and filtering
```
Query parameters:
- page: number
- limit: number
- category: string
- search: string
- minPrice: number
- maxPrice: number
- inStock: boolean
- sortBy: string
- sortOrder: 'asc' | 'desc'
```

#### GET /api/products/:id
Get single product by ID

#### GET /api/products/categories
Get all product categories

#### GET /api/products/search
Search products
```
Query parameters:
- q: string (search query)
- limit: number
```

### Cart Endpoints

#### GET /api/cart
Get user's cart (requires authentication)

#### POST /api/cart/add
Add item to cart (requires authentication)
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

#### PUT /api/cart/update/:productId
Update cart item quantity (requires authentication)
```json
{
  "quantity": 2
}
```

#### DELETE /api/cart/remove/:productId
Remove item from cart (requires authentication)

#### DELETE /api/cart/clear
Clear entire cart (requires authentication)

## 🎯 Key Features Implementation

### Real-time Cart Management
- Cart state managed with React Context
- Automatic synchronization with backend
- Optimistic updates for better UX
- Error handling and rollback

### Secure Authentication
- JWT tokens with refresh mechanism
- Password hashing with bcrypt
- Protected routes and middleware
- Token expiration handling

### Responsive Design
- Mobile-first approach
- TailwindCSS for styling
- Flexible grid layouts
- Touch-friendly interactions

### Data Persistence
- MongoDB for data storage
- Mongoose schemas with validation
- Indexed queries for performance
- Data relationships and references

## 📁 Project Files

### .gitignore Files
The project includes comprehensive `.gitignore` files to prevent sensitive and unnecessary files from being committed:

- **Root `.gitignore`**: Covers common files for the entire project
- **`frontend/.gitignore`**: Next.js specific ignores (node_modules, .next, etc.)
- **`server/.gitignore`**: Node.js/Express specific ignores (node_modules, logs, etc.)

**Key ignored files:**
- Environment variables (`.env*`)
- Dependencies (`node_modules/`)
- Build outputs (`.next/`, `dist/`, `build/`)
- IDE files (`.vscode/`, `.idea/`)
- OS files (`.DS_Store`, `Thumbs.db`)
- Logs and cache files
- SSL certificates and sensitive data

### Environment Variables
Environment variables are stored in `.env` files and are **not committed** to version control for security reasons. See the [Environment Setup](#environment-setup) section above for configuration details.

## 🔧 Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent code style

### Testing
- Unit tests for utilities
- Integration tests for API endpoints
- Component testing with React Testing Library
- E2E testing with Cypress (planned)

### Performance
- Optimized database queries
- Efficient state management
- Code splitting and lazy loading
- Image optimization

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Railway, Heroku, or AWS
4. Set up CI/CD pipeline

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or AWS
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@cartsystem.com or create an issue in the repository.

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS
- MongoDB for the database
- All contributors and maintainers