<template>
  <div id="wrapper">
    <application-bar />
    <sidebar />
    <main-content />
    <auth />
    <info-snackbar />
  </div>
</template>

<script>
  /**
   * Import Home component dependencies from './Home'
   */
  import ApplicationBar from './Home/ApplicationBar'
  import Sidebar from './Home/Sidebar'
  import MainContent from './Home/MainContent'
  import Auth from './Home/Auth'
  import InfoSnackbar from './Home/InfoSnackbar'

  export default {
    name: 'home',
    components: {
      ApplicationBar,
      Sidebar,
      MainContent,
      Auth,
      InfoSnackbar
    }
  }
</script>
