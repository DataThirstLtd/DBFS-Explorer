<template>
  <div>
    <div class="navbar">
      <div
        class="d-flex align-center px-2"
        style="height: 100%;"
      >
        <v-chip class="text-uppercase" outlined label>
          {{ provider }}
        </v-chip>
        <h3 class="title mx-2">
          {{ credentials && credentials.domain }}
        </h3>
        <v-spacer />
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              class="mx-1"
              depressed
              v-on="on"
            >
              <v-icon>
                {{ viewAs.selection || 'view_module' }}
              </v-icon>
              <v-icon right>
                keyboard_arrow_down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, i) in viewAs.menu"
              :key="`app-content-navbar-view_as-selectors-index-${i}`"
              @click="viewAs.selection = item.icon"
            >
              <v-list-item-avatar>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn icon class="mx-1">
          <v-icon>get_app</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="nav-content pa-2">
      <navigator
        :view-as="viewAs.selection"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Navigator from '@/components/nav/Navigator'

export default {
  layout: 'app',
  components: {
    Navigator
  },
  data () {
    return {
      viewAs: {
        selection: 'view_module',
        menu: [
          { label: 'View as grid', icon: 'view_module' },
          { label: 'View as list', icon: 'view_list' }
        ]
      }
    }
  },
  computed: mapState({
    provider: state => state.app.provider,
    credentials: state => state.app.credentials
  })
}
</script>
