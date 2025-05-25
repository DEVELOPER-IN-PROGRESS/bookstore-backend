const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,callback) => {
        // console.log(req.body,'multer active')

        callback(null, './uploads') // path to store the file
    },
    // name in which the file is stored
    filename: (req,file ,callback) => {
        const fname = `image-${file.originalname}`
        callback(null , fname)
    }
})

// file filter
const fileFilter = (req, file , callback ) => {
    // console.log('multer',{req})
    console.log(req.body, req.file , 'here')
    switch(file.mimetype){
        case 'image/png':
        case 'image/PNG':
        case 'image/JPG':
        case 'image/JPEG':
        case 'image/jpg':
        case 'image/jpeg': callback(null , true); break;
        default: callback(null, false) ;
        callback(new Error('accepts only png ,jpg, jpeg files ')); break;
    }
}

// create config
const multerConfig = multer({
  storage,
  fileFilter,
})

module.exports = multerConfig