// Importing required modules
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

// Initialize Express app
const app = express();
const port = 5001; // Portni to'g'ridan-to'g'ri kodda belgilash

// Middleware to parse JSON
app.use(express.json());

// CORS middleware
app.use(cors());

// MongoDB connection URI
const uri = 'mongodb+srv://dilbekshermatov:QoklC71bxcym5GKS@cluster0.qngbf.mongodb.net/?retryWrites=true&w=majority';

if (!uri) {
    console.error('Error: MONGODB_URI is not defined.');
    process.exit(1); // Terminate the process if no URI is provided
}

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB successfully');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Define User schema and model
const userSchema = new mongoose.Schema({
    id: { type: String, required: true }, // 'id' field
    email: { type: String, required: true }, // 'email' field
    password: { type: String, required: true }, // 'password' field
});

const User = mongoose.model('User', userSchema);

// Route to get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to get a specific user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (user == null) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new user
app.post('/users', async (req, res) => {
    const { id, email, password } = req.body;
    
    if (!id || !email || !password) {
        return res.status(400).json({ message: 'ID, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ id, email, password: hashedPassword });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ message: error.message });
    }
});

// Route to update a user
app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (user == null) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update email and password if provided
        if (req.body.email != null) {
            user.email = req.body.email;
        }
        if (req.body.password != null) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (user == null) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: error.message });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
