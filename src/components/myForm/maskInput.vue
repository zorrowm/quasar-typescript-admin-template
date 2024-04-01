<template>
  <div>
    <p class="text-caption q-pb-sm row items-center text-weight-regular">
      <span class="q-mr-xs">{{ externalOption.rules.length ? '*' : '' }} {{ externalOption.label }}</span>
      <slot name="subTitle"></slot>
    </p>
    <q-input
      v-model.trim="internalOption.model"
      :type="externalOption.type"
      :class="['q-mb-sm', externalOption.classes]"
      :placeholder="externalOption.placeholder"
      :rules="externalOption.rules"
      :hint="externalOption.hint"
      :readonly="externalOption.readonly"
      :mask="externalOption.mask"
      ref="MyInputRef"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
      clearable
      no-error-icon
      unmasked-value
      dense
      outlined
      clear-icon="app:clear"
      :spellcheck="false"
    >
    </q-input>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';

/* #	数字
S	字母，a到z，不区分大小写
N	字母数字，不区分大小写
A	字母，转换为大写
a	字母，转换为小写
X	字母数字，字母转换为大写
x	字母数字，字母转换为小写 */

interface Option {
  model: string;
  type: string;
  placeholder: string;
  classes: string;
  rules: never[];
  label: string;
  hint: string;
  mask: string;
  readonly: boolean;
}

const EXTERNAL_OPTION = {
  model: '',
  type: 'text',
  placeholder: '',
  classes: '',
  rules: [],
  label: '',
  hint: '',
  mask: '',
  readonly: false,
};

@Component({ name: 'FormMaskInputComponent', emits: ['input'] })
export default class FormMaskInputComponent extends Vue {
  declare $refs: any;
  @Prop({ default: {} }) option!: Option;

  @Watch('option', { deep: true })
  onOptionchange(newVal: Option) {
    if (newVal.model !== this.prevOption?.model) {
      this.internalOption.model = newVal.model;
    }
    if (newVal.classes !== this.prevOption?.classes) {
      this.externalOption.classes = newVal.classes || '';
    }
    if (newVal.rules !== this.prevOption?.rules) {
      this.externalOption.rules = newVal.rules;
    }
    if (newVal.label !== this.prevOption?.label) {
      this.externalOption.label = newVal.label;
    }
    if (newVal.hint !== this.prevOption?.hint) {
      this.externalOption.hint = newVal.hint;
    }
    if (newVal.readonly !== this.prevOption?.readonly) {
      this.externalOption.readonly = newVal.readonly;
    }
    if (newVal.mask !== this.prevOption?.mask) {
      this.externalOption.mask = newVal.mask;
    }
    this.prevOption = cloneDeep(this.option);
  }

  @Watch('internalOption.model')
  onchange() {
    this.$emit('input', this.internalOption.model);
  }

  created() {
    EXTERNAL_OPTION.placeholder = this.globals.$t('messages.pleaseEnter');
    this.externalOption = cloneDeep(Object.assign(EXTERNAL_OPTION, this.option));
    this.internalOption.model = this.option.model;
    this.prevOption = cloneDeep(this.option);
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  public prevOption: Option | undefined;
  private externalOption = cloneDeep(EXTERNAL_OPTION);
  public internalOption = {
    model: '',
  };

  public async validForm() {
    return this.$refs['MyInputRef'].validate();
  }
}
</script>

<style lang="scss" scoped></style>