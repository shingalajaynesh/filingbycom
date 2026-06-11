import User from "../models/User.model.js";
import { mapClerkUserToProfile } from "../lib/verifyToken.js";

const checkUser = async (req, res) => {
  try {
    const clerkUser = req.clerkUser || req.user;
    if (!clerkUser) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user is required",
      });
    }

    const { clerkId, email } = mapClerkUserToProfile(clerkUser);
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is missing in authentication token",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ clerkId }, { email: normalizedEmail }],
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        exists: true,
        user: {
          id: existingUser._id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
          phone: existingUser.phone,
          clerkId: existingUser.clerkId,
        },
      });
    }

    return res.status(200).json({
      success: true,
      exists: false,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to check user existence",
    });
  }
};

export default checkUser;
