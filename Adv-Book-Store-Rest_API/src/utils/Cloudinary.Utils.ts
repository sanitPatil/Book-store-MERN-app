import { v2 as cloudinary } from 'cloudinary';
import { MulterFile } from '../middlewares/Multer.Middlewares';
import fs from 'node:fs';
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export async function UploadOnCloud(file: MulterFile): Promise<any> {
  if (!file) {
    console.error(`File is Missing`);
    return;
  }

  const { path, filename, mimetype } = file;
  try {
    const uploadResponse = await cloudinary.uploader.upload(path, {
      filename_override: filename + '-' + Date.now(),
      folder: mimetype.split('/')[0],
      format: mimetype.split('/').at(-1),
    });

    if (!uploadResponse) {
      console.error(`cloud Upload failed at server`);
      process.exit(1);
    }
    console.log(`Upload successfully on cloud`);
    fs.unlink(path, () => console.log(`File Remove Successfully,${path}`));
    return uploadResponse;
  } catch (error) {
    fs.unlink(path, () => console.log(`File Remove Successfully,${path}`));
    console.error(`Error while Uploading resource on Cloud, ${error}`);

    process.exit(1);
  }
}
