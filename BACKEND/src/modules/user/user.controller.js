import User from "../../models/User.model.js";
import { mapClerkUserToProfile } from "../../middleware/auth.middleware.js";

const registerUser = async (req, res) => {
	try {
		const clerkUser = req.clerkUser || req.user;

		if (!clerkUser) {
			return res.status(401).json({
				success: false,
				message: "Authenticated user is required",
			});
		}

		const clerkProfile = mapClerkUserToProfile(clerkUser);

		if (!clerkProfile.email) {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		// 1. Sanitize and Normalize Inputs
		const { firstName, lastName, phone } = req.body || {};
		const normalizedEmail = clerkProfile.email.toLowerCase().trim();
		const normalizedPhone = String(phone || clerkProfile.phone || "").trim();
		const normalizedFirstName = firstName?.trim() || clerkProfile.firstName?.trim() || "User";
		const normalizedLastName = lastName?.trim() || clerkProfile.lastName?.trim() || "";
		const clerkId = clerkProfile.clerkId;

		// 2. Safe Database Synchronization
		// Look up by Clerk ID first (The absolute source of truth for auth)
		let user = await User.findOne({ clerkId });

		// If no user is found by Clerk ID, attempt to link by email or create a new one
		if (!user) {
			user = await User.findOne({ email: normalizedEmail });
			if (user) {
				// Link by email: update clerkId and sync profile fields
				user.clerkId = clerkId;
				if (normalizedFirstName && (!user.firstName || user.firstName === "User" || user.firstName === "Client")) {
					user.firstName = normalizedFirstName;
				}
				if (normalizedLastName && !user.lastName) {
					user.lastName = normalizedLastName;
				}
				if (normalizedPhone && !user.phone) {
					user.phone = normalizedPhone;
				}
				if (!user.authProvider) {
					user.authProvider = "clerk";
				}
				await user.save();
			} else {
				user = await User.create({
					email: normalizedEmail,
					clerkId,
					firstName: normalizedFirstName,
					lastName: normalizedLastName,
					authProvider: "clerk",
					...(normalizedPhone && { phone: normalizedPhone }),
				});
			}
		}

		// 3. Return Clean Response
		return res.status(201).json({
			success: true,
			message: "User synchronized successfully",
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone,
				clerkId: user.clerkId,
			},
		});

	} catch (error) {
		console.error("User Registration Error:", error);

		// Explicitly handle MongoDB Duplicate Key Errors (e.g., race conditions)
		if (error.code === 11000) {
			return res.status(409).json({
				success: false,
				message: "An account with this email or identity already exists.",
			});
		}

		return res.status(500).json({
			success: false,
			message: "Unable to register user. Please try again later.",
		});
	}
};

export default registerUser;