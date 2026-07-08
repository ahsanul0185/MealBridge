import mongoose, { Schema, Document } from "mongoose";

export interface IClaim extends Document {
  food_post_id: mongoose.Types.ObjectId;
  ngo_id: mongoose.Types.ObjectId;
  claim_time: Date;
  pickup_status: "Claimed" | "On the way" | "Picked up";
  picked_up_time?: Date;
  created_at: Date;
  updated_at: Date;
}

const claimSchema = new Schema<IClaim>(
  {
    food_post_id: {
      type: Schema.Types.ObjectId,
      ref: "FoodPost",
      required: [true, "Food post ID is required"],
    },
    ngo_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "NGO ID is required"],
    },
    claim_time: {
      type: Date,
      default: Date.now,
    },
    pickup_status: {
      type: String,
      enum: ["Claimed", "On the way", "Picked up"],
      default: "Claimed",
    },
    picked_up_time: {
      type: Date,
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

const Claim = mongoose.model<IClaim>("Claim", claimSchema);
export default Claim;
