import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
const axios = require('axios')

import './style.css';
import './custom.css';

const getSource = (source) => {
	switch(source) {
		case 'hn':
			return 'https://www.jsonstore.io/aae418df7ce1a10c4012355d4764eec09cc54dc2c084d138d7746eb158814ee2'
		case 'ph':
			return 'https://www.jsonstore.io/4bcfd16ed408234c1ad240f0123fb8b8fdbc2e2fe2d04e00f323259f9a4185ac'
		case 'github':
			return 'https://www.jsonstore.io/42b21a4a92c6846554e41a527b69da17bcad0ea51191c4dfabf6c1b7386fde08'
		default:
			return 'https://www.jsonstore.io/aae418df7ce1a10c4012355d4764eec09cc54dc2c084d138d7746eb158814ee2'
	}
}

const request = (source) => {
	return new Promise((res, rej) => {
		const url = getSource(source)
		axios.get(url)
		.then((response) => {
			res(response)
		})
		.catch((error) => {
			rej(error)
		})
	})
}

class App extends Component {
	constructor (props) {
		super(props)
		this.state = {
			data: 'loading data..!',
			source: 'hn'
		}
		this.handleClick = this.handleClick.bind(this)
	}

	handleRequest(source) {
		request(source)
		.then((response) => {
			this.setState({
				data: response.data.result
			})
		})
		.catch((err) => {
			this.setState({
				data: 'Error loading data..!'
			})
		})
	}

	handleClick(e) {
		const target = e.target.getAttribute('data-source-name')
		this.setState({
			data: 'loading data..!',
			source: target
		})
		this.handleRequest(target)
	}

	componentDidMount () {
		this.handleRequest(this.state.source)
	}

	render() {
		const data = this.state.data
		let msg = ''
		if (typeof(data) === 'string') {
			msg = <p>{data}</p>
		} else {
			msg = data.map((d, i) => {
				return (
					<div key={d.id || d.url} className="pb-4 font-mono text-base text-grey-800 text-left">
						<a className="hover:bg-red-200" href={d.url} target="_blank" style={{'font-family': 'Fira code, monospace'}}>{d.title}</a>
						<hr className="mt-3" style={{'border-color': '#feb2b2'}}/>
					</div>
				)
			})
		}
		return (
			<div className="flex flex-col mt-12">
				{/*<p className="mx-auto text-3xl py-6" style={{'font-family': 'Fira code, monospace'}}>Top HN stories sorted by votes</p>*/}
				<div className="flex">
					<div className="ml-10 px-8">
						<p className="text-3xl font-light" style={{color: '#f56565'}}>Top Feed</p>
						<p className="font-light">Top stories sorted by votes.</p>
						<hr className="w-1/4 my-3" style={{'border-width': '1.5px'}}/>
						<div className="">
							<p className={`py-1 pointer ${this.state.source === 'hn' ? 'active' : ''}`} data-source-name="hn" onClick={this.handleClick}>Hacker news</p>
							<p className={`py-1 pointer ${this.state.source === 'ph' ? 'active' : ''}`} data-source-name="ph" onClick={this.handleClick}>Product hunt</p>
							<p className={`py-1 pointer ${this.state.source === 'github' ? 'active' : ''}`} data-source-name="github" onClick={this.handleClick}>Github</p>
						</div>
					</div>
					<div className="flex flex-col mr-auto w-3/5 p-2">
						{msg}
					</div>
				</div>
				
			</div>
		)
	}
}
export default App;
