<template>
  <q-select outlined class="text-to-input" v-model="text" :loading="_loading" dense :options="_options" emit-value map-options options-dense>
    <template v-slot:append>
      <q-icon name="o_cancel" class="cursor-pointer text-grey" @click.stop.prevent="close"></q-icon>
      <q-icon name="o_check_circle" class="cursor-pointer text-black" @click.stop.prevent="confirm"></q-icon>
    </template>
  </q-select>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';

@Component({ name: 'TextToInputComponent', emits: ['confirm', 'close'] })
export default class TextToInputComponent extends Vue {
  declare $props: { value: string };
  @Prop({ default: '' }) value!: string;
  @Prop({ default: {} }) that!: any;
  @Prop({ default: {} }) loading!: boolean;
  @Prop({ default: [] }) options!: any[];

  @Watch('loading')
  onLoadingChange() {
    this._loading = this.loading;
  }

  @Watch('value')
  onValueChange(newVal: string, oldValue: string) {
    this.oldText = newVal;
    this.text = newVal;
  }

  private text = '';
  private oldText = '';
  private _options = [];
  private _loading = false;

  private close() {
    this.text = this.oldText;
    this.$emit('close', { value: this.text, that: this.that });
  }

  private confirm() {
    this.oldText = this.text;
    this.$emit('confirm', { value: this.text, that: this.that });
  }

  mounted() {
    this.oldText = this.$props.value;
    this.text = this.$props.value;
    this._options = JSON.parse(JSON.stringify(this.$props.options));
  }
}
</script>

<style lang="scss"></style>