exports.fileUploadAuth = async (req, res, next) => {
  try {
    if (req.files && req.files.displayPicture) {
      let image = req.files.displayPicture;

      const maxFileSize = 1 * 1024 * 1024;

      if (image.size > maxFileSize) {
        return res.status(400).json({
          success: false,
          message: "File size exceeds! Size should be less than 1 MB",
        });
      }
      req.images = image;
      console.log("Passed from file upload auth...");
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Some error occurred while checking file size.",
      error: error.message,
    });
  }
};
