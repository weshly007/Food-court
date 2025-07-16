import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Helper to create JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        res.json({ success: true, token, role: user.role });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Server error during login" });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        const exists = await UserModel.findOne({ email });

        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user document
        const userData = {
            name,
            email,
            password: hashedPassword,
            role: "user"
        };

        console.log('Creating user with data:', userData);

        const newUser = new UserModel(userData);

        // Log the document before saving
        console.log('Before save - Document:', newUser.toObject());
        
        const savedUser = await newUser.save();
        
        // Verify the saved document
        console.log('After save - Saved document:', savedUser.toObject());
        
        // Double-check the saved document
        const verifiedUser = await UserModel.findById(savedUser._id);
        console.log('Verified from database:', verifiedUser.toObject());

        const token = createToken(savedUser._id);
        res.json({ 
            success: true, 
            token,
            role: savedUser.role
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.json({ success: false, message: "Server error during registration" });
    }
};

export { loginUser, registerUser };
