import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB ulanish URI'si
const uri = process.env.MONGODB_URI;

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
    name: String,
    email: String,
    age: Number
});

const User = mongoose.model('User', userSchema);

// Route to get all users
app.get('/User', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a specific user by ID
app.get('/User/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User topilmadi' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to create a new user
app.post('/User', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to update a user
app.put('/User/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'User topilmadi' });
        }

        if (req.body.name != null) {
            user.name = req.body.name;
        }
        if (req.body.email != null) {
            user.email = req.body.email;
        }
        if (req.body.age != null) {
            user.age = req.body.age;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a user
app.delete('/User/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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
