const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        // a custom validation of email in Schema level
        validator: function (value) {
          return /\S+@\S+\.\S+/.test(value);
        },
        message: "Invalid email format",
      },
      index: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
      Select: true, // determine whether this password field is included while queriying the user (no need if the value is true but I put it)
    },
    name: {
      type: String,
      require: true,
      minLength: 3,
      maxLength: 15,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
