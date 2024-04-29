import multer from "multer";


//diskstorage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './publicc/tempp') //gitkeep here
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer
  (
    { storage, }
)