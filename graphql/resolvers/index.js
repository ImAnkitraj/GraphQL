const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookinResolver = require('./bookings')

const rootResolver = {
    ...authResolver,
    ...eventsResolver,
    ...bookinResolver,
}

module.exports = rootResolver;