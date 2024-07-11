import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// register

const register = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists", error: true });
    }
    const hashPassword = bcryptjs.hashSync(password, 12);
    const user = await new User({
      name,
      email,
      password: hashPassword,
      avatar,
    }).save();
    return res.status(201).json({
      success: true,
      message: "User created Successfully!",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isValidPassword = bcryptjs.compareSync(password, user.password);
    if (user && isValidPassword) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      const cookieOptions = {
        http: true,
        secure: true,
      };
      return res.cookie("token", token, cookieOptions).status(200).json({
        success: true,
        message: "Login Successfully!",
        token: token,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid email or password.", error: true });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const userDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    if (token) {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id).select("-password");
      return res.status(201).json({
        success: true,
        message: "User Details",
        data: user,
      });
    } else {
      return { message: "session out", logout: true };
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const logout = async (req, res) => {
  try {
    const cookieOptions = {
      http: true,
      secure: true,
    };
    return res.cookie("token", "", cookieOptions).status(200).json({
      message: "session out",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const token = req.cookies.token || "";
    const { name, avatar } = req.body;
    console.log(name);
    console.log(avatar);
    if (token) {
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id).select("-password");
      const udatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          name,
          avatar,
        },
        {
          new: true,
        }
      );
      return res.status(201).json({
        success: true,
        message: "User updated successfully!",
        data: udatedUser,
      });
    } else {
      return { message: "session out", logout: true };
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const { search } = req.body;

    const query = new RegExp(search, "i", "g");

    const user = await User.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password");

    return res.status(201).json({
      success: true,
      message: "All users.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};

export { register, login, userDetails, logout, updateUserDetails, searchUser };
