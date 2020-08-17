<template>
  <v-container class="d-flex align-center justify-center">
    <v-card min-width="480" max-width="640" outlined>
      <h3 class="primary white--text text-left px-4 py-2">
        Login Form
      </h3>
      <v-form v-model="valid" class="pa-4">
        <v-radio-group v-model="server" row>
          <v-radio
            v-for="item in serverList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></v-radio>
        </v-radio-group>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          :counter="99"
          label="E-mail"
          required
        ></v-text-field>

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :counter="99"
          label="Password"
          :type="isShowPassword ? 'text' : 'password'"
          required
          @click:append="isShowPassword = !isShowPassword"
        ></v-text-field>

        <v-btn
          large
          color="primary"
          class="mt-6"
          :disabled="!valid"
          @click="handleVerify"
          >Verify</v-btn
        >

        <div class="d-flex align-center justify-center" style="height: 25px;">
          <v-btn
            v-if="server === 'ethereal'"
            color="primary"
            text
            @click="handleGenerateTestAccount"
            >Generate Test Account</v-btn
          >
        </div>
      </v-form>
    </v-card>
    <generate-test-account-success-modal
      :is-open.sync="isOpenGenerateTestAccountSuccess"
      :account="testAccount"
      @choose="handleChoose"
    />
    <error-modal :is-open.sync="hasError" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RestService from '../services/RestService';
import GenerateTestAccountSuccessModal from '../components/GenerateTestAccountSuccessModal.vue';
import ErrorModal from '../components/ErrorModal.vue';
import { isRequired, isEmail } from '../helpers/validate';
import webStorage from '../helpers/webStorage';
import { namespace } from 'vuex-class';

import { IAccount } from '../types';

const user = namespace('user');
const restService = new RestService();

@Component({
  components: {
    GenerateTestAccountSuccessModal,
    ErrorModal,
  },
})
export default class Login extends Vue {
  valid = false;
  email = '';
  emailRules = [
    isRequired('E-mail'),
    isEmail('E-mail', { isNormalEmail: true }),
  ];
  password = '';
  passwordRules = [isRequired('Password')];
  isShowPassword = false;
  isOpenGenerateTestAccountSuccess = false;
  testAccount: IAccount = {
    server: '',
    web: '',
    user: '',
    pass: '',
  };

  server = 'ethereal';
  serverList = [
    {
      value: 'ethereal',
      label: 'Ethereal',
    },
    {
      value: 'gmail',
      label: 'Gmail',
    },
  ];

  hasError = false;

  @user.Mutation
  public setAccount!: (account: IAccount) => void;

  async handleVerify(): Promise<void> {
    try {
      const data = {
        server: this.server,
        user: this.email,
        pass: this.password,
      };

      await restService.post({
        url: 'mail/verify-account',
        data,
      });
      webStorage.set('tk', data);
      this.$router.push('/create-mail');
    } catch (error) {
      this.hasError = true;
    }
  }

  async handleGenerateTestAccount(): Promise<void> {
    try {
      const response = await restService.post({
        url: 'mail/generate-test-account',
      });
      this.testAccount = response.data;
      this.isOpenGenerateTestAccountSuccess = true;
    } catch (error) {
      this.hasError = true;
      this.isOpenGenerateTestAccountSuccess = false;
    }
  }

  handleChoose(): void {
    this.email = this.testAccount.user;
    this.password = this.testAccount.pass;
    this.isOpenGenerateTestAccountSuccess = false;

    this.setAccount({
      ...this.testAccount,
      server: this.server,
    });
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
</style>
