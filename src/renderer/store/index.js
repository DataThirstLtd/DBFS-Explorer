
function getDefaultAppStates () {
  return {
    provider: 'AWS',
    credentials: {
      domain: 'westeurope',
      bearerToken: ''
    }
  }
}

export const state = () => ({
  app: { ...getDefaultAppStates() }
})
