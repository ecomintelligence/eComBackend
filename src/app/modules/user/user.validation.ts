import { z } from "zod";
import mongoose from "mongoose";

// Zod schema for ObjectId validation
const ObjectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

// Define Zod schema for User validation
export const UserValidationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(11, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().optional(),
  permission: ObjectIdSchema.optional(), 
  store: z.array(ObjectIdSchema).optional(),
  status: z.string().optional(),
  roles: z.array(z.string()).optional(),
});
