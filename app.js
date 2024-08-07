const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

async function scrapeYtmp3s(youtubeUrl) {
  try {
    // Buat instance axios
    const axiosInstance = axios.create({
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Ambil halaman utama untuk mendapatkan token CSRF
    const mainPageResponse = await axiosInstance.get('https://ytmp3s.nu/');
    const $ = cheerio.load(mainPageResponse.data);
    const csrfToken = $('input[name="csrf_token"]').val();

    // Buat form data
    const formData = new FormData();
    formData.append('url', youtubeUrl);
    formData.append('csrf_token', csrfToken);

    // Kirim permintaan POST untuk konversi
    const conversionResponse = await axiosInstance.post('https://ytmp3s.nu/', formData, {
      headers: {
        ...formData.getHeaders(),
        'Referer': 'https://ytmp3s.nu/'
      }
    });

    // Parse respons HTML
    const $conversion = cheerio.load(conversionResponse.data);
    
    // Cari link download
    const downloadUrl = $conversion('a[href^="https://mmuu.ummn.nu/api/v1/download"]').attr('href');

    if (!downloadUrl) {
      throw new Error('Link download tidak ditemukan');
    }

    return downloadUrl;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return null;
  }
}