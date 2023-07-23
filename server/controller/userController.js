const User = require("../model/user");
const Session = require("../model/session");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;
  const currentUser = await User.findOne({ email });

  if (!currentUser) {
    res.status(400).json({ message: "User Not Found!" });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, currentUser.password);

  if (!isPasswordValid) {
    res.status(400).json({ message: "Incorrect Credentials!" });
    return;
  }

  const sessionId = uuid.v4();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  const session = new Session({
    sessionId,
    userId: currentUser._id,
    expiresAt,
  });
  await session.save();

  const token = jwt.sign(
    {
      email: currentUser.email,
      username: currentUser.name,
      id: currentUser._id,
      session,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.setHeader("Authorization", `Bearer ${token}`);
  res.status(200).json({ token: token, session: session });
};

// New User Registration Controller
const register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.status(400).json({ message: "Email Already Taken!" });
      return;
    }

    const newUser = new User({
      email,
      password,
      name,
    });

    const saveUser = await newUser.save();
    res.status(200).json({ user: saveUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ message: "Internal server Error" });
    }
  }
};

// Get User Profile Controller
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.session;
    const currentUser = await User.findById(id).select("-password");
    if (!currentUser) {
      return res.status(400).json({ message: "User Not Found!" });
    }
    res.status(200).json({ message: currentUser, sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Update User Profile Controller
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password } = req.body;
    const updates = {};
    if (name) {
      updates.name = name;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updates.password = hashedPassword;

      const newSessionId = uuid.v4();
      updates.session = { sessionId: newSessionId };

      await Session.findOneAndUpdate(
        { userId: id },
        { sessionId: newSessionId }
      );

      const token = jwt.sign(
        {
          email: req.user.email,
          username: req.user.username,
          session: { sessionId: newSessionId },
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Set the new token in the response headers
      res.setHeader("Authorization", `Bearer ${token}`);
    }
    const updateUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updateUser) {
      res.status(400).json({ message: "User Not Found!" });
      return;
    }

    res.status(200).json({
      message: "User Updated Successfully!",
      user: updateUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//logout Controller
const logout = async (req, res) => {
  const { sessionId } = req.session;
  try {
    await Session.deleteOne({ sessionId });
    res.status(200).json({ message: "Logged Out Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Delete Account
const deleteAccout = async (req, res) => {
  const id = req.user.id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Account Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, register, getUser, updateUser, logout, deleteAccout };
