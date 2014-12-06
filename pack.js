var SEP = '|';

module.exports = function pack (namespace, payload) {
  return namespace + SEP + payload;
};

module.exports.unpack = function unpack (raw) {
  var parts = raw.split(SEP);
  var namespace = parts.shift();
  var payload = parts.join(SEP);
  return [namespace, payload];
};
