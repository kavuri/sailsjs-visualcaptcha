sailsjs-visualcaptcha
=====================

Visual captcha in sailsjs

The sailsjs setup for visualcaptcha (http://visualcaptcha.net/) following the instructions provided here (https://github.com/emotionLoop/visualCaptcha-node)

Basically it involves creating the routes mentioned in the above link and setting the directory structures and configuration accordingly. 
* Create a controller (sails generate api Visualcaptcha). Delete the model generated
* Create the routes in api/controller/VisualcaptchaController.js
* Use your favourite frontend package to connect to the server

One change I had to do in the boiler plate code was to change 'index' to 'id' in the 'image' route (ref: https://github.com/emotionLoop/visualCaptcha-node/pull/2)
