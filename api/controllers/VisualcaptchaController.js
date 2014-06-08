/**
 * VisualcaptchaController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
	start: function(req, res) {
        // After initializing visualCaptcha, we only need to generate new options
        visualCaptcha = require('visualcaptcha')(req.session, req.query.namespace);
        visualCaptcha.generate(req.params.howmany);

        // We have to send the frontend data to use on POST.
        res.send(200, visualCaptcha.getFrontendData());
    },

    try: function(req, res) {
        var namespace = req.query.namespace,
            frontendData,
            queryParams = [],
            imageAnswer,
            audioAnswer,
            responseStatus,
            responseObject;

        frontendData = visualCaptcha.getFrontendData();

        // Add namespace to query params, if present
        if (namespace && namespace.length !== 0) {
            queryParams.push('namespace=' + namespace);
        }

        // It's not impossible this method is called before visualCaptcha is initialized, so we have to send a 404
        if (typeof frontendData === 'undefined') {
            queryParams.push('status=noCaptcha');

            responseStatus = 404;
            responseObject = 'Not Found';
        } else {
            // If an image field name was submitted, try to validate it
            if (( imageAnswer = req.body[ frontendData.imageFieldName ] )) {
                if (visualCaptcha.validateImage(imageAnswer)) {
                    queryParams.push('status=validImage');

                    responseStatus = 200;
                } else {
                    queryParams.push('status=failedImage');

                    responseStatus = 403;
                }
            } else if (( audioAnswer = req.body[ frontendData.audioFieldName ] )) {
                // We set lowercase to allow case-insensitivity, but it's actually optional
                if (visualCaptcha.validateAudio(audioAnswer.toLowerCase())) {
                    queryParams.push('status=validAudio');

                    responseStatus = 200;
                } else {
                    queryParams.push('status=failedAudio');

                    responseStatus = 403;
                }
            } else {
                queryParams.push('status=failedPost');

                responseStatus = 500;
            }
        }

        if (req.accepts('html') !== undefined) {
            res.header('Location', '/?' + queryParams.join('&'));
            res.send(302);
        } else {
            res.send(responseStatus);
        }
    },

    audio: function(req, res) {
        // Default file type is mp3, but we need to support ogg as well
        if (req.params.type !== 'ogg') {
            req.params.type = 'mp3';
        }

        visualCaptcha.streamAudio(res, req.params.type);
    },

    image: function(req, res) {
        var isRetina = false;

        // Default is non-retina
        if (req.query.retina) {
            isRetina = true;
        }

        visualCaptcha.streamImage(req.params.id, res, isRetina);
    }
};

