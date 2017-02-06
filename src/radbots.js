import axios from 'axios';
import Advertise from './advertise';

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

	getAdvertise(options = {}) {
		let url = `https://radbots.com/api/ads`;

		return axios.get(url, {
			params: {
				agent_key: this.config.agentKey || '',
				media_type: options.mediaType || '',
				context: options.context || '',
				persona_id: options.personaId || '',
				tags: options.tags || '',
				intent: options.intent || '',
			}
		})
			.then(res => this._handleSuccessResponse(res))
			.catch(err => this._handleErrorResponse(err));
	}

	_handleSuccessResponse(res) {
		if (res.data.error) {
			return this._handleErrorResponse(res.data.error);
		}
		if (!res.data.ad) {
			return this._handleErrorResponse('No ad object found on the response.');
		}

		return new Advertise(res.data.ad);
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