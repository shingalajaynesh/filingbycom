import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret",
});

async function runTest() {
  console.log("Using Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
  console.log("Using Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET ? "Exists (hidden)" : "Missing");

  const options = {
    amount: 999 * 100, // in paise
    currency: "INR",
    receipt: `receipt_deed_test_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log("SUCCESS! Razorpay Order Created:", order);
  } catch (error) {
    console.error("FAILED! Razorpay Error details:");
    console.error("Message:", error.message);
    console.error("Full Error:", error);
  }
}

runTest();
