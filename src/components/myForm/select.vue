<template>
  <div>
    <p class="q-pb-sm row items-center text-weight-medium" v-show="!externalOption.hideTitle">
      <span class="q-mr-xs fs-12">
        <i v-if="externalOption.rules.length" class="text-negative"> * </i>
        {{ externalOption.label }}
      </span>
      <slot name="subTitle"></slot>
    </p>
    <q-select
      :ref="externalOption.inputId"
      v-model="internalOption.model"
      :options="externalOption.selectOption"
      :class="['q-mb-sm', externalOption.classes]"
      :rules="externalOption.rules"
      :clearable="externalOption.showClose"
      :readonly="externalOption.readonly"
      :disable="externalOption.disable"
      :hint="externalOption.hint"
      :use-input="externalOption.userInput"
      :input-class="externalOption.inputId"
      :placeholder="internalOption.model ? (externalOption.userInput ? '' : externalOption.placeholder) : externalOption.placeholder"
      :input-debounce="100"
      @filter="filterFn"
      :spellcheck="false"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
      dense
      dropdown-icon="expand_more"
      no-error-icon
      options-dense
      outlined
      emit-value
      map-options
      clear-icon="app:clear"
    >
      <template #selected>
        <template v-if="(typeof internalOption.model === 'object' && internalOption.model && internalOption.model.length) || (typeof internalOption.model !== 'object' && internalOption.model)">
          {{ internalOption.selectOptionBak.find((data) => String(data.value) === String(internalOption.model))?.label ?? internalOption.model }}
        </template>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section v-close-popup>
            <q-item-label
              >{{ scope.opt.label }}
              <slot name="extra-label-content" :opt="scope.opt" />
            </q-item-label>
            <q-item-label caption v-if="scope.opt.description" class="text-grey">{{ scope.opt.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:no-option>
        <q-item dense>
          <q-item-section class="text-grey text-caption">
            {{ $t('tip.noData') }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';

interface Option {
  model: string;
  placeholder: string;
  classes: string;
  rules: never[];
  label: string;
  selectOption: never[];
  showClose: boolean;
  readonly: boolean;
  hint: string;
  userInput: boolean;
  inputId: string;
  disable: boolean;
  hideTitle: boolean;
}

const EXTERNAL_OPTION = {
  model: '',
  placeholder: '',
  classes: '',
  rules: [],
  label: '',
  selectOption: [],
  showClose: true,
  readonly: false,
  hint: '',
  userInput: false,
  inputId: '',
  disable: false,
  hideTitle: false,
};

@Component({ name: 'FormSelectComponent', emits: ['input'] })
export default class FormSelectComponent extends Vue {
  declare $refs: any;
  @Prop({ default: {} }) option!: Option;

  @Watch('option', { deep: true })
  onOptionChange(newVal: Option) {
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
    if (newVal.userInput !== this.prevOption?.userInput) {
      this.externalOption.userInput = newVal.userInput;
    }
    this.prevOption = cloneDeep(this.option);
  }

  @Watch('internalOption.model')
  onchange() {
    this.$nextTick(() => {
      this.$refs[this.externalOption.inputId] && this.$refs[this.externalOption.inputId].hidePopup();
    });
    this.$emit('input', this.internalOption.model);
  }

  created() {
    EXTERNAL_OPTION.placeholder = this.$t('messages.pleaseSelect');
    this.externalOption = cloneDeep(Object.assign(cloneDeep(EXTERNAL_OPTION), this.option));
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

  public async validForm() {
    return this.$refs[this.externalOption.inputId].validate();
  }

  public filterFn(val: any, update: any) {
    update(() => {
      if (val === '') {
        this.externalOption.selectOption = this.internalOption.selectOptionBak;
      } else {
        this.externalOption.selectOption = this.internalOption.selectOptionBak.filter((v: any) => {
          return String(v.label.toLowerCase()).indexOf(val.toLocaleString()) !== -1;
        });
      }
    });
  }
}
</script>

<style lang="scss" scoped></style>