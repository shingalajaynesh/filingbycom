import User from "../models/User.model.js";

const registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, phone } = req.body;

		if (!firstName || !lastName || !email) {
			return res.status(400).json({
				success: false,
				message: "First name, last name, and email are required",
			});
		}

		const normalizedEmail = email.trim().toLowerCase();
		const normalizedPhone = phone ? phone.trim() : undefined;

		// If user already exists (e.g. returning Google OAuth user), return them
		const existingUser = await User.findOne({ email: normalizedEmail });
		console.log(existingUser);
		if (existingUser) {
			return res.status(200).json({
				success: true,
				message: "User already registered",
				user: {
					id: existingUser._id,
					firstName: existingUser.firstName,
					lastName: existingUser.lastName,
					email: existingUser.email,
					phone: existingUser.phone,
				},
			});
		}

		const user = await User.create({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: normalizedEmail,
			...(normalizedPhone && { phone: normalizedPhone }),
		});

		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				phone: user.phone,
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
