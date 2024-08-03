const { chromium } = require('playwright');

async function scrapeKuronimePage(page = 1) {
  try {
    // Membuka browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const newPage = await context.newPage();

    // Navigasi ke halaman
    await newPage.goto(`https://kuronime.me/anime/page/${page}/?title&status&type&order=title`, {
      waitUntil: 'networkidle'
    });

    // Scraping data
    const animeList = await newPage.evaluate(() => {
      const results = [];
      document.querySelectorAll('.listupd .bs').forEach((element) => {
        const title = element.querySelector('.tt h4')?.textContent.trim();
        const url = element.querySelector('a')?.href;
        const imageUrl = element.querySelector('.limit img')?.src || element.querySelector('.limit img')?.dataset.src;
        const type = element.querySelector('.bt span')?.textContent.trim();
        const rating = parseFloat(element.querySelector('.rating i')?.textContent.trim());

        if (title) {
          results.push({ title, url, imageUrl, type, rating });
        }
      });
      return results;
    });

    // Menutup browser
    await browser.close();

    return animeList;
  } catch (error) {
    console.error('Terjadi kesalahan saat melakukan scraping:', error);
    return [];
  }
}

// Contoh penggunaan
scrapeKuronimePage(2).then(result => {
  console.log(result);
});