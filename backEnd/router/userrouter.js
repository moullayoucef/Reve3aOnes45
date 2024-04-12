const express = require("express");
const router = express.Router();
const {getUserId, updateUser,deleteUser,uploadprofilepicture} = require("../controllers/usercontrollers");
const uploadprofil = require("../middlewere/uploadprofil")
const usermidd = require("../middlewere/userMidd");


//getUser 
router.get("/:userId",getUserId)

router.put("/update",usermidd,updateUser );

router.delete("/delete",usermidd,deleteUser)

router.put("/updatephoto",usermidd,uploadprofil.single("profilePicture"),uploadprofilepicture)



module.exports = router;