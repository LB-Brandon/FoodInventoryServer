const axios = require('axios');
const cheerio = require('cheerio');

async function getImageUrl(keyword) {
	try {
		const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&tbm=isch&tbs=isz:m&hl=en-US`;
		const headers = {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
		};

		const response = await axios.get(url, { headers });

		const $ = cheerio.load(response.data);
		const targetClassName = '.bRMDJf.islir';
		const imgElement = $(targetClassName).first();
		const imgUrl = imgElement.find('img').attr('src');

		if (imgUrl) {
			console.log(`First Image URL: ${imgUrl}`);
		} else {
			console.log('No image found.');
		}
		return imgUrl;
	} catch (error) {
		console.log('Error fetching the HTML:', error);
		return null;
	}
}

exports.getImageUrl = getImageUrl;
