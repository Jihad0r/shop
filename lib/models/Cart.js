import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false, timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, 
  },
  sessionId: {
    type: String,
    required: false,
  },
    isGuest: {
      type: Boolean,
      default: false,
    },
    status: { 
      type: String, 
      enum: ["Pending","Ordered" ,"Shipped", "Delivered"], 
      default: "Pending" 
    },
    isPaid: { 
      type: Boolean, 
      default: false 
    },
    orderinfo:{firstName:{
      type: String,
    },
    lastName:{
      type: String,
    },
    city:{
      type: String,
    },
    phone:{
      type: String,
    },
    goverment:{
      type: String,
    },
    postCode:{
      type: String,
    },
    street:{
      type: String,
    },
  },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;