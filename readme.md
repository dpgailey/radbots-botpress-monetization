# botpress-monetize (powered by RadBots)

Monetization plugin for [Botpress](http://github.com/botpress/botpress) (powered by [RadBots](https://radbots.com))

## Installation
Monetize module can be installed using any of the following way:
### Installing using the CLI
From CLI, `cd` to the botpress root directory and run:
``` 
botpress install monetize
```
### Installing using Botpress UI

From the botpress UI, you will see a module named **Monetize**. Click the **install** button.

## Get started

To get started, you need to fill the **Configure RadBots** section directly in the module interface **RadBots**.

<img src="/assets/configure_section.png" alt="Configure RadBots" width="500px" />

Settings can also be set pragmatically by providing the settings in the `${modules_config_dir}/botpress-monetize.json`

### Getting configuration information
1. Go to https://radbots.com
2. Create an account / Login if you already have an account
3. Create an agent (Agent type is **web**)
4. You will get an **agent key**
5. Use the **agent key** in the configuration section of RadBots
6. Navigate to **settings** at the RadBots website
7. In the **general** tab, we will get the **account key**
8. Use the **account key** in the configuration section of RadBots

## Usage

### Getting advertise from RadBots

Here we are listening for `get-advertise` key. when we hear that, we call the RadBots api to get an advertise.
```
bp.hear('get-advertise', event => {
	bp.monetize.getAdvertise().then(ad => {
	    // ad is instance of Advertise class 
	});
});
```
### Getting customized advertise from RadBots

Here we are listening for `get-custom-advertise` key. when we hear that, we call the RadBots api to get an advertise and pass some options to customize the advertise or adding meta values to the advertise you are receiving.
```
bp.hear('get-custom-advertise', event => {
	bp.monetize.getAdvertise({
	    mediaType: <mediaType>,
	    context: <context>,
	    personaId: <personaId>,
	    tags: <tags>,
	    intent: <intent>
	}).then(ad => {
	    // ad is instance of Advertise class 
	});
});
```
[Learn more about this options at RadBots](https://radbots.com/documentation/developers)
### Sending advertise
#### As Button Template for messenger

[What is button template?](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template)

After installing the messenger module of Botpress, here we are listening for `get-advertise-as-button-template` key. After getting the advertise, we call `getMessengerButtonTemplate()` method and send it using `sendTemplate()` method of the messenger module.  
```
bp.hear('get-advertise-as-button-template', event => {
	bp.monetize.getAdvertise().then(ad => {
	    bp.messenger.sendTemplate(event.user.id, ad.getMessengerButtonTemplate());
	});
});
```


#### As Generic Template for messenger

[What is generic template?](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template)

After installing the messenger module of Botpress, here we are listening for `get-advertise-as-generic-template` key. After getting the advertise, we call `getMessengerGenericTemplate()` method and send it using `sendTemplate()` method of the messenger module.  
```
bp.hear('get-advertise-as-generic-template', event => {
	bp.monetize.getAdvertise().then(ad => {
	    bp.messenger.sendTemplate(event.user.id, ad.getMessengerGenericTemplate());
	});
});
```

#### As text message to messenger
After installing the messenger module of Botpress, here we are listening for `get-advertise-as-text` key. After getting the advertise, we call `getRawData()` method which will return raw values that we received from RadBots and send it using `sendText()` method of the messenger module.  
```
bp.hear('get-advertise-as-text', event => {
	bp.monetize.getAdvertise().then(ad => {
	    bp.messenger.sendText(event.user.id, ad.getRawData().cta_long); // This is the "Call-to-action" typically a more in-depth "about" regarding the ad.
	    bp.messenger.sendText(event.user.id, ad.getRawData().cta_mini); // This is the "Call-to-action" mini, which is a short title for the CTA
	    bp.messenger.sendText(event.user.id, ad.getRawData().url); // This is the location where you'll send people when they click the ad.
	});
});
```
**Note:** Make sure to whitelist `www.radbots.com` from the messenger module, otherwise url won't be sent to messenger

#### As image to messenger
After installing the messenger module of Botpress, here we are listening for `get-advertise-as-image` key. After getting the advertise, we call `getRawData()` method which will return raw values that we received from RadBots and send it using `sendAttachment()` method of the messenger module.  
```
bp.hear('get-advertise-as-image', event => {
	bp.monetize.getAdvertise().then(ad => {
	    bp.messenger.sendAttachment(event.user.id, 'image', ad.getRawData().media.url.large);  // large image
	    bp.messenger.sendAttachment(event.user.id, 'image', ad.getRawData().media.url.medium); // medium image
	    bp.messenger.sendAttachment(event.user.id, 'image', ad.getRawData().media.url.thumb);  // thumbnail image
	});
});
```
**Note:** Make sure to whitelist `www.radbots.com` from the messenger module, otherwise image url won't be sent to messenger

## API

### bp.monetize.getAdvertise()
returns an `promise` which receives an `Advertise` object on success response.
```
bp.monetize.getAdvertise().then(ad => {
    // ad is instance of Advertise class
});
```
### Params of bp.monetize.getAdvertise()
An optional object can be passed to `getAdvertise()` method to customize the advertise or adding meta values to the advertise. The object can have these keys:
```
{
    mediaType: <mediaType>,
    context: <context>,
    personaId: <personaId>,
    tags: <tags>,
    intent: <intent>
}
```
[Learn more about this options at RadBots](https://radbots.com/documentation/developers)
### Advertise Object
#### ad.getMessengerButtonTemplate()
returns a button template that can be used for sending button template to messenger. ([more](https://developers.facebook.com/docs/messenger-platform/send-api-reference/button-template))
#### ad.getMessengerGenericTemplate()
returns a generic template that can be used for sending generic template to messenger. ([more](https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template))
#### ad.getRawData()
returns an object that was received from RadBots api, this raw object provides you the facility to send custom message.
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
