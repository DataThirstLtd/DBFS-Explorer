export default {
  updateRootFs: function (context, data) {
    if (
      data && data.constructor === [].constructor
    ) {
      const rootFs = Object.assign([], data)
      data.forEach((item, index) => {
        if (item && item.constructor === {}.constructor && 'path' in item) {
          rootFs[index]['name'] = item.path.split('/')[1] || item.path
        }
      })
      context.commit('setRootFs', rootFs)
    }
  }
}
