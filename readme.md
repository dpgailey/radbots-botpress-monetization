# botpress-radbots

Official Radbots connector module for [Botpress](http://github.com/botpress/botpress).

## Installation
Radbots module can be installed using any of the following way:
### Installing using the CLI
From CLI, `cd` to the botpress root directory and run:
``` 
botpress install radbots
```
### Installing using Botpress UI

From the botpress UI, you will see a module named **radbots**. Click the **install** button.

## Get started

To get started, you need to fill the **Configure Radbots** section directly in the module interface **Radbots**. Note that, the **Agent Key** is a required field, other fields are optional.

<img src="/assets/configure_section.png" alt="Configure Redbots" width="500px" />

Settings can also be set programmatically by providing the settings in the `${modules_config_dir}/botpress-radbots.json`

### Getting configuration information
1. Go to https://radbots.com
2. Create an account / Login if you already have an account
3. Create an agent (Agent type is **web**)
4. You wiil get an **agent key**
5. Use the **agent key** in the configuration section of Radbots

## Usage

### Getting advertise from Radbots

Here we are listening for `get-advertise` key. when we hear that, we simple call the radbots api to get an advertise.
```
bp.hear('get-advertise', event => {
	bp.radbots.getAdvertise().then(ad => {
	    // ad is instance of Advertise class 
	});
});
```
### Sending advertise
#### Button Template for messenger

[What is button template?](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template)

After installing the messenger module of Botpress, here we are listening for `get-button-template-advertise` key. After getting the advertise, we call `getMessengerButtonTemplate()` method and send it using `sendTemplate()` method of the messenger module.  
```
bp.hear('get-button-template-advertise3', event => {
	bp.radbots.getAdvertise().then(ad => {
	    bp.messenger.sendTemplate(event.user.id, ad.getMessengerButtonTemplate());
	});
});
```


#### Generic Template for messenger

[What is generic template?](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template)

After installing the messenger module of Botpress, here we are listening for `get-generic-template-advertise` key. After getting the advertise, we call `getMessengerGenericTemplate()` method and send it using `sendTemplate()` method of the messenger module.  
```
bp.hear('get-generic-template-advertise', event => {
	bp.radbots.getAdvertise().then(ad => {
	    bp.messenger.sendTemplate(event.user.id, ad.getMessengerGenericTemplate());
	});
});
```

#### As text message to messenger
After installing the messenger module of Botpress, here we are listening for `get-text-advertise` key. After getting the advertise, we call `getRawData()` method which will return raw values that we received from radbots and send it using `sendText()` method of the messenger module.  
```
bp.hear('get-text-advertise', event => {
	bp.radbots.getAdvertise().then(ad => {
	    bp.messenger.sendText(event.user.id, ad.getRawData().cta_long);
	    bp.messenger.sendText(event.user.id, ad.getRawData().cta_mini);
	    bp.messenger.sendText(event.user.id, ad.getRawData().url);
	});
});
```
**Note:** Make sure to whitelist `www.radbots.com` from the messenger module, otherwise url won't be sent to messenger

#### As image to messenger
After installing the messenger module of Botpress, here we are listening for `get-image-advertise` key. After getting the advertise, we call `getRawData()` method which will return raw values that we received from radbots and send it using `sendAttachment()` method of the messenger module.  
```
bp.hear('get-image-advertise', event => {
	bp.radbots.getAdvertise().then(ad => {
	    bp.messenger.sendAttachment(event.user.id, 'image', ad.getRawData().media.url.large);
	    bp.messenger.sendAttachment(event.user.id, 'image', ad.getRawData().media.url.medium);
	    bp.messenger.sendAttachment(event.user.id, 'image', ad.getRawData().media.url.thumb);
	});
});
```
**Note:** Make sure to whitelist `www.radbots.com` from the messenger module, otherwise image url won't be sent to messenger

## API

### bp.radbots.getAdvertise()
returns an `promise` which receives an `Advertise` object on success response.
```
bp.radbots.getAdvertise().then(ad => {
    // ad is instance of Advertise class
});
```
### Advertise Object
#### ad.getMessengerButtonTemplate()
returns a button template that can be used for sending button template to messenger. ([more](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template))
#### ad.getMessengerGenericTemplate()
returns a generic template that can be used for sending generic template to messenger. ([more](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template))
#### ad.getRawData()
returns an object that was received from radbots api, this raw object provides you the facility to send custom message.
```
{
  cta_long: <STRING>,
  cta_mini: <STRING>,
  cta_url: <STRING>,
  media: {
    media_type: <STRING>,
    media_url: {
      medium: <STRING>,
      thumb: <STRING>
    }
  }
}
```
