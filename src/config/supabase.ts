import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ URL atau Key Supabase tidak ditemukan di file .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    // Ini kuncinya: Memasukkan library ws ke dalam global constructor yang dicari Supabase
    headers: { 'x-my-custom-header': 'be-wpm' },
  },
});

// Hack tambahan: Jika cara di atas masih gagal, kita paksa di level global Node
if (!global.WebSocket) {
  (global as any).WebSocket = ws;
}

console.log("✅ Koneksi Supabase Berhasil Diinisialisasi!");