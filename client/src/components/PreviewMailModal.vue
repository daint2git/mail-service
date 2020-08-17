<template>
  <v-dialog :value="isOpen" scrollable width="600px" @input="handleClose">
    <v-card>
      <v-card-title class="headline primary white--text">
        Preview Mail
      </v-card-title>
      <v-card-text
        class="d-flex flex-column text-left mt-2"
        style="max-height: 600px;"
      >
        <h4>From</h4>
        <p>{{ mail.from }}</p>
        <v-divider class="my-2"></v-divider>
        <h4>To</h4>
        <p>{{ mail.to }}</p>
        <v-divider class="my-2"></v-divider>
        <template v-if="mail.cc">
          <h4>Cc</h4>
          <p>{{ mail.cc }}</p>
          <v-divider class="my-2"></v-divider>
        </template>
        <template v-if="mail.bcc">
          <h4>Bccc</h4>
          <p>{{ mail.bcc }}</p>
          <v-divider class="my-2"></v-divider>
        </template>
        <h4>Subject</h4>
        <p>{{ mail.subject }}</p>
        <v-divider class="my-2"></v-divider>
        <h4>Body</h4>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="body" v-html="mail.body"> </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray" text @click="handleClose">Close</v-btn>
        <v-btn color="primary" text @click="handleOk">Send Mail</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { IMail } from '../types';

@Component
export default class PreviewMailModal extends Vue {
  @Prop({ required: true })
  isOpen!: boolean;

  @Prop({ required: true })
  mail!: IMail;

  handleClose(): void {
    this.$emit('update:is-open', false);
  }

  handleOk(): void {
    this.$emit('send');
  }
}
</script>

<style lang="scss">
.body {
  blockquote {
    overflow: hidden;
    padding-right: 1.5em;
    padding-left: 1.5em;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    border-left: 5px solid #ccc;
  }
}
</style>
