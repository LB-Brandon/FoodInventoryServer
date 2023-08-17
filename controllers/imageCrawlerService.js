const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
require('dotenv').config({ path: __dirname + '/../.env' });
const uuid = require('uuid');

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

async function getImageUrl(keyword) {
	try {
		var imageUrl = '';
		const browser = await puppeteer.launch({
			headless: 'new',
			executablePath: await chromium.executablePath,
			args: ['--no-sandbox'],
		});
		const page = await browser.newPage();

		const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&tbm=isch&tbs=isz:m&hl=en-US`;
		await page.goto(url);

		// 이미지 엘리먼트가 나타날 때까지 대기
		await page.waitForSelector('div.bRMDJf.islir img', { visible: true });

		// 이미지 엘리먼트 선택
		const imgElement = await page.$('div.bRMDJf.islir img');

		// 이미지 엘리먼트의 src 속성에서 URL 추출
		const base64Image = await imgElement.evaluate((img) => img.src);

		await browser.close();
		if (base64Image) {
			console.log(`Found URL`);
		} else {
			console.log('No image found.');
		}

		// Upload image to S3
		const s3 = new AWS.S3();
		// Convert base64 to Buffer
		const imageBuffer = Buffer.from(base64Image, 'base64');
		// create unique image file name
		const uniqueFileName = `${uuid.v4()}.jpg`;

		const params = {
			Bucket: process.env.AWS_BUKET_NAME,
			Key: uniqueFileName,
			Body: imageBuffer,
			ACL: 'public-read',
			ContentType: 'image/jpeg',
		};

		s3.upload(params, (err, data) => {
			if (!err) {
				imageUrl = data.Location;
				console.log('Image uploaded successfully:', data.Location);
			} else {
				console.error('Error uploading image:', err);
			}
		});
		// check if imageUrl is empty

		if (imageUrl) {
			return imageUrl;
		} else {
			return null;
		}
	} catch (error) {
		console.log('Error fetching the HTML:', error);
		return null;
	}
}

exports.getImageUrl = getImageUrl;
