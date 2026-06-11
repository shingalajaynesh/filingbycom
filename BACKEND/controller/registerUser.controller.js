import User from "../models/User.model.js";
import { mapClerkUserToProfile } from "../lib/verifyToken.js";


const registerUser = async (req, res) => {
	try {
		const { firstName, lastName, phone } = req.body || {};
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

		const normalizedEmail = clerkProfile.email;
		const normalizedPhone = String(phone || clerkProfile.phone || "").trim();
		const normalizedFirstName = firstName?.trim() || clerkProfile.firstName;
		const normalizedLastName = lastName?.trim() || clerkProfile.lastName;

		const user = await User.findOneAndUpdate(
			{ $or: [{ clerkId: clerkProfile.clerkId }, { email: normalizedEmail }] },
			{
				$set: {
					clerkId: clerkProfile.clerkId,
					firstName: normalizedFirstName,
					lastName: normalizedLastName,
					email: normalizedEmail,
					authProvider: "clerk",
					...(normalizedPhone ? { phone: normalizedPhone } : {}),
				},
			},
			{ new: true, upsert: true, runValidators: true },
		);

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
		return res.status(500).json({
			success: false,
			message: error.message || "Unable to register user",
		});
	}
};

export default registerUser;
