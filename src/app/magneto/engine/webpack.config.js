module.exports = {
    mode: 'production',
    entry: {
        engine: `${__dirname}/../../../../out-tsc/magneto/engine/engine.js`,
        jackett: `${__dirname}/../../../../out-tsc/magneto/engine/jackett.js`,
    },
    output: {
        libraryTarget: 'system',
        path: `${__dirname}/../../../../out-tsc/magneto/dist/engine`,
        filename: "[name].js"
    }
}