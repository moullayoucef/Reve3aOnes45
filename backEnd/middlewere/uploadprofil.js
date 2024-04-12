const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination : function (req,file, cb){
        cb(null,"uploads/profil")
    },
    filename: function (req,file,cb){
        const ext = path.extname
        (file.originalname)
        cb(null,`${file.fieldname}-${Date.now()}${ext}`)
    }
})

const uploadprofil = multer({storage: storage})

module.exports = uploadprofil