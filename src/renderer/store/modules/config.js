const state = {
  platform: null
}

const mutations = {
  SET_CONFIG (state, config) {
    if (config && config.constructor === [].constructor) {
      config.forEach((configItem) => {
        if (validate(configItem)) {
          console.log('here', config)
          state[configItem.name] = configItem.data
        }
      })
    }
  }
}

const actions = {
  setConfig ({ commit }, config) {
    // do something async
    commit('SET_CONFIG', config)
  }
}

function validate (configItem) {
  if ('name' in configItem && configItem.name in state) {
    return true
  }
  return false
}

export default {
  state,
  mutations,
  actions
}
