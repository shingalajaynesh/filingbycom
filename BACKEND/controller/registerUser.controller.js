import User from "../models/User.model.js";

const registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, phone } = req.body;

		if (!firstName || !lastName || !email || !phone) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const normalizedEmail = email.trim().toLowerCase();
		const normalizedPhone = phone.trim();

		const existingUser = await User.findOne({
			$or: [{ email: normalizedEmail }, { phone: normalizedPhone }],
		});

		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User already exists",
			});
		}

		const user = await User.create({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: normalizedEmail,
			phone: normalizedPhone,
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
