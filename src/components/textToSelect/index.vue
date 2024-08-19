<template>
  <div class="row items-center">
    <q-select
      outlined
      style="width: 50%"
      class="text-to-input"
      v-model="text"
      :loading="_loading"
      dense
      :options="_options"
      emit-value
      map-options
      options-dense
      dropdown-icon="app:topbar-arrow-bottom"
      clear-icon="app:clear"
      clearable
    >
      <template v-slot:no-option>
        <q-item dense>
          <q-item-section class="text-grey text-caption">
            {{ $t('tip.noData') }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
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
  @Prop() instance!: any;
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
    this._options = JSON.parse(JSON.stringify(this.options));
  }
}
</script>

<style lang="scss"></style>