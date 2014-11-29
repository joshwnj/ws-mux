var pack = require('./pack');

module.exports = function muxClient (client) {
  var handlersByNamespace = {};

  client.addEventListener('message', function (event) {
    var raw = event.data;
    var parts = pack.unpack(raw);
    var handlers = handlersByNamespace[parts[0]];
    if (!handlers) { return; }

    var payload = { data: parts[1] };
    handlers.forEach(function (h) { h(payload); });
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

        addEventListener: function (t, handler) {
          if (t === 'message') { return handlers.push(handler); }

          // all other events are treated normally, without namespacing
          client.addEventListener(t, handler);
        }
      };

      if (setup) { setup(funcs); }
      return funcs;
    }
  };
};
