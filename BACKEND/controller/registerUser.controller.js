import User from "../models/User.model.js";

const registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, password, phone } = req.user;

		if (!firstName || !lastName || !email || !password || !phone) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const existingUser = await User.findOne({phone});

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User already exists",
			});
		}

		const user = await User.create({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: (supabaseUser.email || email).trim().toLowerCase(),
			password,
			phone,
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
		return res.status(401).json({
			success: false,
			message: error.message || "Unable to register user",
		});
	}
};

export default registerUser;
