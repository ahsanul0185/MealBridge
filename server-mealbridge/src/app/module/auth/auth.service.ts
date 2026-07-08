import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";
import AppError from "../../errorHelpers/AppError.js";

// TODO: Replace with actual Mongoose model
const mockUsers: any[] = [];

const register = async (payload: any) => {
  const { email, password, ...rest } = payload;

  // Check if user exists
  const existingUser = mockUsers.find((u) => u.email === email);
  if (existingUser) {
    throw new AppError(409, "User already exists with this email");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = {
    id: String(mockUsers.length + 1),
    email,
    password: hashedPassword,
    ...rest,
  };

  mockUsers.push(user);

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const login = async (payload: any) => {
  const { email, password } = payload;

  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
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
