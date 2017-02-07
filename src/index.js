import path from 'path';
import fs from 'fs';
import Monetize from './monetize';

const loadConfigFromFile = file => {
	if (!fs.existsSync(file)) {
		const config = {
			agentKey: '',
			accountKey: ''
		};
		saveConfigToFile(config, file)
	}

	return overwriteConfig(file)
};

const overwriteConfig = file => {
	return JSON.parse(fs.readFileSync(file));
};

const saveConfigToFile = (config, file) => {
	fs.writeFileSync(file, JSON.stringify(config));
};

let monetize = null;

const outgoingMiddleware = (event, next) => {
	return next()
};

module.exports = {
	init: function (bp) {
		bp.middlewares.register({
			name: 'monetize.sendAdvertise',
			type: 'outgoing',
			order: 100,
			handler: outgoingMiddleware,
			module: 'botpress-monetize',
			description: 'Sends out advertise from RadBots api'
		});

		bp.monetize = {};
	},
	ready: function (bp) {
		const file = path.join(bp.projectLocation, bp.botfile.modulesConfigDir, 'botpress-monetize.json')
		const config = loadConfigFromFile(file);

		monetize = new Monetize(bp, config);

		bp.monetize = monetize;

		bp.getRouter('botpress-monetize')
			.get('/config', (req, res) => {
				res.send(monetize.getConfig());
			});

		bp.getRouter('botpress-monetize')
			.post('/config', (req, res) => {
				monetize.setConfig(req.body);
				saveConfigToFile(monetize.getConfig(), file);
				res.sendStatus(200);
			});
	}
};
