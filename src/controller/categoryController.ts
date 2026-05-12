import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const CategoryController = {
  // 1. Ambil semua kategori (Untuk dropdown di form input berita)
  getAll: async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('kategori')
        .select('*')
        .order('nama_kategori', { ascending: true });

      if (error) throw error;
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: "Gagal mengambil kategori", error: error.message });
    }
  },

  // 2. Tambah kategori baru (Jika admin ingin menambah jenis kategori baru)
  create: async (req: Request, res: Response) => {
    try {
      const { nama_kategori } = req.body;

      const { data, error } = await supabase
        .from('kategori')
        .insert([{ nama_kategori }])
        .select();

      if (error) throw error;
      res.status(201).json({ message: "Kategori berhasil ditambahkan", data });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // 3. Update nama kategori
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nama_kategori } = req.body;

      const { data, error } = await supabase
        .from('kategori')
        .update({ nama_kategori })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) return res.status(404).json({ message: "Kategori tidak ditemukan" });

      res.status(200).json({ message: "Kategori berhasil diupdate", data });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // 4. Hapus kategori
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('kategori')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(200).json({ message: "Kategori berhasil dihapus" });
    } catch (error: any) {
      res.status(400).json({ message: "Gagal hapus kategori (Mungkin masih digunakan oleh berita lain)", error: error.message });
    }
  }
};