import { Router } from "express";
import { GuruController } from "../controller/guruController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

// Public
router.get("/", GuruController.getAll);
router.get("/:id", GuruController.getById);

// Protected + upload foto (field name: "foto")
router.post("/", authenticate, upload.single("foto"), GuruController.create);
router.put("/:id", authenticate, upload.single("foto"), GuruController.update);
router.delete("/:id", authenticate, GuruController.delete);

export default router;