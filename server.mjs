import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { logindata } from "./BusinessLogic/userlogin.mjs";
import { userAuth } from "./BusinessLogic/userAuth.mjs";
import { changePassword, sendOtp, verifyOtp } from "./BusinessLogic/userPasswordUpdate.mjs";
import { getTotalDeveloperByRole, getTotalUsersByRole } from "./BusinessLogic/AdminDashboard/admindashboarddata.mjs";
import { deleteUserByEmail, getAllDeveloper, getAllUsers, updateUserRoleByEmail } from "./BusinessLogic/AdminDashboard/admintotalUser.mjs";
import { createTool, deleteTool, getAllTools, getCalculatorTools, getConverterTools, getGeneratorTools, getToolById, getToolByIdforrender, getToolBySubCatagory, getToolBySubSubCatagory, getTotalCalculatorCount, getTotalConverterCount, getTotalGeneratorCount, getTotaltoolCount, updateTool } from "./BusinessLogic/DeveloperDashboard/toolManagement.mjs";
import auth from "./toolsAuth/auth.mjs";
import cors from 'cors';


dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDb connected");
  })
  .catch((err) => {
    console.log("error", err);
  });

// Initialize Express
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware for setting headers
app.use((req, res, next) => {
  if(req.url === "/favicon.ico") return res.end()
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
const corsOptions = {
    origin: 'https://project-dev-tools-b.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Default homepage
app.get('/', (req, res) => {
  res.send('Welcome to the API Home!');
});

// Signup endpoint
app.post('/Signup', logindata, (req, res) => {
  try {
    return res.status(200).json({ msg: "success" });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
});

// Login endpoint
app.post('/login', userAuth);

// Forgot password endpoints
app.post('/send-otp', sendOtp);
app.post('/verify-otp', verifyOtp);
app.post('/change-password', changePassword);

// Admin endpoints
app.get('/gettotalUserCounts/:userId', auth, getTotalUsersByRole);
app.get('/gettotalDeveloperCounts/:userId', auth, getTotalDeveloperByRole);
app.get('/getallUser/:userId', auth, getAllUsers);
app.get('/getallDeveloper/:userId', auth, getAllDeveloper);
app.put('/updateUserRoleByEmail/:userId', auth, updateUserRoleByEmail);
app.delete('/users/:email/:userId', auth, deleteUserByEmail);

// Developer endpoints
app.post('/toolCreated/:userId', auth, createTool);
app.get('/tools/:userId', auth, getAllTools);
app.get('/toolsCount/:userId', auth, getTotaltoolCount);
app.get('/toolsCalculatorCount/:userId', auth, getTotalCalculatorCount);
app.get('/toolsConverterCount/:userId', auth, getTotalConverterCount);
app.get('/toolsGeneratorCount/:userId', auth, getTotalGeneratorCount);
app.get('/toolsCalculator/:userId', auth, getCalculatorTools);
app.get('/toolsConverter/:userId', auth, getConverterTools);
app.get('/toolsGenerator/:userId', auth, getGeneratorTools);
app.get('/tools/:id/:userId', auth, getToolById);
app.get('/toolsRender/:id/:userId', auth, getToolByIdforrender);
app.get('/toolsBySubCatagory/:toolSubCatagory/:userId', auth, getToolBySubCatagory);
app.get('/toolsBySubSubCatagory/:toolSubSubCatagory/:userId', auth, getToolBySubSubCatagory);
app.put('/toolsUpdate/:id/:userId', auth, updateTool);
app.delete('/toolsDelete/:id/:userId', auth, deleteTool);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
