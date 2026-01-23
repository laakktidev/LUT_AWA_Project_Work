import multer from "multer";
import path from "path";

// Where to store uploaded files
/*
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile-picture"); // default folder for now
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  }
});*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile-picture");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${req.user?._id}.${ext}`);
  }
});


// Accept only images
function fileFilter(req: any, file: Express.Multer.File, cb: any) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {  
    cb(new Error("Only images allowed"), false);
  }
}

export const upload = multer({ storage, fileFilter });
