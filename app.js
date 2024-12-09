require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { createSecretToken } = require("./util/SecretToken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3002
const dbUrl = process.env.MONGO_URL;

const Holding = require("./model/Holdings"); // holding model
const Position = require("./model/Positions"); // position model
const Order = require("./model/Orders"); // order model
const User = require("./model/Users");


main()
    .then(() => {
        console.log("db connected");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl);
}


app.get("/allHoldings", async (req, res) => {
    let allHoldings = await Holding.find({});
    res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
    let allPositions = await Position.find({});
    res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
    let newOrder = new Order({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });

    await newOrder.save();
});


app.post("/", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  });
  res.send("done")

});


app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, username, createdAt } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ message: "User already exists!" });
      }
      const user = await User.create({ email, password, username, createdAt });
      const token = createSecretToken(user._id);
      
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      res
        .status(201)
        .json({ message: "User signed in successfully", success: true, user });
      next();
    } catch (error) {
        console.error(error);
        return res.json({message: "Please fill this form!"});
    }
  });

app.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if(!email || !password ){
        return res.json({message:'All fields are required'})
      }
      const user = await User.findOne({ email });
      if(!user){
        return res.json({message:'Incorrect password or email' }) 
      }
      const auth = await bcrypt.compare(password,user.password)
      if (!auth) {
        return res.json({message:'Incorrect password or email' }) 
      }
       const token = createSecretToken(user._id);
       res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
       });
       res.status(201).json({ message: "User logged in successfully", success: true });
       next()
    } catch (error) {
      console.error(error);
    }
});

app.listen(PORT, () => {
    console.log(`app listing on port ${PORT}`);
}) 