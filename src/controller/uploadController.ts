import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const uploadImage = (req: Request, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "Tidak ada file yang diupload." });
            return;
        }

        // Bangun URL publik berdasarkan BASE_URL di .env
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: "Gambar berhasil diupload.",
            url: fileUrl,
            filename: req.file.filename,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupload gambar." });
    }
};

export const deleteImage = (req: Request, res: Response): void => {
    try {
        const { filename } = req.params as { filename: string };

        // Cegah path traversal
        const safeName = path.basename(filename);
        const filePath = path.join(process.cwd(), "public", "uploads", safeName);

        if (!fs.existsSync(filePath)) {
            res.status(404).json({ success: false, message: "File tidak ditemukan." });
            return;
        }

        fs.unlinkSync(filePath);
        res.status(200).json({ success: true, message: "Gambar berhasil dihapus." });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghapus gambar." });
    }
};