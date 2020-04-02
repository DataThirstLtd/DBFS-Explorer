/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */

module.exports = {
  mode: 'spa', // or 'universal'
  head: {
    title: 'dbfs_explorer'
  },
  loading: false,
  plugins: [
    { ssr: true, src: '@/plugins/icons.js' }

  ],
  buildModules: [

  ],
  modules: [
    '@nuxtjs/vuetify'
  ],
  vuetify: {
    defaultAssets: {
      icons: 'md'
    },
    theme: {
      themes: {
        light: {
          primary: '#ED5E38',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          error: '#b71c1c'
        },
        dark: {
          primary: '#ED5E38'
        }
      }
    }
  }
}
