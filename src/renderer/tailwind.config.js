/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {
    extend: {
      width: {
        'auth-box': '32rem'
      },
      colors: {
        'app-background': '#1E2128',
        'container': '#262A33',
        'container-border': '#36393E',
        'accent-one': '#272D36',
        'accent-two': '#535353',
        'hover-one': '#282828',
        'label-one': '#a1a1a1',
        'primary': '#ff5224'
      }
    }
  },
  variants: {},
  plugins: []
}
