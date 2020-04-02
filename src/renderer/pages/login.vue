<template>
  <div>
    <div class="drag-bar">
      <p class="pa-0 ma-0 caption text-center">
        Login into Databricks
      </p>
    </div>
    <div
      class="ma-4"
      style="position: fixed; top: 0; right: 0;"
    >
      <v-btn fab depressed small>
        <v-icon>more_horiz</v-icon>
      </v-btn>
    </div>
    <img
      src="@/assets/logo-hero.svg"
      width="auto"
      height="80"
    >
    <v-card
      flat
      outlined
      width="480"
    >
      <v-card-title>
        <p class="ma-0 pa-0 my-auto">Login</p>
      </v-card-title>
      <v-card-text>
        <v-radio-group
          v-model="provider"
          row
          dense
          class="pa-0 ma-0 my-2"
        >
          <v-radio label="AWS" value="provider-aws" />
          <v-radio label="Azure" value="provider-azure" />
        </v-radio-group>
        <v-form
          ref="loginFrom"
          class="my-3"
          lazy-validation
        >
          <div class="d-flex">
            <p
              class="body-1 black--text my-auto ma-0 pa-0 mr-2"
            >
              https://
            </p>
            <v-text-field
              class="my-1"
              label="Enter domain name"
              type="text"
              hide-details
              solo-inverted
              flat
            />
            <p
              class="body-1 black--text my-auto ma-0 pa-0 ml-2"
            >
              .azuredatabricks.net
            </p>
          </div>
          <v-text-field
            class="my-1"
            label="Enter bearer token"
            type="password"
            hide-details
            solo-inverted
            flat
          />
        </v-form>
        <v-btn
          color="primary"
          large
          block
          depressed
          @click="onClickContinue"
        >
          Continue
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data () {
    return {
      provider: 'provider-aws'
    }
  },
  methods: {
    onClickContinue () {
      this.$router.replace({
        path: '/home'
      })
    }
  }
}
</script>
