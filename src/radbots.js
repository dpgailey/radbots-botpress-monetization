import axios from 'axios';

class Radbots {
	constructor(bp, config) {
		if (!bp || !config) {
			throw new Error('You need to specify botpress and config');
		}
		this.setConfig(config);
	}

	setConfig(config) {
		this.config = Object.assign({}, this.config, config);
	}

	getConfig() {
		return this.config;
	}

	getAdvertise() {
		let url = `https://radbots.com/api/ads`;

		return axios.get(url, {
			params: {
				agent_key: this.config.agentKey || '',
				media_type: this.config.mediaType || '',
				context: this.config.context || '',
				persona_id: this.config.personaId || '',
				tags: this.config.tags || '',
				intent: this.config.intent || '',
			}
		})
			.then(res => this._handleSuccessResponse(res))
			.catch(err => this._handleErrorResponse(err));
	}

	_handleSuccessResponse(res) {
		return res.data;
	}

	_handleErrorResponse(err) {
		if (err.response) {
			throw new Error(`Error from radbots module: ${err.response.data}`);
		} else if (err.message) {
			throw new Error(`Error from radbots module: ${err.message}`);
		} else {
			throw new Error(`Error from radbots module: ${err}`)
		}
	}
}

export default Radbots;