/**
 * config for requireJs
 */
var require = {
    baseUrl: './',
    paths: {
        'app': 'app',
        'lib': 'lib',
        'handlebars': 'lib/handlebars-v1.3.0',
        'psd.parser': 'lib/psd.parser.min',
        'templates': 'templates',
        'template': 'templates/template',
        'text': 'lib/require/text'
    },
    shim: {
        'handlebars': {
            exports: 'Handlebars'
        },
        'psd.parser': {
            exports: 'PSD'
        }
    }
};