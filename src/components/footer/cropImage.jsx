// cropImage.js
export default function getCroppedImg(imageSrc, crop, zoom) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        const pixelCrop = {
          x: crop.x * image.width,
          y: crop.y * image.height,
          width: crop.width * image.width,
          height: crop.height * image.height,
        };
  
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas is empty'));
          }
        }, 'image/jpeg');
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  }
  