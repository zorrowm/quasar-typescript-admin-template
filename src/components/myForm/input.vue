<template>
  <div>
    <p class="q-pb-sm row items-center text-weight-medium">
      <span class="q-mr-xs fs-12">
        <i v-if="externalOption.rules.length" class="text-negative"> * </i>
        {{ externalOption.label }}
      </span>
      <slot name="subTitle"></slot>
    </p>
    <q-input
      v-model.trim="internalOption.model"
      :type="<any>externalOption.inputType"
      :class="['q-mb-sm', externalOption.classes]"
      :placeholder="externalOption.placeholder"
      :rules="externalOption.rules"
      :hint="externalOption.hint"
      :readonly="externalOption.readonly"
      :disable="externalOption.disable"
      :maxlength="externalOption.maxLength"
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
import { AppModule } from 'src/store/modules/app';

interface Option {
  model: string;
  type: string;
  placeholder?: string;
  classes?: string;
  rules: never[];
  label: string;
  hint: string;
  readonly: boolean;
  disable: boolean;
  inputType: string;
  maxLength?: number;
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
  inputType: 'text',
  maxLength: 9999999,
};
@Component({ name: 'FormInputComponent', emits: ['input'] })
export default class FormInputComponent extends Vue {
  declare $refs: any;

  @Prop({ default: {} }) option!: Option;

  get dialogVisible() {
    return AppModule.dialogVisible;
  }

  @Watch('option', { deep: true })
  onOptionChange(newVal: Option) {
    if (AppModule.dialogVisible) {
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
      if (newVal.inputType !== this.prevOption?.inputType) {
        this.externalOption.inputType = newVal.inputType;
      }
      this.prevOption = cloneDeep(newVal);
    }
  }

  @Watch('internalOption.model')
  onchange() {
    this.$emit('input', this.internalOption.model);
  }

  created() {
    EXTERNAL_OPTION.placeholder = this.$t('messages.pleaseEnter');
    this.externalOption = cloneDeep(Object.assign(cloneDeep(EXTERNAL_OPTION), this.option));
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