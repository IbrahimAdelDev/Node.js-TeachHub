const cloudinary = require('../../../config/cloudinary');

const deleteFromCloudinary = async (publicIds, resourceType) => {
  return Promise.all(
    publicIds.map((id) =>
      cloudinary.uploader.destroy(id, { resource_type: resourceType })
    )
  );
};

module.exports = deleteFromCloudinary;