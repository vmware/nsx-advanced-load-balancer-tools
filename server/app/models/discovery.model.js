const mongoose = require('mongoose');

const discoverySchema = mongoose.Schema({
    downloadLink: String,
    pools: {
        total: Number,
        enabledCount: Number,
        deactivatedCount: Number
    },
    iRules: {
        total: Number,
        conversionRate: Number
    },
    tenants: {
        total: Number
    },
    traffic: {
        request: Number,
        bytes: Number,
        maxConnections: Number
    },
    unsupported: {
        total: Number
    },
    virtualServices: {
        total: Number,
        types: {
            L4: Number,
            L7: Number,
            DNS: Number,
            UDP: Number,
            SSL: Number,
            WAF: Number
        },
        enabledCount: Number,
        deactivatedCount: Number
    }
});

module.exports = mongoose.model('DiscoveryModel', discoverySchema);
