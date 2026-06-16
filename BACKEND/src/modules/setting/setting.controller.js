import Setting from "../../models/Setting.model.js";
import { settingCache } from "../../services/cache.service.js";

class SettingController {
  /**
   * Gets all public settings.
   */
  getPublicSettings = async (req, res) => {
    try {
      const cached = settingCache.get("public_settings");
      if (cached) {
        return res.status(200).json({ success: true, settings: cached });
      }

      const settings = await Setting.find({ isPublic: true }).lean();
      
      // Map array to a key-value dictionary for easy client use
      const settingsMap = {};
      settings.forEach((s) => {
        settingsMap[s.key] = s.value;
      });

      settingCache.set("public_settings", settingsMap);
      return res.status(200).json({ success: true, settings: settingsMap });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  /**
   * Creates or updates settings.
   * Expects key and value in the body.
   */
  updateSettings = async (req, res) => {
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

      settingCache.clear();
      return res.status(200).json({ success: true, setting });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new SettingController();
