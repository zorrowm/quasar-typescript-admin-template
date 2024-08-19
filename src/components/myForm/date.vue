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
      v-model="internalOption.model"
      :class="['q-mb-sm', externalOption.classes]"
      :placeholder="externalOption.placeholder"
      :rules="externalOption.rules"
      :hint="externalOption.hint"
      :readonly="externalOption.readonly"
      :disable="externalOption.disable"
      ref="MyDateRef"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
      clearable
      no-error-icon
      dense
      outlined
      clear-icon="app:clear"
      :spellcheck="false"
      :mask="externalOption.hhmmss ? '####/##/## ##:##:##' : '####/##/##'"
    >
      <template v-slot:prepend v-if="!externalOption.readonly">
        <q-icon name="app:calendar" class="cursor-pointer">
          <q-popup-proxy cover transition-show="jump-up" transition-hide="jump-down">
            <q-date v-model="internalOption.model" :mask="externalOption.hhmmss ? 'YYYY/MM/DD HH:mm:ss' : 'YYYY/MM/DD'">
              <div class="row items-center justify-end">
                <q-btn v-close-popup :label="$t('components.close')" color="primary" flat no-caps />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append v-if="!externalOption.readonly && externalOption.hhmmss">
        <q-icon name="app:time2" class="cursor-pointer">
          <q-popup-proxy cover ttransition-show="jump-up" transition-hide="jump-down">
            <q-time v-model="internalOption.model" mask="YYYY/MM/DD HH:mm:ss" format24h with-seconds>
              <div class="row items-center justify-end">
                <q-btn v-close-popup :label="$t('components.close')" color="primary" flat no-caps />
              </div>
            </q-time>
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

interface Option {
  model: string;
  placeholder?: string;
  classes?: string;
  rules: never[];
  label: string;
  hint: string;
  readonly: boolean;
  disable: boolean;
  hhmmss?: boolean;
}

const EXTERNAL_OPTION = {
  model: '',
  placeholder: '',
  classes: '',
  rules: [],
  label: '',
  hint: '',
  readonly: false,
  disable: false,
  hhmmss: false,
};

@Component({
  name: 'FormDateComponent',
  emits: ['input'],
})
export default class FormDateComponent extends Vue {
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
    return await this.$refs['MyDateRef'].validate();
  }
}
</script>

<style scoped></style>