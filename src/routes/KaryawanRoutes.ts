import { Router } from "express";
import { KaryawanController } from "../controller/KaryawanController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

// Public
router.get("/", KaryawanController.getAll);
router.get("/:id", KaryawanController.getById);

// Protected + upload foto (field name: "foto")
router.post("/", authenticate, upload.single("foto"), KaryawanController.create);
router.put("/:id", authenticate, upload.single("foto"), KaryawanController.update);
router.delete("/:id", authenticate, KaryawanController.delete);

export default router;