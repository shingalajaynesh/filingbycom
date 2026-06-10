import supabase from "../config/supabase.config.js";

const verifyToken = async (token) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    throw new Error("Invalid or expired Supabase token");
  }

  return user;
};

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }
    const supabaseUser = await verifyToken(token);
    req.user = supabaseUser;
    console.log(req.user);
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};

const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token is required",
    });
  }
  const supabaseUser = await verifyToken(token);
  const user = await User.findOne({ phone: supabaseUser.phone }).select(
    "-password",
  );
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  req.user = user;
  next();
};

export { authenticateToken, verifyUser };
