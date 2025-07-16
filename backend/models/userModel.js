import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true,
        default: "user",
        enum: ["user", "admin"] // Only allow these values
    },
    cartData: { type: Object, default: {} }
}, { 
    minimize: false,
    timestamps: true,
    strict: true,
    collection: 'users'  // Explicitly set collection name
});

// Middleware to log the document before saving
userSchema.pre('save', function(next) {
    if (!this.role) {
        this.role = "user";
    }
    console.log('Pre-save middleware - Document to be saved:', {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        cartData: this.cartData
    });
    next();
});

// Create a new model instance
mongoose.models = {};  // Clear existing models
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
