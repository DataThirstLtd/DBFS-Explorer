<template>
  <div id="command-bar" small>
    <div class="wrapper">
      <div v-for="item in actions"
        :key="item.id">
        <a @click="onClickDummy">
          <v-icon class="command" small>{{ item.icon }}</v-icon>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'command-bar',
  data () {
    return {
      actions: [
        { id: 'id-app-download', text: 'About', icon: 'fa-download', callback: () => {}, platforms: ['darwin', 'win32', 'linux'] }
      ]
    }
  },
  methods: {
    onClickDummy: function () {
    }
  }
}
</script>

