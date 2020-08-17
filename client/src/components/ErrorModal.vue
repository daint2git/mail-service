<template>
  <v-dialog :value="isOpen" scrollable width="360px" @input="handleClose">
    <v-card>
      <v-card-title class="headline red white--text">
        Error
      </v-card-title>
      <v-card-text class="d-flex flex-column text-left mt-2">
        <h4>Message</h4>
        <p>An error occurred</p>
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

@Component
export default class ErrorModal extends Vue {
  @Prop({ required: true })
  isOpen!: boolean;

  handleClose(): void {
    this.$emit('update:is-open', false);
  }
}
</script>
