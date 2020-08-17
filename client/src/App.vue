<template>
  <v-app id="app">
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-icon x-large>mdi-gmail</v-icon>
        <h2 class="ml-2">Mail Service</h2>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer>
      <v-spacer></v-spacer>
      <v-icon>mdi-calendar</v-icon>
      <div class="ml-2">{{ currentDate }}</div>
    </v-footer>
    <loading />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Loading from './components/Loading.vue';
import webStorage from './helpers/webStorage';

import { namespace } from 'vuex-class';
import { IAccount } from './types';

const user = namespace('user');

@Component({
  components: {
    Loading,
  },
})
export default class App extends Vue {
  get currentDate(): string {
    const date = new Date();
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/');
  }

  @user.Mutation
  public setAccount!: (account: IAccount) => void;

  checkLocalAccount(): void {
    const localAccount = webStorage.get('tk') as IAccount;
    if (localAccount?.user) {
      this.setAccount(localAccount);
    }
  }

  created(): void {
    this.checkLocalAccount();
  }
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Roboto';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
