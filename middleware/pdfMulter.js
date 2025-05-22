const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,callback) => {
        // console.log(req.body,'destination')
        callback(null, './pdfuploads') // path to store the file
    },
    // name in which the file is stored
    filename: (req,file ,callback) => {
        const fname = `resume-${file.originalname}`
        callback(null , fname)
    }
})

// file filter
const fileFilter = (req, file , callback ) => {
    // console.log('multer',{req})
    // console.log(req.body, req.file , 'here')
    if(file.mimetype == 'application/pdf' || file.mimetype == 'application/PDF'){
        callback(null, true) ;
    }else{
        callback(null, false) ;
        callback(new Error('accepts only pdf files '));
    }
}

// create config
const pdfmulterConfig = multer({
  storage,
  fileFilter,
})

module.exports = pdfmulterConfig