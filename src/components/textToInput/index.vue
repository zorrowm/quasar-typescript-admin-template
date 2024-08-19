<template>
  <div class="row items-center">
    <q-input
      outlined
      class="text-to-input"
      style="width: 50%"
      v-model="text"
      :loading="_loading"
      dense
      :readonly="_loading"
      :type="<any>inputType"
      :class="{ 'textarea-no-resize': inputType === 'textarea' }"
      clearable
      clear-icon="app:clear"
      :placeholder="$t('messages.pleaseEnter')"
      :maxlength="maxLength"
    />
    <span class="text-primary q-ml-md cursor-pointer" @click.stop.prevent="confirm">
      {{ $t('action.confirm2') }}
    </span>
    <span class="text-primary q-ml-md cursor-pointer" @click.stop.prevent="close">
      {{ $t('action.cancel') }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';

@Component({ name: 'TextToInputComponent', emits: ['confirm', 'close'] })
export default class TextToInputComponent extends Vue {
  declare $props: { value: string };
  @Prop({ default: '' }) value!: string;
  @Prop({ default: {} }) that!: any;
  @Prop({ default: {} }) instance!: any;
  @Prop({ default: {} }) loading!: boolean;
  @Prop({ default: 'text' }) inputType!: string;
  @Prop({ default: 999999999 }) maxLength!: number;

  @Watch('loading')
  onLoadingChange() {
    this._loading = this.loading;
  }

  @Watch('value')
  onValueChange(newVal: string, oldValue: string) {
    this.oldText = newVal;
    this.text = newVal;
  }

  public text = '';
  private oldText = '';
  public _loading = false;

  public close() {
    if (this._loading) return;
    this.text = this.oldText;
    this.$emit('close', { value: this.text, that: this.that, instance: this.instance });
  }

  public confirm() {
    if (this._loading) return;
    this.oldText = this.text;
    this.$emit('confirm', { value: this.text, that: this.that, instance: this.instance });
  }

  mounted() {
    this.oldText = this.$props.value;
    this.text = this.$props.value;
    this._loading = this.loading;
  }
}
</script>

<style lang="scss"></style>