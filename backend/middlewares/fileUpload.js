const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// the (Uploads/Images) folders must exist as a base so multer can work. 
// multer usage in: app.js(16), places.js(22), placesC.js(41), addPlace.js(245), placeList.js(41)

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
}

let fileUpload = multer({
    limits: 3000000,
    storage: multer.diskStorage({
        // The folder to which the file has been saved	
        destination: (req, file, cb) => {
            cb(null, 'Uploads/Images');
        },
        // the name of the file within the destination
        filename: (req, file, cb) => {
            let ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + ext);
        }
    }),
    // validation of file type
    fileFilter: (req, file , cb) => {
        let isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : {message: 'file type is invalid'};
        cb(error, isValid)
    },
});

module.exports = fileUpload;