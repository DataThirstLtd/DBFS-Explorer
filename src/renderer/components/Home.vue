<template>
  <div id="wrapper">
    <sidebar />
    <main-content />
  </div>
</template>

<script>
  /**
   * Import Home component dependencies from './Home'
   */
  import Sidebar from './Layouts/Sidebar'
  import MainContent from './Layouts/MainContent'

  export default {
    name: 'home',
    components: {
      Sidebar,
      MainContent
    }
  }
</script>
