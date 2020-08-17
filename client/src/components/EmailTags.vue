<template>
  <div class="d-flex align-center flex-wrap">
    <v-chip
      v-for="(email, index) in emails"
      :key="email"
      class="mr-2 mb-2"
      close
      color="teal"
      text-color="white"
      @click:close="handleDelete(index)"
    >
      {{ email }}
    </v-chip>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EmailTags extends Vue {
  @Prop({ required: true })
  emails!: string[];

  handleDelete(index: number): void {
    this.$emit('delete', index);
  }
}
</script>
