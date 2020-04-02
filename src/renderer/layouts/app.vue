<template>
  <v-app class="app">
    <div class="drag-bar" />
    <div class="sidebar grey lighten-4">
      <div style="height: 22px;" />
      <div
        class="mx-auto"
        style="display: block; width: 48px;"
      >
        <template v-for="(item, i) in 4">
          <div :key="`app-sidebar-list-index-${i}`">
            <v-avatar
              class="my-2 grey lighten-2"
              style="cursor: pointer;"
            >
              <span
                class="caption font-weight-bold black--text"
              >
                W E
              </span>
            </v-avatar>
          </div>
        </template>
        <v-avatar
          :key="`app-sidebar-list-index-${i}`"
          class="my-2 grey lighten-2"
          style="cursor: pointer;"
        >
          <v-icon>
            add
          </v-icon>
        </v-avatar>
      </div>
    </div>
    <div class="content">
      <nuxt />
    </div>
  </v-app>
</template>

<style lang="scss">
  @import '@/assets/styles.scss';

  .app {
    $sidebarWidth: 64px;
    $navbarHeight: 48px;

    & .sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      width: $sidebarWidth;
    }

    & .content {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: $sidebarWidth;
    }

    & .navbar {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: $navbarHeight;
    }

    & .nav-content {
      position: absolute;
      top: $navbarHeight;
      right: 0;
      left: 0;
      bottom: 0;
      overflow-y: auto;
    }
  }
</style>
