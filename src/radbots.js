class Radbots {
		constructor(bp, config) {
				if (!bp || !config) {
						throw new Error('You need to specify botpress and config');
				}
				this.setConfig(config);
		}

		setConfig(config) {
				this.config = Object.assign({}, this.config, config)
		}

		getConfig() {
				return this.config
		}
}

export default Radbots;