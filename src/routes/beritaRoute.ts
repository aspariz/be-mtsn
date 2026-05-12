import { Router } from 'express';
import { BeritaController } from '../controller/beritaController';

const router = Router();

// Menampilkan semua berita (Public)
router.get('/berita', BeritaController.getAll);

// Menampilkan detail satu berita berdasarkan slug (Public)
router.get('/berita/:slug', BeritaController.getBySlug);

// Tambah berita baru (Admin/CMS)
router.post('/berita', BeritaController.create);

// Update berita berdasarkan ID (Admin/CMS)
router.put('/berita/:id', BeritaController.update);

// Hapus berita berdasarkan ID (Admin/CMS)
router.delete('/berita/:id', BeritaController.delete);

export default router;