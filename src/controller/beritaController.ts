import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Interface untuk mempermudah pengecekan tipe data
interface IBeritaBody {
  judul: string;
  isi: string;
  id_kategori: number;
  gambar_url?: string;
  id_admin?: number;
}

export const BeritaController = {
  // 1. READ: Ambil semua berita
  getAll: async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('berita')
        .select(`
          id, 
          judul, 
          slug, 
          isi, 
          gambar_url, 
          created_at, 
          kategori (id, nama_kategori)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // 2. READ: Berdasarkan Slug (Untuk Detail Halaman)
  getBySlug: async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { data, error } = await supabase
        .from('berita')
        .select('*, kategori(nama_kategori)')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: "Berita tidak ditemukan" });
      }

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // 3. CREATE: Tambah berita
  create: async (req: Request, res: Response) => {
    try {
      const { judul, isi, id_kategori, gambar_url, id_admin }: IBeritaBody = req.body;

      // Validasi sederhana
      if (!judul || !isi || !id_kategori) {
        return res.status(400).json({ success: false, message: "Judul, Isi, dan Kategori wajib diisi" });
      }

      // Generate Slug yang lebih aman
      const slug = judul
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Hapus karakter non-word/space
        .replace(/[\s_-]+/g, '-') // Ganti spasi/underscore jadi strip tunggal
        .replace(/^-+|-+$/g, ''); // Hapus strip di awal/akhir

      const { data, error } = await supabase
        .from('berita')
        .insert([{ judul, slug, isi, id_kategori, gambar_url, id_admin }])
        .select();

      if (error) throw error;

      return res.status(201).json({ 
        success: true, 
        message: "Berita berhasil diterbitkan", 
        data: data[0] 
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // 4. UPDATE: Edit berita
  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const body: Partial<IBeritaBody> = req.body;
      
      // Ambil data lama untuk cek apakah judul berubah
      if (body.judul) {
        (body as any).slug = body.judul
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      const { data, error } = await supabase
        .from('berita')
        .update(body)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        return res.status(404).json({ success: false, message: "Data tidak ditemukan untuk diupdate" });
      }

      return res.status(200).json({ 
        success: true, 
        message: "Berita berhasil diupdate", 
        data: data[0] 
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  },

  // 5. DELETE: Hapus berita
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('berita')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ 
        success: true, 
        message: "Berita berhasil dihapus" 
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};