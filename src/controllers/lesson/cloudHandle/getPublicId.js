const getPublicId = (url, lesson) =>
  `lessons/${lesson.title}/${url.split('/').pop().split('.')[0]}`;

module.exports = getPublicId;