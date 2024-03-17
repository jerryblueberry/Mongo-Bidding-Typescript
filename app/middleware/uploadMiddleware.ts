import multer, { StorageEngine } from "multer";
// import { Request } from "express";

// Define types for the request and file
// interface MulterRequest extends Request {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   file: any; // Adjust the type according to your needs
// }

// interface File {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   destination: string;
//   filename: string;
//   path: string;
//   size: number;
// }

// Define the storage configuration
const storage: StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // desired destination folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Define the file filter function
// const fileFilter = (req: MulterRequest, file: File, cb: multer.FileFilterCallback) => {
//   // check if the file type is allowed
//   const allowedMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file Type. Allowed types: JPEG, JPG, PNG, GIF"));
//   }
// };

// Define limits for file size
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 MB limit
};

// Configure Multer with the defined options
export const singleUpload = multer({
  storage: storage,
  // fileFilter: fileFilter,
  limits: limits,
}).single("profileImage");

//  for the store
export const singleUploadStore = multer({
  storage: storage,

  limits: limits,
}).single("logo");

export const multipleUpload = multer({
  storage: storage,

  limits: limits,
}).array("image", 5);
