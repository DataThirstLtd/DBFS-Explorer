<template>
   <v-dialog
    v-model="dialog"
    width="500">
  </v-dialog>
</template>

<script>
export default {
  name: 'delete-selected',
  data () {
    return {
      dialog: false
    }
  },
  mounted () {
    const context = this
    this.$root.$on('onDeleteSelected', (selection) => {
      if (selection) {
        context.dialog = true
      }
    })
  }
}
</script>

