// // Create a function to upload file to cloudinary and return the url of the uploaded file.

// import axios from 'axios';

// export const uploadFile = async (file) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   formData.append('upload_preset', 'docuSyncUploadPreset');

//   const res = await axios
//     .post('https://api.cloudinary.com/v1_1/dhwefibtv/image/upload', formData)
//     .then((response) => {
//       return response.data.secure_url;
//     })
//     .catch((error) => {
//       console.log(error);
//     });

//   return res;
// };
