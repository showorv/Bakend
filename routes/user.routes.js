import { Router } from "express";
import { currentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, oldNewPass, refreshAccessToken, registerUser, updateAccountDetials, updateAvatar, updateCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route("/register").post(
    //file handaling
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },

        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

    router.route("/login").post(loginUser)

    //secured route
    router.route("/logout").post(verifyJWT, logoutUser)
    router.route("/refresh-token").post(refreshAccessToken)
    router.route("/change-password").post(verifyJWT, oldNewPass)
    router.route("/current-user").post(verifyJWT, currentUser)
    router.route("/update-account").patch(verifyJWT, updateAccountDetials) //patch use when you want to update jst a thing but not all
    router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
    router.route("/coverImage").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)
    router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

    router.route("/history").get(verifyJWT, getWatchHistory)

export default router;
