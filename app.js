const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeKuronimePage(page = 1) {
  try {
    // Mengatur URL dan headers
    const url = `https://kuronime.me/anime/page/${page}/?title&status&type&order=title`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    // Melakukan request ke halaman
    const response = await axios.get(url, { headers });
    const html = response.data;

    // Parsing HTML menggunakan Cheerio
    const $ = cheerio.load(html);

    // Scraping data
    const animeList = [];
    $('.listupd .bs').each((index, element) => {
      const title = $(element).find('.tt h4').text().trim();
      const url = $(element).find('a').attr('href');
      const imageUrl = $(element).find('.limit img').attr('src') || $(element).find('.limit img').attr('data-src');
      const type = $(element).find('.bt span').text().trim();
      const rating = parseFloat($(element).find('.rating i').text().trim());

      if (title) {
        animeList.push({ title, url, imageUrl, type, rating });
      }
    });

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