var pack = require('./pack');

module.exports = function muxClient (client) {
  var handlersByNamespace = {};

  client.on('message', function (raw) {
    var parts = pack.unpack(raw);
    var handlers = handlersByNamespace[parts[0]];
    if (!handlers) { return; }

    handlers.forEach(function (h) { h(parts[1]); });
  });

  return {
    namespace: function (n, setup) {
      var handlers = handlersByNamespace[n];
      if (!handlers) {
        handlers = handlersByNamespace[n] = [];
      }

      var funcs = {
        send: function (payload) {
          client.send(pack(n, payload));
        },

        on: function (t, handler) {
          if (t === 'message') { return handlers.push(handler); }

          // all other events are treated normally, without namespacing
          client.on(t, handler);
        }
      };

      if (setup) { setup(funcs); }
      return funcs;
    }
  };
};
