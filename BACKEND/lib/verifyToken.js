import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.model.js";

const getPrimaryEmail = (clerkUser) =>
  clerkUser.emailAddresses.find(
    (email) => email.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress ||
  clerkUser.emailAddresses[0]?.emailAddress ||
  "";

const getPrimaryPhone = (clerkUser) =>
  clerkUser.phoneNumbers[0]?.phoneNumber ||
  clerkUser.unsafeMetadata?.phoneNumber ||
  "";

const mapClerkUserToProfile = (clerkUser) => ({
  clerkId: clerkUser.id,
  firstName: clerkUser.firstName?.trim() || "Client",
  lastName: clerkUser.lastName?.trim() || "User",
  email: getPrimaryEmail(clerkUser).trim().toLowerCase(),
  phone: getPrimaryPhone(clerkUser).trim(),
});

const verifyToken = async (req) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new Error("Authorization token is required");
  }

  const clerkUser = await clerkClient.users.getUser(userId);

  if (!clerkUser) {
    throw new Error("Invalid or expired Clerk token");
  }

  return clerkUser;
};

const authenticateToken = async (req, res, next) => {
  try {
    const clerkUser = await verifyToken(req);
    req.clerkUser = clerkUser;
    req.user = clerkUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const clerkUser = await verifyToken(req);
    const { clerkId, email } = mapClerkUserToProfile(clerkUser);
    const user = await User.findOne({
      $or: [{ clerkId }, { email }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.clerkUser = clerkUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};

export { authenticateToken, verifyUser, mapClerkUserToProfile };
