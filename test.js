const cloudinary = require('./src/config/cloudinary');
const str =
  'https://res.cloudinary.com/dfpx3gupk/video/upload/v1746421584/lessons/lesson1/scsc8hefltbyhm7h8k63.mp4';

const publicId = str.split('/').pop().split('.')[0]; // Extract full path
// console.log(publicId); // Output: lessons/lesson1/scsc8hefltbyhm7h8k63

const deleteFromCloudinary = async (publicIds) => {
  try {
    const results = await Promise.all(
      publicIds.map((id) =>
        cloudinary.uploader.destroy(id, { resource_type: 'video' })
      )
    );
    return results;
  } catch (error) {
    throw new Error('Error deleting files from Cloudinary');
  }
};

async function test() {
  try {
    const publicIds = [`lessons/lesson1/${publicId}`];
    // console.log(publicIds); // Output: [ 'lessons/lesson1/scsc8hefltbyhm7h8k63' ]
    const result = await deleteFromCloudinary(publicIds);
    // console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

// test();

const lesson = {
  _id: { $oid: '6818f20700fdf52b7ae8a751' },
  title: 'lesson1',
  description: 'desc lesson1',
  videoUrls: [
    {
      url: 'https://res.cloudinary.com/dfpx3gupk/video/upload/v1746426903/lessons/lesson1/va4v7ha8i5t51ije7v3x.mp4',
      _id: { $oid: '68185c1a31a58d82e8afc617' },
    },
  ],
  imageUrls: [
    {
      url: 'https://res.cloudinary.com/dfpx3gupk/image/upload/v1746426905/lessons/lesson1/tlrtf16mpykuxdgek2bp.jpg',
      _id: { $oid: '68185c1a31a58d82e8afc618' },
    },
    {
      url: 'https://res.cloudinary.com/dfpx3gupk/image/upload/v1746426906/lessons/lesson1/nwaczbxj5jnn7wedn9sd.png',
      _id: { $oid: '68185c1a31a58d82e8afc619' },
    },
  ],
  hlsUrls: [
    {
      url: 'https://res.cloudinary.com/dfpx3gupk/video/upload/v1746426903/lessons/lesson1/va4v7ha8i5t51ije7v3x.m3u8',
      _id: { $oid: '68185c1a31a58d82e8afc61a' },
    },
  ],
  createdAt: { $date: { $numberLong: '1746426906212' } },
  updatedAt: { $date: { $numberLong: '1746426906212' } },
  __v: { $numberInt: '0' },
};


const getPublicId = (url) => `lessons/${lesson.title}/${url.split('/').pop().split('.')[0]}`;

console.log(getPublicId(lesson.videoUrls[0].url)); // Output: lessons/lesson1/va4v7ha8i5t51ije7v3x


const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ Connected to MongoDB ${process.env.MONGO_URI}`))
  .catch((err) => console.error('❌ Failed to connect', err));