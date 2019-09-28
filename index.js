const fetch = require('node-fetch')
const moment = require('moment')

const substring = (word) => {
 return `${word.substring(0, 73)}${word.substring(0, 73).length < word.length ? '...' : ''}`
}

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
	console.log(` HN - ${JSON.stringify(response)}`)
})



const productHunt = async () => {
	const res = await fetch('https://api.producthunt.com/v1/posts', {
		method: 'GET',
		headers: {
			Authorization: 'Bearer -2tf26gLpVVgCx2Bi9OKI2L8hROOD4N8fKYxmEnlcHk',
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Host: 'api.producthunt.com'
		}
	})
	let data = await res.json()
	
	data = data.posts.map((a) => {
		return {title: `${a.name} - ${substring(a.tagline)}`, score: a.votes_count, url: a.redirect_url}
	})
	.sort((a, b) => {
		return a.score > b.score ? -1 : a.score < b.score ? 1 : 0
	})
	.slice(0, 10)

	const req = await fetch('https://www.jsonstore.io/4bcfd16ed408234c1ad240f0123fb8b8fdbc2e2fe2d04e00f323259f9a4185ac', {
		method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
	})
	const response = await req.json()
	console.log(` PH - ${JSON.stringify(response)}`)
	
}


const github = async () => {
	const res = await fetch('https://github-trending-api.now.sh/', {
		method: 'GET'
	})
	let data = await res.json()

	data = data.map((a) => {
		return {
			title: `${a.name} - ${substring(a.description)}`,
			url: a.url,
			score: a.stars
		}
	})
	.sort((a, b) => {
		return a.score > b.score ? -1 : a.score < b.score ? 1 : 0
	})
	.slice(0, 10)

	const req = await fetch('https://www.jsonstore.io/42b21a4a92c6846554e41a527b69da17bcad0ea51191c4dfabf6c1b7386fde08', {
		method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
	})
	const response = await req.json()
	console.log(` Gtihub - ${JSON.stringify(response)}`)
}

productHunt()
github()