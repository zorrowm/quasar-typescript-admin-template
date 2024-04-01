<template>
  <div class="relative-position">
    <p class="text-caption q-pb-sm row items-center text-weight-regular">
      <span class="q-mr-xs"> {{ externalOption.required ? '*' : '' }} {{ externalOption.label }} </span>
      <slot name="subTitle"></slot>
    </p>
    <q-input
      :rules="externalOption.rules"
      ref="MyInputRef"
      v-model="internalOption.model"
      :placeholder="$t('messages.pleaseSelectDate')"
      :spellcheck="false"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
      outlined
      mask="####/##/## - ####/##/##"
      no-error-icon
      clearable
      clear-icon="app:clear"
      dense
    >
      <template v-slot:append>
        <q-icon name="o_event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="jump-up" transition-hide="jump-down">
            <q-date v-model="internalOption.dateModel" range>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';
import { date } from 'quasar';

interface Option {
  from: string;
  to: string;
  required: boolean;
  label: string;
  rules: never[];
  disable: boolean;
}

const EXTERNAL_OPTION = {
  from: '',
  to: '',
  required: false,
  label: '',
  rules: [],
  disable: false,
};

@Component({ name: 'FormDateComponent', emits: ['input'] })
export default class FormDateComponent extends Vue {
  $refs!: any;
  @Prop({ default: {} }) option!: Option;

  @Watch('option', { deep: true })
  onOptionChange(newVal: Option) {
    if (newVal.disable !== this.prevOption?.disable) {
      this.externalOption.disable = newVal.disable;
    }
    if (newVal.from !== this.prevOption?.from) {
      this.internalOption.dateModel.from = newVal.from;
    }
    if (newVal.to !== this.prevOption?.to) {
      this.internalOption.dateModel.to = newVal.to;
    }
    if (newVal.from !== this.prevOption?.from || newVal.to !== this.prevOption?.to) {
      this.internalOption.model = `${newVal.from} - ${newVal.to}`;
    }
    if (newVal.required !== this.prevOption?.required) {
      this.externalOption.required = newVal.required;
      this.initDateRule();
    }
    if (newVal.label !== this.prevOption?.label) {
      this.externalOption.label = newVal.label;
    }
    if (newVal.rules !== this.prevOption?.rules) {
      this.externalOption.rules = newVal.rules;
    }
    this.prevOption = cloneDeep(newVal);
  }

  @Watch('internalOption.dateModel')
  onDateModelChange() {
    if (this.internalOption.dateModel) {
      const start = this.internalOption.dateModel.from;
      const end = this.internalOption.dateModel.to;
      this.internalOption.model = `${start} - ${end}`;
    }
  }

  created() {
    this.externalOption = cloneDeep(Object.assign(EXTERNAL_OPTION, this.option));
    this.internalOption.model = `${this.option.from} - ${this.option.to}`;
    this.internalOption.dateModel = { from: this.option.from, to: this.option.to };
    this.initDateRule();
    this.prevOption = cloneDeep(this.option);
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  public prevOption: Option | undefined;
  public externalOption = cloneDeep(EXTERNAL_OPTION);
  public internalOption = {
    model: '',
    dateModel: { from: '', to: '' },
  };

  private initDateRule() {
    if (this.externalOption.required) {
      this.externalOption.rules = [
        (val: any) => !!val || this.globals.$t('messages.required'),
        (val: any) => {
          const start = val.split(' - ')[0];
          const end = val.split(' - ')[1];
          if (val) {
            if (date.isValid(start) && date.isValid(end)) {
              if (new Date(start) > new Date(end)) {
                return 'Start date must be less than end date';
              } else {
                this.$emit('input', { from: start, to: end });
              }
            } else {
              return 'Invalid date format';
            }
          }
        },
      ] as any;
    } else {
      this.externalOption.rules = [];
    }
  }
}
</script>

<style lang="scss" scoped></style>