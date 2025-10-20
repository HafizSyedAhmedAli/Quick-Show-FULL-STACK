import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, requried: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
