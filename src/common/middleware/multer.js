import multer from "multer";
import fs from "fs";

export const multer_local = ({
  custom_path = "General",
  custom_types = [],
} = {}) => {
  const full_path = `uploads/${custom_path}`;
  if (!fs.existsSync(full_path)) {
    fs.mkdirSync(full_path, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, full_path);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.originalname + "-" + uniqueSuffix);
    },
  });

  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
    } else {
      cb(null, true);
    }
  }

  const upload = multer({ storage: storage, fileFilter: fileFilter });

  return upload;
};

export const multer_host = (custom_types = []) => {
  const storage = multer.diskStorage();
  function fileFilter(req, file, cb) {
    if (!custom_types.includes(file.mimetype)) {
      cb(new Error("Invalid file type"));
    } else {
      cb(null, true);
    }
  }
  const upload = multer({ storage: storage, fileFilter: fileFilter });
  return upload;
};
