<template>
    <div
        class="wrapper px-4 py-3 z-50 text-white bg-container-border m-4 text-sm shadow-2xl"
        :show="show"
    >
        <p>
            {{ title }}
        </p>
        <p class="my-2">
            {{ message }}
        </p>
        <div class="flex items-center">
            <div class="flex-grow" />
            <button
                class="bg-white rounded-sm px-4 py-1 text-black"
                @click="onClickOK"
            >
                OK
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            title: '',
            message: '',
            type: '',
            show: false
        }
    },
    computed: {
        onChangeShow () {
            return this.show
        }
    },
    watch: {
         onChangeShow (state) {
            if (!state) {
                // Clean up states
                this.title = ''
                this.message = ''
                this.type = ''
            }
        }
    },
    mounted () {
        this.$root.$on('in-app-notify/error', ({ title, message }) => {
            this.title = title
            this.message = message
            this.type = 'error'
            this.show = true
        })
    },
    methods: {
        onClickOK () {
            this.show = false
        }
    }
}
</script>

<style scoped>
    .wrapper {
        position: fixed;
        right: 0;
        bottom: 0;
        width: 300px;
        min-height: 100px;
        display: none;
    }

    .wrapper[show] {
        display: block;
        animation: slide-from-right 0.2s ease-in-out;
    }

    @keyframes slide-from-right {
        0% {
            opacity: 0;
            transform: translateX(100%);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }
</style>
