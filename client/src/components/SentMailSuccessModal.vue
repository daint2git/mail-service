<template>
  <v-dialog :value="isOpen" scrollable width="600px" @input="handleClose">
    <v-card>
      <v-card-title class="headline primary white--text">
        Mail Info
      </v-card-title>
      <v-card-text
        v-if="isExistMailDetail"
        class="d-flex flex-column text-left mt-2"
        style="max-height: 600px;"
      >
        <h4>Message</h4>
        <p>{{ mailDetailSent.message }}</p>
        <v-divider class="my-2"></v-divider>
        <h4>Mail info</h4>
        <a :href="mailDetailSent.data.previewUrl" target="_blank">
          {{ mailDetailSent.data.previewUrl }}
        </a>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray" text @click="handleClose">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IMailDetailSent } from '../types';

@Component
export default class SentMailSuccessModal extends Vue {
  @Prop({ required: true })
  isOpen!: boolean;

  @Prop({ required: true })
  mailDetailSent!: IMailDetailSent;

  get isExistMailDetail(): boolean {
    return Object.keys(this.mailDetailSent).length > 0;
  }

  handleClose(): void {
    this.$emit('update:is-open', false);
  }
}
</script>
