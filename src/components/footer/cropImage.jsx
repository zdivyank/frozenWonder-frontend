// cropImage.js
const getCroppedImg = (imageSrc, crop, zoom) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.width / image.naturalWidth;
        const scaleY = image.height / image.naturalHeight;
  
        // Calculate the crop area
        const cropX = crop.x * scaleX;
        const cropY = crop.y * scaleY;
        const cropWidth = crop.width * scaleX;
        const cropHeight = crop.height * scaleY;
  
        // Set the canvas dimensions
        canvas.width = cropWidth;
        canvas.height = cropHeight;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  
        // Convert canvas to Blob
        canvas.toBlob((blob) => {
          if (blob) {
            blob.name = 'croppedImage.jpg'; // Set the filename
            resolve(blob);
          } else {
            reject(new Error('Failed to generate cropped image.'));
          }
        }, 'image/jpeg');
      };
      image.onerror = (error) => reject(error);
    });
  };
  
  export default getCroppedImg;
  