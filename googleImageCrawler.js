const axios = require('axios');
const cheerio = require('cheerio');
const pretty = require('pretty');
const fs = require('fs');

async function getFirstImageFromGoogle(keyword) {
	try {
		// Google 검색 결과 페이지 가져오기
		const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&tbm=isch&tbs=isz:m&hl=en-US`;

		const headers = {
			'User-Agent':
				'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
		};

		const response = await axios.get(url, { headers });
		console.log('url', url);
		// console.log('response', response);

		// 가져온 페이지를 Cheerio로 파싱
		const $ = cheerio.load(response.data);
		// 보기 좋게 출력
		const formattedHtml = pretty($.html());
		// console.log('formattedHtml', formattedHtml);

		// 파일 생성
		fs.writeFileSync('1.html', response.data);

		const targetClassName = '.bRMDJf.islir';
		// bRMDJf islir

		// div 태그 내부의 첫 번째 img 태그 찾기
		const imgElement = $(targetClassName).first();
		console.log('imgElement', imgElement);

		const imgUrl = imgElement.find('img').attr('src');

		if (imgUrl) {
			console.log(`First Image URL: ${imgUrl}`);
		} else {
			console.log('No image found.');
		}
		return imgUrl;
	} catch (error) {
		console.error('Error fetching the HTML:', error);
		return null;
	}
}

// 사용 예시
const keyword = '고양이'; // 검색할 키워드 입력
getFirstImageFromGoogle(keyword).then((imageURL) => {
	if (imageURL) {
		console.log('첫 번째 이미지 URL:', imageURL);
	} else {
		console.log('이미지를 가져오는 데 실패했습니다.');
	}
});
