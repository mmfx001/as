import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';



const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());

// CORS middleware
app.use(cors());

// MongoDB ulanish URI'si
const uri ='MONGODB_URI=mongodb+srv://dilbekshermatov:QoklC71bxcym5GKS@cluster0.qngbf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0PORT=5001';

if (!uri) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1); // Jarayonni to‘xtatish
}

// Mongoose orqali MongoDB'ga ulanish
mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB ga muvaffaqiyatli ulandi');
    })
    .catch((error) => {
        console.error('MongoDB ga ulanishda xatolik yuz berdi:', error);
    });

// Foydalanuvchi schema va model
const userSchema = new mongoose.Schema({
    id: { type: String, required: true }, // 'id' maydoni
    email: { type: String, required: true }, // 'email' maydoni
});

const User = mongoose.model('User', userSchema);

// Route to get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a specific user by ID
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (user == null) {
            return res.status(404).json({ message: 'User topilmadi' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new user
app.post('/users', async (req, res) => {
    const user = new User({
        id: req.body.id,
        email: req.body.email,
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to update a user
app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (user == null) {
            return res.status(404).json({ message: 'User topilmadi' });
        }

        if (req.body.email != null) {
            user.email = req.body.email;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (user == null) {
            return res.status(404).json({ message: 'User topilmadi' });
        }

        await user.remove();
        res.json({ message: 'Foydalanuvchi o‘chirildi' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Express serverini ishga tushurish
app.listen(port, () => {
    console.log(`Server ${port} portda ishlamoqda`);
});
