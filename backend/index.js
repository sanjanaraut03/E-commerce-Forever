const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { type } = require("os");

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://sanjana03:sanjana03@cluster0.dnqwu.mongodb.net/ecommerce", { useNewUrlParser: true, useUnifiedTopology: true });

// Ensure upload directory exists
const uploadDir = './upload/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Image Storage Engine with additional logging
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Setting destination for file:", file.originalname);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const filename = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
        console.log("Setting filename:", filename);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Creating Upload Endpoint for images
app.use('/images', express.static(uploadDir));
app.post("/upload", upload.single('product'), (req, res) => {
    console.log("Incoming Request Body:", req.body);
    console.log("File Received:", req.file);

    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for creating Products
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    old_price: { type: Number, required: true },
    new_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

// Endpoint to add a product
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product = products[products.length - 1];
        id = last_product.id + 1;
    } else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({ success: true, name: req.body.name });
});

// Endpoint to remove a product
app.post('/removeproduct', async (req, res) => {
    try {
        const result = await Product.findOneAndDelete({ id: req.body.id });
        if (result) {
            console.log("Removed product with ID:", req.body.id);
            res.json({ success: true, name: req.body.name });
        } else {
            console.log("Product not found with ID:", req.body.id);
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, message: "Error removing product" });
    }
});


//Creating API for getting all products 
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log ("All products Fetched");
    res.send(products);
})


//Schema for user Model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }

})

//Creating Endpoint for registering the user

        // Import jsonwebtoken
const jwt = require('jsonwebtoken');
const { log } = require("console");

app.post('/signup', async (req, res) => {
    try {
        // Check if a user with the same email already exists
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with the same email ID" });
        }

        // Initialize a cart with 300 items, all set to 0
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Create a new user instance
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password, // Hash this in production
            // cartData: cart,
        });

        // Save the new user to the database
        const savedUser = await user.save();
        console.log("User saved:", savedUser); // Log the saved user to confirm success

        // Prepare the data for JWT
        const data = {
            user: {
                id: savedUser.id
            }
        };

        // Sign and return the token
        const token = jwt.sign(data, 'secret_ecom');  // 'secret_ecom' is your JWT secret key
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error in /signup endpoint:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

    
//Creating endpoint for user login 
app.post('/login',async(req,res)=>{
    let user = await Users.findOne({email:req.body.email});

    if(user){
        const passCompare = req.body.password ===user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id "})
    }
})

//Creating endpoint for newcollection data
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection =products.slice(1).slice(-8);
    res.send(newcollection);
})


//Creating endpoint for Popular in women 
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women =products.slice(0,4);
   res.send(popular_in_women);
})

//Creating middleware to fetch user
const fetchUser=async(req,res,next )=>{
    const token =req.header('auth-token');
    if (!token){
        res.status(401).send({errors:"Please authenticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user=data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"Please Authenticate using a valid token"})
        }

    }

}


app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        const { itemId } = req.body;
        const userId = req.user?.id;  // assuming req.user.id is populated by fetchUser

        // Check if itemId and userId are provided
        if (!itemId) {
            return res.status(400).json({ message: 'Item ID is required' });
        }
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        console.log(`User ${userId} added item to cart: ${itemId}`);

        // Find user data
        const userData = await Users.findOne({ _id: userId });
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize cartData if it doesn't exist
        if (!userData.cartData) {
            userData.cartData = {};
        }

        // Increment the item quantity in the cart or set it to 1 if it's not present
        if (userData.cartData[itemId]) {
            userData.cartData[itemId] += 1;
        } else {
            userData.cartData[itemId] = 1;
        }

        // Update the user's cart data in the database
        await Users.findOneAndUpdate(
            { _id: userId },
            { cartData: userData.cartData }
        );

        // Respond with success message
        res.status(200).json({ message: 'Item added to cart successfully', itemId, userId });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//Remove from cart

app.post('/removefromcart', fetchUser, async (req, res) => {
    // Log the item ID to the console for debugging purposes
    console.log("removed", req.body.itemId);

    // Retrieve user data based on the user ID
    let userData = await Users.findOne({ _id: req.user.id });

    // Check if the item quantity is greater than zero before decrementing
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }

    // Update the user's cart data in the database
    await Users.findOneAndUpdate(
        { _id: req.user.id },
        { cartData: userData.cartData }
    );

    // Send a response indicating that the item has been removed
    res.send("Removed");
});


//Creating endpoint to get cartData
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData=await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});
