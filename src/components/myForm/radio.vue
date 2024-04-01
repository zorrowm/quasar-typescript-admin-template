<template>
  <div>
    <p class="text-caption q-pb-sm row items-center text-weight-regular">
      <span class="q-mr-xs">{{ externalOption.rules.length ? '*' : '' }} {{ externalOption.label }}</span>
      <slot name="subTitle"></slot>
    </p>
    <q-option-group
      v-model="internalOption.model"
      :options="externalOption.selectOption"
      color="primary"
      inline
      :class="['q-mb-sm', externalOption.classes]"
      :ref="externalOption.inputId"
      :disable="externalOption.disable || externalOption.readonly"
      :spellcheck="false"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
    />
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';

interface Option {
  model: string;
  classes: string;
  rules: never[];
  label: string;
  selectOption: never[];
  hint: string;
  readonly: boolean;
  inputId: string;
  disable: boolean;
}

const EXTERNAL_OPTION = {
  model: '',
  classes: '',
  rules: [],
  label: '',
  hint: '',
  selectOption: [],
  readonly: false,
  inputId: '',
  disable: false,
};

@Component({ name: 'FormRadioComponent', emits: ['input'] })
export default class FormRadioComponent extends Vue {
  declare $refs: any;
  @Prop({ default: {} }) option!: Option;

  @Watch('option', { deep: true })
  onOptionChange(newVal: Option) {
    // 检查哪些属性发生了变化，并执行相应的操作
    if (newVal.disable !== this.prevOption?.disable) {
      this.externalOption.disable = newVal.disable;
    }
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
    if (newVal.selectOption !== this.prevOption?.selectOption) {
      this.externalOption.selectOption = newVal.selectOption;
      this.internalOption.selectOptionBak = cloneDeep(newVal.selectOption);
    }
    this.prevOption = cloneDeep(newVal);
  }

  @Watch('internalOption.model')
  onchange() {
    this.$emit('input', this.internalOption.model);
  }

  created() {
    this.externalOption = cloneDeep(Object.assign(EXTERNAL_OPTION, this.option));
    this.internalOption.model = this.option.model;
    this.prevOption = cloneDeep(this.option);
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  public prevOption: Option | undefined;
  public externalOption = cloneDeep(EXTERNAL_OPTION);
  public internalOption = {
    model: '',
    selectOptionBak: [],
  };
}
</script>

<style lang="scss" scoped></style>