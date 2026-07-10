import { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!.trim(),
    process.env.VITE_SUPABASE_SERVICE_ROLE!.trim()
);

const BUCKET = "uploads";

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("DEBUG URL:", JSON.stringify(process.env.VITE_SUPABASE_URL));
        console.log("DEBUG BUCKET:", JSON.stringify(BUCKET));
        if (!req.file) {
            res.status(400).json({ success: false, message: "Tidak ada file yang diupload." });
            return;
        }

        const ext = req.file.originalname.split(".").pop();
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;

        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
            });

        if (error) {
            console.error("Supabase upload error:", error);
            res.status(500).json({ success: false, message: "Gagal mengupload ke storage." });
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(fileName);

        res.status(200).json({
            success: true,
            message: "Gambar berhasil diupload.",
            url: publicUrlData.publicUrl,
            filename: fileName,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengupload gambar." });
    }
};

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { filename } = req.params as { filename: string };

        const { error } = await supabase.storage.from(BUCKET).remove([filename]);

        if (error) {
            console.error("Supabase delete error:", error);
            res.status(500).json({ success: false, message: "Gagal menghapus dari storage." });
            return;
        }

        res.status(200).json({ success: true, message: "Gambar berhasil dihapus." });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghapus gambar." });
    }
};