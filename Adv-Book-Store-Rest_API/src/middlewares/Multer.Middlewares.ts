import multer from 'multer';
import path from 'node:path';
export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
const storage = multer.diskStorage({
  destination: function (req, file: MulterFile, cb) {
    cb(null, path.resolve(__dirname, '../../public/upload-books'));
  },
  filename: function (req, file: MulterFile, cb) {
    cb(null, file.fieldname + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
export { upload };
