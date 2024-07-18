const cloudinary = require("../configs/cloudinary.config");

const uploadImageFromLocal = async ({
  files,
  folderName = "toeic/2024/image",
}) => {
  try {
    let results = [];
    await Promise.all(
      files.map(async (file) => {
        const { path } = file;
        const public_id = `${file.filename}-${Date.now()}-${Math.floor(
          Math.random() * 1e6
        )}`;
        const result = await cloudinary.uploader.upload(path, {
          folder: folderName,
          public_id: public_id,
        });
        results.push({ url: result.secure_url });
      })
    );
    return results;
  } catch (error) {
    console.log(error);
  }
};

//4. upload file audio/video
const uploadAudioFromLocal = async ({
  path,
  folderName = "toeic/2024/audio",
  public_id = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
}) => {
  const result = await cloudinary.uploader.upload(path, {
    resource_type: "video",
    public_id,
    folder: folderName,
  });
  console.log(result);
  return {
    url: result.secure_url,
  };
};

module.exports = {
  uploadImageFromLocal,
  uploadAudioFromLocal,
};
