<template>
  <div>
    <p class="q-pb-sm row items-center text-weight-medium">
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
      :multiple="true"
      :readonly="externalOption.readonly"
      :use-input="externalOption.userInput"
      :input-class="externalOption.inputId"
      :input-debounce="100"
      :hint="externalOption.hint"
      @popup-show="externalOption.userInput ? popShow() : () => 0"
      @popup-hide="externalOption.userInput ? popHide() : () => 0"
      @filter="filterFn"
      @input-value="inputValue"
      :spellcheck="false"
      autocapitalize="off"
      autocomplete="new-password"
      autocorrect="off"
      dense
      options-dense
      outlined
      dropdown-icon="app:topbar-arrow-bottom"
      no-error-icon
      emit-value
      map-options
      clear-icon="app:clear"
    >
      <template #selected>
        <template v-if="internalOption.model && internalOption.model.length">
          <q-chip :removable="!externalOption.readonly" v-for="(item, index) in internalOption.model" :key="item" dense @remove="internalOption.model.splice(index, 1)"
            >{{ internalOption.selectOptionBak.find((data) => String(data.value) === String(item))?.label ?? item }}
          </q-chip>
        </template>
        <template v-if="(!internalOption.model || (internalOption.model && !internalOption.model.length)) && internalOption.showPlaceholder">
          <span class="text-grey-5 text-caption">{{ $t('messages.pleaseSelect') }}</span>
        </template>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section v-close-popup>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
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
  model: never[];
  classes?: string;
  rules: never[];
  label: string;
  selectOption: never[];
  showClose: boolean;
  readonly: boolean;
  userInput: boolean;
  inputId: string;
  hint: string;
}

const EXTERNAL_OPTION = {
  model: [],
  classes: '',
  rules: [],
  label: '',
  selectOption: [],
  showClose: true,
  readonly: false,
  userInput: false,
  inputId: '',
  hint: '',
};

@Component({ name: 'FormMultipleSelectComponent', emits: ['input'] })
export default class FormMultipleSelectComponent extends Vue {
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
    if (newVal.selectOption !== this.prevOption?.selectOption) {
      this.externalOption.selectOption = newVal.selectOption;
      this.internalOption.selectOptionBak = cloneDeep(newVal.selectOption);
    }
    if (newVal.showClose !== this.prevOption?.showClose) {
      this.externalOption.showClose = newVal.showClose;
    }
    if (newVal.readonly !== this.prevOption?.readonly) {
      this.externalOption.readonly = newVal.readonly;
    }
    if (newVal.userInput !== this.prevOption?.userInput) {
      this.externalOption.userInput = newVal.userInput;
    }
    if (newVal.hint !== this.prevOption?.hint) {
      this.externalOption.hint = newVal.hint;
    }
    this.prevOption = cloneDeep(newVal);
  }

  @Watch('internalOption.model')
  onchange() {
    this.$refs[this.externalOption.inputId] && this.$refs[this.externalOption.inputId].updateInputValue('');
    if (!this.internalOption.model || (this.internalOption.model && !this.internalOption.model.length)) {
      this.internalOption.showPlaceholder = true;
      this.$nextTick(() => {
        this.$refs[this.externalOption.inputId] && this.$refs[this.externalOption.inputId].blur();
        this.$refs[this.externalOption.inputId] && this.$refs[this.externalOption.inputId].hidePopup();
      });
    }
    this.$emit('input', this.internalOption.model);
  }

  created() {
    this.externalOption = cloneDeep(Object.assign(cloneDeep(EXTERNAL_OPTION), this.option));
    this.internalOption.model = this.option.model;
    this.prevOption = cloneDeep(this.option);
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  public prevOption: Option | undefined;
  public externalOption = cloneDeep(EXTERNAL_OPTION);
  public internalOption = {
    model: [],
    selectOptionBak: [],
    showPlaceholder: true,
  };

  public async validForm() {
    return this.$refs[this.externalOption.inputId].validate();
  }

  public popShow() {
    this.internalOption.showPlaceholder = !this.externalOption.userInput;
  }

  public popHide() {
    if (!this.internalOption.model || (this.internalOption.model && !this.internalOption.model.length)) {
      this.$nextTick(() => {
        this.$refs[this.externalOption.inputId] && this.$refs[this.externalOption.inputId].blur();
      });
    }
    this.internalOption.showPlaceholder = true;
  }

  public filterFn(val: any, update: any) {
    update(() => {
      if (val === '') {
        this.externalOption.selectOption = this.internalOption.selectOptionBak;
      } else {
        this.externalOption.selectOption = this.internalOption.selectOptionBak.filter((v: any) => {
          return String(v.label).indexOf(val) !== -1;
        });
      }
    });
  }

  private removeItem(index: number) {
    this.internalOption.model.splice(index, 1);
    if (!this.internalOption.model.length) {
      this.internalOption.showPlaceholder = true;
      this.$nextTick(() => {
        this.$refs[this.externalOption.inputId] && this.$refs[this.externalOption.inputId].hidePopup();
      });
    }
  }

  public inputValue(val: string) {
    if (!val) {
      this.internalOption.showPlaceholder = true;
      if (!this.internalOption.model || (this.internalOption.model && !this.internalOption.model.length)) {
        this.$nextTick(() => {
          this.$refs[this.externalOption.inputId] && this.$refs[this.externalOption.inputId].blur();
          this.$refs[this.externalOption.inputId] && this.$refs[this.externalOption.inputId].hidePopup();
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>