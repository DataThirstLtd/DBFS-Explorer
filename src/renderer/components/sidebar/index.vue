<template>
  <div id="sidebar" class="bg-container text-white text-sm">
    <button class="w-full h-4 px-3 my-1 hover:bg-hover-one">
      <div class="flex h-full items-center">
        <icon
          :width="14"
          :height="14"
          fill="#ffffff"
          name="folder"
        />
        <p class="ml-2">root</p>
      </div>
    </button>
  </div>
</template>

<script>
import Icon from '@/components/icon'

export default {
  components: {
    Icon
  },
  data () {
    return {
      treeData: [
        { name: 'hello' },
        { name: 'wat' },
        {
          name: 'child folder',
          children: [
            {
              name: 'child folder',
              children: [
                { name: 'hello' },
                { name: 'wat' }
              ]
            },
            { name: 'hello' },
            { name: 'wat' },
            {
              name: 'child folder',
              children: [
                { name: 'hello' },
                { name: 'wat' }
              ]
            }
          ]
        }
      ]
    }
  }
}
</script>
