<template>
  <div>
    <v-layout row wrap>
      <div v-if="item.is_dir"
        class="item-wrapper"
        @click="onClickItem">
        <v-icon class="icon" large>
          fa-folder
        </v-icon>
        <p class="name">
          {{ item.path.split('/').pop() || item.path }}
        </p>
      </div>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'populate',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    onClickItem: function () {
      console.log(this.item)
    }
  }
}
</script>

<style scoped>
  .item-wrapper {
    width: 100px;
    height: auto;
    margin: 10px;
    cursor: pointer;
  }
  .item-wrapper > .icon {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 0;
  }
  .item-wrapper > .name {
    text-align: center;
  }
</style>
