<template>
  <v-dialog
    v-model="dialog"
    width="500">
    <v-card>
      <v-card-title
        class="headline grey lighten-3">
        Confirm {{ transferType }} Files/Folders
      </v-card-title>
      <v-card-text>
        <v-list
          subheader
          two-line>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-checkbox v-model="notifications"></v-checkbox>
            </v-list-tile-action>

            <v-list-tile-content @click="notifications = !notifications">
              <v-list-tile-title>Notifications</v-list-tile-title>
              <v-list-tile-sub-title>Allow notifications</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          color="black"
          @click="dialog = false">
          Cancel
        </v-btn>
        <v-btn
          depressed
          color="primary">
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'list-data-transfer',
  data () {
    return {
      transferType: 'Downloading',
      dialog: true
    }
  }
}
</script>
