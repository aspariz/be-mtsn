import { Router } from "express";
import { uploadImage, deleteImage } from "../controller/uploadController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

// POST /api/upload  — upload 1 gambar, wajib login
router.post(
    "/",
    authenticate,
    upload.single("image"),
    uploadImage
);

// DELETE /api/upload/:filename — hapus gambar, wajib login
router.delete("/:filename", authenticate, deleteImage);

export default router;