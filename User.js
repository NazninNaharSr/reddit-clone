import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    // Communities this user has joined. Referencing by ObjectId keeps the
    // user document small; we populate() when we need the full docs.
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }],
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// Instance method: hash a plaintext password and store it. We never store
// the raw password — bcrypt is a slow, salted hash designed for this.
userSchema.methods.setPassword = async function (plaintext) {
  const saltRounds = 10;
  this.passwordHash = await bcrypt.hash(plaintext, saltRounds);
};

// Instance method: check a login attempt against the stored hash.
userSchema.methods.verifyPassword = function (plaintext) {
  return bcrypt.compare(plaintext, this.passwordHash);
};

// Never leak the hash when we serialize a user to JSON.
userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    communities: this.communities,
    createdAt: this.createdAt,
  };
};

export default mongoose.model("User", userSchema);
