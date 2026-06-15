import Setting from "../../models/Setting.model.js";

/**
 * Gets all public settings.
 */
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.find({ isPublic: true }).lean();
    
    // Map array to a key-value dictionary for easy client use
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return res.status(200).json({ success: true, settings: settingsMap });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Creates or updates settings.
 * Expects key and value in the body.
 */
export const updateSettings = async (req, res) => {
  try {
    const { key, value, isPublic = true } = req.body;

    if (!key) {
      return res.status(400).json({ success: false, message: "Setting key is required" });
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, isPublic },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({ success: true, setting });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
