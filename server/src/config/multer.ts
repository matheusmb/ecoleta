import path from 'path';
import crypto from 'crypto';

import multer from 'multer';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(request, file, cb) {
      const hash = crypto.randomBytes(6).toString('hex');

      const filename = `${hash}-${file.originalname}`;

      cb(null, filename);
    },
  }),
};
