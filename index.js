var Connection = require('./lib/connection');
var StaticPool = require('./lib/staticPool');
var DynamicPool = require('./lib/dynamicPool');

module.exports = {
    Connection: Connection,
    StaticPool: StaticPool,
    DynamicPool: DynamicPool
}