<template>
  <div id="sidebar"
    :small="platform === 'darwin'">
    <div class="wrapper">
      <v-treeview
        v-model="tree"
        :items="rootFs"
        activatable
        item-key="name"
        open-on-click>
        <template slot="prepend" slot-scope="{ item, open, leaf }">
          <v-icon v-if="!item.file">
            {{ item.is_dir ? 'fa fa-folder' : null }}
          </v-icon>
        </template>
      </v-treeview>
      {{tree}}
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  data () {
    return {
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-json',
        md: 'mdi-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel'
      },
      rootFs: this.getRootFs(),
      tree: this.getRootFs()
    }
  },
  computed: mapState({
    platform: state => state.config.platform
  }),
  methods: {
    ...mapGetters(['getRootFs']),
    dummy () {
      console.log('hello')
    }
  }
}
</script>
