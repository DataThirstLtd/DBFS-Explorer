const platform = require('os').platform

export default {
  init: function (context) {
    // Set current running platform
    context.commit('setPlatform', platform())
  }
}
