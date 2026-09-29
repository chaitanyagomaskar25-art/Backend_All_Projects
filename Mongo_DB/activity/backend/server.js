import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import User from "./userModel.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDb connected Successfully");
  })

  .catch((error) => {
    console.log("MongoDb connection Failed!", error);
  });

app.post("/student", async (req, res) => {
  const { username, bio, followers, following, hobbies } = req.body;

  const user = await User.create({
    username,
    bio,
    followers,
    following,
    hobbies,
  });
  res.json(user);
});

app.patch("/student/:id", async (req, res) => {
  const { github, linkedIn } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { links: `${github}, ${linkedIn}` },
    { returnDocument: "after", runValidators: true },
  );

  res.json(user);
});

app.get("/student", async (req, res) => {
  const data = await User.find();
  res.json(data);
});

app.listen(3000, () => {
  console.log(`server is running on Prt ${PORT}`);
});

