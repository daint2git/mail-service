<template>
  <v-text-field
    v-model="email"
    :counter="99"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class EmailField extends Vue {
  @Prop({ required: true })
  value!: string;

  get email(): string {
    return this.value;
  }
  set email(value: string) {
    this.$emit('input', value);
  }
}
</script>
