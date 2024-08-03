const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function sKuronime(page = 1) {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .build();

  try {
    await driver.get(`https://kuronime.me/anime/page/${page}/?title&status&type&order=title`);
    await driver.wait(until.elementLocated(By.css('.listupd .bs')), 10000);

    return await driver.executeScript(() => {
      return Array.from(document.querySelectorAll('.listupd .bs')).map(el => {
        const title = el.querySelector('.tt h4')?.textContent.trim();
        if (!title) return null;
        return {
          title,
          url: el.querySelector('a')?.href,
          imageUrl: el.querySelector('.limit img')?.src || el.querySelector('.limit img')?.dataset.src,
          type: el.querySelector('.bt span')?.textContent.trim(),
          rating: parseFloat(el.querySelector('.rating i')?.textContent.trim())
        };
      }).filter(Boolean);
    });
  } finally {
    await driver.quit();
  }
}

// Cara penggunaan
sKuronime(2).then(console.log).catch(console.error);