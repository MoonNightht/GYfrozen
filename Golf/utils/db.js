export const products = [];
let currentId = 1;
export const nextId = () => currentId++;

export const getImageUrl = (filename) => {
  return filename ? `https://your-cloud-image-url.com/${filename}` : null;
};
