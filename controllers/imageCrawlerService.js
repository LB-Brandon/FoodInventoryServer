const puppeteer = require('puppeteer');

async function getImageUrl(keyword) {
	try {
		const browser = await puppeteer.launch({ headless: 'new' });
		const page = await browser.newPage();

		const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&tbm=isch&tbs=isz:m&hl=en-US`;
		await page.goto(url);

		// 이미지 엘리먼트가 나타날 때까지 대기
		await page.waitForSelector('div.bRMDJf.islir img', { visible: true });

		// 이미지 엘리먼트 선택
		const imgElement = await page.$('div.bRMDJf.islir img');

		// 이미지 엘리먼트의 src 속성에서 URL 추출
		const imgUrl = await imgElement.evaluate((img) => img.src);

		await browser.close();

		if (imgUrl) {
			console.log(`Found URL`);
			return imgUrl;
		} else {
			console.log('No image found.');
			return null;
		}
	} catch (error) {
		console.log('Error fetching the HTML:', error);
		return null;
	}
}

exports.getImageUrl = getImageUrl;
