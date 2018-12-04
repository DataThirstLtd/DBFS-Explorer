const state = {
  platform: null,
  dialog: {
    auth: {
      status: true
    }
  }
}

const mutations = {
  SET_CONFIG (state, config) {
    if (config && config.constructor === [].constructor) {
      config.forEach((configItem) => {
        if (validate(configItem)) {
          state[configItem.name] = configItem.data
        }
      })
    }
  },
  SET_STATE (state, config) {
    if (validate(config)) {
      switch (config.name) {
        case 'auth':
          state.dialog.auth.status = (
            'data' in config &&
            typeof config.data === 'boolean'
          ) ? config.data
            : 0
          break
        default: break
      }
    }
  }
}

const actions = {
  setConfig ({ commit }, config) {
    commit('SET_CONFIG', config)
  },
  setState ({ commit }, config) {
    commit('SET_STATE', config)
  }
}

function validate (configItem) {
  if ('name' in configItem && configItem.name) {
    return true
  }
  return false
}

export default {
  state,
  mutations,
  actions
}
