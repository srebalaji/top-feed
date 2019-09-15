const fetch = require('node-fetch')
const moment = require('moment')

const request = async (url) => {
	const response =  await fetch(url)
	return response.json()
}

const allIds = async () => {
	return request('https://hacker-news.firebaseio.com/v0/topstories.json')
}


const allPosts = async (ids) => {
	ids = ids.slice(0, 60)
	const idsL = ids.length
	const posts = []
	for (let i=0; i<idsL; i+=30) {
		const requests = ids.slice(i, i+30).map((id) => {
			return request(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
		})
		posts.push(
			...await Promise.all(requests)
		)
	}
	return posts
}


const dos = async () => {
	const ids = await allIds()
	const posts = await allPosts(ids)
	return posts
		.sort((a, b) => {
			return a.score > b.score ? -1 : a.score < b.score ? 1 : 0
			// x = +moment(parseInt(`${a.time}000`)).startOf('day')
			// y = +moment(parseInt(`${b.time}000`)).startOf('day')
			// if (x === y) {
			// 	return a.score > b.score ? -1 : a.score < b.score ? 1 : 0
			// }
			// return y - x
		})
		.map((a) => {
			return {
				id: a.id,
				score: a.score,
				title: a.title,
				url: a.url,
				date: a.time,
				dateFormat: moment(parseInt(`${a.time}000`)).format(),
				type: a.type
			}
		})
		.slice(0, 10)
}



dos().then(async (a) => {
	const res = await fetch('https://www.jsonstore.io/aae418df7ce1a10c4012355d4764eec09cc54dc2c084d138d7746eb158814ee2', {
		method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(a)
	})
	const data = await res.json()
	console.log(data)
})

export default dos
