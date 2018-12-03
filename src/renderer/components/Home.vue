<template>
  <div id="wrapper">
    <application-bar />
    <sidebar />
    <main-content />
  </div>
</template>

<script>
  /**
   * Import Home component dependencies from './Home'
   */
  import ApplicationBar from './Home/ApplicationBar'
  import Sidebar from './Home/Sidebar'
  import MainContent from './Home/MainContent'

  export default {
    name: 'home',
    components: {
      ApplicationBar,
      Sidebar,
      MainContent
    }
  }
</script>
