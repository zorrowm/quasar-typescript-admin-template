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
      :disable="externalOption.disable"
      ref="MyInputRef"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
      clearable
      no-error-icon
      dense
      outlined
      clear-icon="app:clear"
      :spellcheck="false"
    >
      <template #append>
        <slot name="append"></slot>
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';

interface Option {
  model: string;
  type?: string;
  placeholder?: string;
  classes?: string;
  rules: never[];
  label: string;
  hint: string;
  readonly: boolean;
  disable: boolean;
}

const EXTERNAL_OPTION = {
  model: '',
  type: 'text',
  placeholder: '',
  classes: '',
  rules: [],
  label: '',
  hint: '',
  readonly: false,
  disable: false,
};
@Component({ name: 'FormInputComponent', emits: ['input'] })
export default class FormInputComponent extends Vue {
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
    this.prevOption = cloneDeep(newVal);
  }

  @Watch('internalOption.model')
  onchange() {
    this.$emit('input', this.internalOption.model);
  }

  created() {
    EXTERNAL_OPTION.placeholder = this.$t('messages.pleaseEnter');
    this.externalOption = cloneDeep(Object.assign(EXTERNAL_OPTION, this.option));
    this.internalOption.model = this.option.model;
    this.prevOption = cloneDeep(this.option);
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  public prevOption: Option | undefined;
  public externalOption = cloneDeep(EXTERNAL_OPTION);
  public internalOption = {
    model: '',
  };

  public async validForm() {
    return await this.$refs['MyInputRef'].validate();
  }
}
</script>

<style lang="scss" scoped></style>