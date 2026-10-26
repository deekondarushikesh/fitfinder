# Virtual Try-On Platform

A complete virtual try-on website with user authentication, design management, and virtual clothing preview capabilities.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Password hashing with bcryptjs

## Features

### User Features
- User registration and login
- Browse dress styles (Saree, Kurti, Gown, Western Wear, Lehenga)
- Upload personal photos
- Upload dress images
- Virtual try-on preview generation

### Admin Features
- Admin authentication
- Add new dress designs
- View all designs
- Delete designs
- Manage design categories

## Project Structure

```
/
├── /backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── /config/
│   │   └── db.js
│   ├── /models/
│   │   ├── User.js
│   │   ├── Admin.js
│   │   └── Design.js
│   ├── /controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   └── vtoController.js
│   ├── /routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── vto.js
│   └── /uploads/
├── /public/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── design.html
│   ├── tryon.html
│   ├── admin-login.html
│   ├── admin.html
│   ├── /css/
│   │   └── style.css
│   └── /js/
│       ├── common.js
│       ├── login.js
│       ├── register.js
│       ├── design.js
│       ├── tryon.js
│       ├── admin-login.js
│       └── admin.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- A modern web browser

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB connection in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/virtual-try-on
NODE_ENV=development
```

4. Create an uploads directory:
```bash
mkdir uploads
```

5. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. The frontend files are in the `/public` directory
2. Serve the static files using the Express server (configured in `server.js`)
3. Open `http://localhost:3000` in your browser

## API Documentation

### Authentication Routes

#### User Registration
```
POST /auth/register
Body: { name, email, password }
Response: { message, userId }
```

#### User Login
```
POST /auth/login
Body: { email, password }
Response: { message, userId, name, email }
```

### Admin Routes

#### Admin Login
```
POST /admin/login
Body: { email, password }
Response: { message, adminId, email }
```

#### Add Design
```
POST /admin/design/add
Body: FormData { title, category, image }
Response: { message, design }
```

#### Get All Designs
```
GET /admin/design/all
Response: { designs }
```

#### Delete Design
```
DELETE /admin/design/:id
Response: { message }
```

### Virtual Try-On Routes

#### Generate Try-On Preview
```
POST /vto/generate
Body: { personImage (base64), clothImage (base64), dressType }
Response: { message, previewImage, dressType }
```

## Design Specifications

### Color Scheme
- **Primary**: #4B7BEC (Blue)
- **Background**: #ffffff (White)
- **Card Background**: #f7f7f7 (Soft Grey)
- **Text**: #222222 (Deep Black)
- **Accent**: Various gradients for visual interest

### Typography
- **Font Family**: Inter, sans-serif
- **Headings**: 600-700 font weight
- **Body**: 400-500 font weight

### Spacing & Borders
- **Border Radius**: 14px (cards), 10px (buttons/inputs)
- **Card Padding**: 20px
- **Soft Shadow**: 0px 4px 12px rgba(0,0,0,0.1)

### Responsive Design
- **Desktop**: 3-column grid
- **Tablet**: 2-column grid
- **Mobile**: 1-column grid

## User Flows

### User Registration & Try-On
1. Register new account
2. Login with credentials
3. Select dress style
4. Upload person and dress images
5. Generate virtual try-on preview

### Admin Workflow
1. Admin login
2. Add new designs with images and categories
3. View all designs in grid
4. Delete designs as needed

## Features in Detail

### Virtual Try-On Page
- Side-by-side upload boxes for person and dress images
- Real-time image preview
- One-click try-on generation
- Full-width preview of generated output

### Admin Dashboard
- Design upload with category selection
- Grid view of all designs
- Quick delete functionality
- Image preview support

### Design Page
- 5 dress style cards
- Visual selection feedback
- Persistent selection using localStorage

## Database Models

### User
```
{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}
```

### Admin
```
{
  email: String (unique),
  password: String (hashed),
  role: String (default: "admin"),
  timestamps: true
}
```

### Design
```
{
  title: String,
  category: String (enum: saree, kurti, gown, western, lehenga),
  imageUrl: String (base64),
  timestamps: true
}
```

## Security Considerations

- Passwords are hashed using bcryptjs before storing
- CORS is enabled for frontend-backend communication
- Input validation on all routes
- File uploads are handled securely
- Environment variables used for sensitive data

## Future Enhancements

- JWT token-based authentication
- Advanced ML-based try-on preview
- User profile and order history
- Rating and review system
- Payment integration
- Email verification
- Password reset functionality
- Admin role management

## Testing

### Test User Credentials
You can create test accounts through the registration page, or add them directly to MongoDB.

### Test Admin Credentials
Insert directly into MongoDB:
```javascript
{
  email: "admin@example.com",
  password: "hashed_password_here",
  role: "admin"
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in `.env`
- Verify network connectivity

### API Calls Failing
- Ensure backend server is running on port 3000
- Check CORS configuration
- Open browser console for detailed error messages

### Images Not Uploading
- Check `/uploads` directory exists
- Verify file permissions
- Check file size limits

### Frontend Not Loading
- Ensure Express server is serving static files
- Check browser console for 404 errors
- Verify file paths in HTML

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please refer to the documentation or create an issue in the repository.
