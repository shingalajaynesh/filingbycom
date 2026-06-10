import User from "../models/User.model.js";

const checkUser = async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is missing in authentication token",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

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
