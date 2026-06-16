/**
 * auth.middleware.js
 * Session security interceptor mapping Clerk identity tokens to local MongoDB profiles.
 * - Extracts and validates Clerk session JWTs.
 * - Restructures Clerk profile scopes into a cleaner database format.
 * - Sets the req.user property for down-stream controller access.
 */

import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.model.js";

/**
 * Extracts the primary email address from a Clerk user object.
 * Fallbacks to the first email address in the list or an empty string.
 * @param {Object} clerkUser
 * @returns {string}
 */
const getPrimaryEmail = (clerkUser) =>
  clerkUser.emailAddresses.find(
    (email) => email.id === clerkUser.primaryEmailAddressId,
  )?.emailAddress ||
  clerkUser.emailAddresses[0]?.emailAddress ||
  "";

/**
 * Extracts the primary phone coordinate from a Clerk user profile or unsafeMetadata map.
 * @param {Object} clerkUser
 * @returns {string}
 */
const getPrimaryPhone = (clerkUser) =>
  clerkUser.phoneNumbers[0]?.phoneNumber ||
  clerkUser.unsafeMetadata?.phoneNumber ||
  "";

/**
 * Transforms raw Clerk user data into a clean local application profile model structure.
 * @param {Object} clerkUser
 * @returns {Object} Clean mapped profile data
 */
const mapClerkUserToProfile = (clerkUser) => ({
  clerkId: clerkUser.id,
  firstName: clerkUser.firstName?.trim() || "Client",
  lastName: clerkUser.lastName?.trim() || "User",
  email: getPrimaryEmail(clerkUser).trim().toLowerCase(),
  phone: getPrimaryPhone(clerkUser).trim(),
});

/**
 * Decodes the incoming HTTP Authorization header JWT using Clerk's public key grid.
 * Throws errors if validation fails.
 * @param {Object} req Express request object
 * @returns {Promise<Object>} Clerk user profile details
 */
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

/**
 * Authentication Middleware:
 * Injects verified Clerk profile data directly into req.user.
 * Used for endpoints requiring a valid Clerk session but no local DB verification.
 */
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

/**
 * Verification Middleware:
 * Resolves the authenticated Clerk ID against the local MongoDB user store.
 * Rejects with a 404 if the user profile has not been synchronized yet.
 */
const verifyUser = async (req, res, next) => {
  try {
    const clerkUser = await verifyToken(req);
    const { clerkId, email } = mapClerkUserToProfile(clerkUser);
    const user = await User.findOne({
      $or: [{ clerkId }, { email }],
    }).lean();

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
