const prisma = require("../prisma/client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../s3");
const crypto = require("crypto");
const sharp = require("sharp");

const uploadProfilePicture = async (req, res) => {
  const userId = req.user.id;
  console.log(req.file);

  const randomImageName = (bytes = 32) =>
    crypto.randomBytes(bytes).toString("hex");
  const imageName = randomImageName();

  // Resize the image to 500x500 pixels
  const resizedImageBuffer = await sharp(req.file.buffer)
    .resize({ height: 500, width: 500, fit: "contain" })
    .toBuffer();

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `profile_pics/${userId}/${imageName}`,
    Body: resizedImageBuffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  try {
    // Update the user's profile picture in the database
    await prisma.user.update({
      where: { id: userId },
      data: { profilePic: imageName },
    });
    res.status(200).send("Profile picture uploaded successfully");
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  uploadProfilePicture,
};
