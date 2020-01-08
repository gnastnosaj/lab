const path = require('path');
const systemjsInterop = require("systemjs-webpack-interop");

module.exports = systemjsInterop.modifyWebpackConfig({
    entry: {
        engine: ['./engine/engine.js'],
        btdb: ['./engine/btdb.js'],
        btdig: ['./engine/btdig.js'],
        aiaicili: ['./engine/aiaicili.js'],
        feiji: ['./engine/feiji.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist', 'engine'),
        filename: '[name].js'
    }
});