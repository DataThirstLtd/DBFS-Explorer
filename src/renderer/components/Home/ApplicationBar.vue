<template>
  <div id="application-bar" flat>
    <v-layout align-center row
      fill-height class="wrapper">
      <v-btn v-for="item in buttons.left" small
        :key="item.id" @click="item.callback"
        icon light class="drag-safe btn">
        <v-icon small>{{ item.icon }}</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn v-for="item in buttons.right" small
        :key="item.id" @click="item.callback"
        icon light class="drag-safe btn">
        <v-icon small>{{ item.icon }}</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'application-bar',
  data () {
    return {
      buttons: {
        left: [
          { id: 'id-app-connect', text: 'Connect', icon: 'fa-cloud', callback: this.connect },
          { id: 'id-app-download', text: 'Download', icon: 'fa-download', callback: () => {} },
          { id: 'id-app-delete', text: 'Delete', icon: 'fa-trash', callback: () => {} }
        ],
        right: [
          { id: 'id-app-about', text: 'About', icon: 'fa-star', callback: () => {} }
        ]
      }
    }
  },
  methods: {
    connect: function () {
      console.log('on Click Connect')
    }
  }
}
</script>
