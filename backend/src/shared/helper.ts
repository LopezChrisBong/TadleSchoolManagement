// import { join } from 'path';

// export class Helper {
//   static customFileName(req, file, cb) {
//     let customFile = file.originalname.split('.')[0];
//     customFile =
//       customFile.replace(/\s/g, '').replace(/%20/g, '') +
//       Date.now() +
//       '-' +
//       Math.round(Math.random() * 1e9);
//     let fileExtension = '';

//     if (file.mimetype.indexOf('jpeg') > -1) {
//       fileExtension = '.jpeg';
//     } else if (file.mimetype.indexOf('jpg') > -1) {
//       fileExtension = '.jpg';
//     } else if (file.mimetype.indexOf('png') > -1) {
//       fileExtension = '.png';
//     } else if (file.mimetype.indexOf('pdf') > -1) {
//       fileExtension = '.pdf';
//     }

//     customFile = customFile + fileExtension;
//     cb(null, customFile);
//   }

//   static filePath(req, file, cb) {
//     // cb(null, join(process.cwd(), '/../upload_img/'));
//     cb(null, join(process.cwd(), process.env.FILE_PATH + 'upload_img/'));
//   }

//   static student_files(req, file, cb) {
//     // cb(null, join(process.cwd(), '/../student_file/'));
//     cb(null, join(process.cwd(), process.env.FILE_PATH + 'student_file/'));
//   }

//   static event_files(req, file, cb) {
//     cb(null, join(process.cwd(), process.env.FILE_PATH + 'event_file/'));
//   }
// }
import { join } from 'path';
import * as fs from 'fs';

export class Helper {
  static UPLOAD_ROOT = join(__dirname, '..', '..', 'upload_img');
  static STUDENT_ROOT = join(__dirname, '..', '..', 'student_file');
  static EVENT_ROOT = join(__dirname, '..', '..', 'event_file');

  static ensureDir(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
  }

  static customFileName(req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    cb(null, filename);
  }

  static filePath(req, file, cb) {
    Helper.ensureDir(Helper.UPLOAD_ROOT);
    cb(null, Helper.UPLOAD_ROOT);
  }

  static student_files(req, file, cb) {
    Helper.ensureDir(Helper.STUDENT_ROOT);
    cb(null, Helper.STUDENT_ROOT);
  }

  static event_files(req, file, cb) {
    Helper.ensureDir(Helper.EVENT_ROOT);
    cb(null, Helper.EVENT_ROOT);
  }
}
