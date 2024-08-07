const puppeteer = require('puppeteer');

async function scrapeYtmp3s(youtubeUrl) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  try {
    // Buka halaman ytmp3s.nu
    await page.goto('https://ytmp3s.nu/');

    // Masukkan URL YouTube ke dalam input
    await page.type('#url', youtubeUrl);

    // Klik tombol submit
    await page.click('input[type="submit"]');

    // Tunggu hingga hasil konversi muncul (maksimal 15 detik)
    await page.waitForSelector('a[href^="https://mmuu.ummn.nu/api/v1/download"]', { timeout: 15000 });

    // Ambil URL hasil konversi
    const downloadUrl = await page.$eval('a[href^="https://mmuu.ummn.nu/api/v1/download"]', el => el.href);

    return downloadUrl;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return null;
  } finally {
    await browser.close();
  }
}