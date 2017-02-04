class Advertise {
	constructor(ad) {
		if (!ad) {
			throw new Error('You need to specify an ad object');
		}

		this.ad = ad;
	}

	getMessengerButtonTemplate() {
		return {
			"template_type": "button",
			"text": this.ad.cta_long,
			"buttons": [
				{
					"type": "web_url",
					"url": this.ad.url,
					"title": this.ad.cta_mini
				}
			]
		}
	}

	getMessengerGenericTemplate() {
		return {
			"template_type": "generic",
			"elements": [
				{
					"title": this.ad.cta_long,
					"image_url": this.ad.media.url.large,
					"subtitle": this.ad.cta_mini,
					"default_action": {
						"type": "web_url",
						"url": this.ad.url,
						"messenger_extensions": true
					},
					"buttons": [
						{
							"type": "web_url",
							"url": this.ad.url,
							"title": this.ad.cta_mini
						}
					]
				}
			]
		}
	}

	getRawData() {
		return this.ad;
	}
}

export default Advertise;