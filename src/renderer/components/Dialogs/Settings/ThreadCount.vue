<template>
  <v-list-tile-content>
    <v-list-tile-title
      style="font-size: 14px;">
      {{ item.text }}
    </v-list-tile-title>
    <v-list-tile-sub-title>
      <v-layout row
        style="width: 100%;">
        <v-slider
          v-model="value"
          :tick-labels="options"
          :max="3"
          step="1"
          ticks="always"
          tick-size="2"
          style="width: 100%; padding: 0 10px;" />
        <v-spacer />
      </v-layout>
    </v-list-tile-sub-title>
  </v-list-tile-content>
</template>

<script>
export default {
  name: 'thread-count',
  props: {
    item: {
      type: Object,
      required: true
    },
    settings: {
      type: Array,
      required: true
    },
    onUpdateField: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      options: [
        1,
        2,
        4,
        8
      ],
      value: -1
    }
  },
  computed: {
    onValueChange: function () {
      return this.value
    }
  },
  watch: {
    onValueChange: function (index) {
      this.onUpdateField({
        key: this.item.key,
        value: this.options[index]
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init: function () {
      if (this.settings && this.settings.constructor === [].constructor) {
        const cIndex = this.settings.findIndex(x => x.key === this.item.key)
        if (cIndex > -1) {
          this.value = this.getIndexFromValue(cIndex)
        }
      }
    },
    getIndexFromValue: function (cIndex) {
      if (this.options && this.options.constructor === [].constructor) {
        const oIndex = this.options.findIndex(
          x => x === parseInt(this.settings[cIndex].value)
        )
        return oIndex
      }
      return null
    }
  }
}
</script>

