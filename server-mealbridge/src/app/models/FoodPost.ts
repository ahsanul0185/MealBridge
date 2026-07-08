import mongoose, { Schema, Document } from "mongoose";

export interface IFoodPost extends Document {
  restaurant_id: mongoose.Types.ObjectId;
  food_name: string;
  food_type: "Veg" | "Non-Veg";
  quantity: number;
  pickup_address: string;
  area: string;
  prepared_time: Date;
  safe_until_time: Date;
  image_url?: string;
  note?: string;
  status: "Available" | "Claimed" | "On the way" | "Picked up" | "Expired" | "Cancelled";
  claimed_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const foodPostSchema = new Schema<IFoodPost>(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Restaurant ID is required"],
    },
    food_name: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    food_type: {
      type: String,
      enum: ["Veg", "Non-Veg"],
      required: [true, "Food type is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be greater than 0"],
    },
    pickup_address: {
      type: String,
      required: [true, "Pickup address is required"],
      trim: true,
    },
    area: {
      type: String,
      required: [true, "Area is required"],
      trim: true,
    },
    prepared_time: {
      type: Date,
      required: [true, "Prepared time is required"],
    },
    safe_until_time: {
      type: Date,
      required: [true, "Safe until time is required"],
    },
    image_url: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Available", "Claimed", "On the way", "Picked up", "Expired", "Cancelled"],
      default: "Available",
    },
    claimed_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Index for filtering by area and status
foodPostSchema.index({ area: 1, status: 1 });
foodPostSchema.index({ safe_until_time: 1 });

const FoodPost = mongoose.model<IFoodPost>("FoodPost", foodPostSchema);
export default FoodPost;
