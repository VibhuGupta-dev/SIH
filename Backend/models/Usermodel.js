import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    Fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    hasCompletedAssessment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to mark email as verified
userSchema.methods.verifyEmail = function () {
  this.isEmailVerified = true;
  this.emailVerifiedAt = new Date();
  return this.save();
};

// Static method to find user by email (case insensitive)
userSchema.statics.findByEmail = function (email) {
  return this.findOne({
    email: { $regex: new RegExp(`^${email}$`, "i") },
  });
};

export default mongoose.model("User", userSchema);
