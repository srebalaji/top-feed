import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
const axios = require('axios')

import './style.css';

class App extends Component {
	constructor (props) {
		super(props)
		this.state = {
			data: 'loading data..!'
		}
	}

	componentDidMount () {
		axios.get('https://www.jsonstore.io/aae418df7ce1a10c4012355d4764eec09cc54dc2c084d138d7746eb158814ee2')
			.then((response) => {
				this.setState({
					data: response.data.result
				})
			})
			.catch((error) => {
				this.setState({
					data: 'Error loading data..!'
				})
			})
	}

	render() {
		const data = this.state.data
		let msg = ''
		if (typeof(data) === 'string') {
			msg = data
		} else {
			msg = data.map((d) => {
				return (
					<div key={d.id} className="p-3 font-mono text-base text-grey-800">
						<a className="hover:bg-red-200" href={d.url} target="_blank">{d.title}</a>
					</div>
				)
			})
		}
		return (
			<div className="flex flex-col ">
				<p className="mx-auto text-3xl py-6">Top HN stories sorted by votes</p>
				<div className="flex flex-col mx-auto">
					{msg}
				</div>
			</div>
		)
	}
}
export default App;
