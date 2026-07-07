import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { generateToken } from "../../utils/jwt.js";
import AppError from "../../errorHelpers/AppError.js";
import { IRegisterPayload, ILoginPayload } from "./auth.interface.js";

const register = async (payload: IRegisterPayload) => {
  const { email, password, ...rest } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    email,
    password: hashedPassword,
    ...rest,
  });

  const token = generateToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const login = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const authService = {
  register,
  login,
};

export default authService;
