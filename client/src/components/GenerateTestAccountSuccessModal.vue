<template>
  <v-dialog :value="isOpen" scrollable width="600px" @input="handleClose">
    <v-card>
      <v-card-title class="headline primary white--text">
        Test Account
      </v-card-title>
      <v-card-text
        class="d-flex flex-column text-left mt-2"
        style="max-height: 600px;"
      >
        <h4>Web</h4>
        <a :href="account.web">{{ account.web }}</a>
        <v-divider class="my-2"></v-divider>
        <h4>E-mail</h4>
        <p>{{ account.user }}</p>
        <v-divider class="my-2"></v-divider>
        <h4>Password</h4>
        <p>{{ account.pass }}</p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray" text @click="handleClose">Close</v-btn>
        <v-btn color="primary" text @click="handleChoose">Choose</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IAccount } from '../types';

@Component
export default class GenerateTestAccountSuccessModal extends Vue {
  @Prop({ required: true })
  isOpen!: boolean;

  @Prop({ required: true, default: () => ({}) })
  account!: IAccount;

  handleClose(): void {
    this.$emit('update:is-open', false);
  }

  handleChoose(): void {
    this.$emit('choose');
  }
}
</script>
