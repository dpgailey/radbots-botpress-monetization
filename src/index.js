import path from 'path';
import fs from 'fs';
import Radbots from './radbots';

const loadConfigFromFile = file => {
		if (!fs.existsSync(file)) {
				const config = {
						agentKey: '',
						mediaType : '',
						context : '',
						personaId : '',
						tags: '',
						intent: ''
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

let radbots = null;

const outgoingMiddleware = (event, next) => {
		return next()
};

module.exports = {
		init: function(bp) {
				bp.middlewares.register({
						name: 'radbots.sendAdvertise',
						type: 'outgoing',
						order: 100,
						handler: outgoingMiddleware,
						module: 'botpress-radbots',
						description: 'Sends out advertise from radbots api'
				});

				bp.radbots = {};
		},
		ready: function(bp) {
				const file = path.join(bp.projectLocation, bp.botfile.modulesConfigDir, 'botpress-radbots.json')
				const config = loadConfigFromFile(file);

				radbots = new Radbots(bp, config);

				bp.radbots = radbots;

				bp.getRouter('botpress-radbots')
						.get('/config', (req, res) => {
								res.send(radbots.getConfig());
						});

				bp.getRouter('botpress-radbots')
						.post('/config', (req, res) => {
								radbots.setConfig(req.body);
								saveConfigToFile(radbots.getConfig(), file);
								res.sendStatus(200);
						});
		}
};
