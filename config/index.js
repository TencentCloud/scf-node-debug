module.exports = process.env === 'production'
    ? require('./config.production')
    : require('./config.development')