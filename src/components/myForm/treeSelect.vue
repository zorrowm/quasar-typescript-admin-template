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
      v-model.trim="internalOption.inputModel"
      :class="['q-mb-sm', externalOption.classes]"
      :rules="externalOption.rules"
      :hint="externalOption.hint"
      :disable="externalOption.disable"
      @focus="inputFocus"
      @blur="inputBlur"
      @update:model-value="inputValue"
      ref="inputRef"
      :placeholder="$t('messages.pleaseSelect')"
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
    <q-menu :offset="[0, -20]" no-refocus ref="menuRef" no-parent-event no-focus persistent @show="menuShow" @hide="menuHide">
      <q-list dense :style="menuListWidth">
        <q-item v-for="(one, oneIndex) in externalOption.selectOption" :key="oneIndex" @click.prevent.stop="menuItemClick(one)" clickable style="padding: 2px 12px">
          <q-item-section>{{ one.label }}</q-item-section>
          <q-item-section side v-if="one.children.length">
            <q-icon name="app:navigation-arrow-right" />
          </q-item-section>
          <q-menu anchor="top end" self="top start" v-if="one.children.length">
            <q-list dense :style="menuChildrenWidth">
              <q-item v-for="(two, twoIndex) in one.children" :key="twoIndex" dense @click.prevent.stop="menuItemClick(two)" clickable style="padding: 2px 12px">
                <q-item-section>{{ two.label }}</q-item-section>
                <q-item-section side v-if="two.children.length">
                  <q-icon name="app:navigation-arrow-right" />
                </q-item-section>
                <q-menu auto-close anchor="top end" self="top start" v-if="two.children.length">
                  <q-list dense :style="menuChildrenWidth">
                    <q-item v-for="(three, threeIndex) in two.children" :key="threeIndex" dense @click.prevent.stop="menuItemClick(three)" clickable style="padding: 2px 12px">
                      <q-item-section>{{ three.label }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { cloneDeep } from 'lodash';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';

interface Option {
  model: string;
  classes: string;
  rules: never[];
  label: string;
  selectOption: never[];
  hint: string;
  inputId: string;
  disable: boolean;
}

const EXTERNAL_OPTION = {
  model: '',
  classes: '',
  rules: [],
  label: '',
  selectOption: [],
  hint: '',
  inputId: '',
  disable: false,
};
@Component({ name: 'MyTreeSelectComponent', emits: ['input'] })
export default class MyTreeSelectComponent extends Vue {
  declare $refs: any;
  @Prop({ default: {} }) option!: Option;

  get menuListWidth() {
    return `width:${this.$refs.inputRef.$el.clientWidth}px`;
  }

  get menuChildrenWidth() {
    return `width:${this.$refs.inputRef.$el.clientWidth / 2}px`;
  }

  @Watch('option', { deep: true })
  onOptionChange(newVal: Option) {
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
    if (newVal.selectOption !== this.prevOption?.selectOption) {
      this.externalOption.selectOption = newVal.selectOption;
      this.internalOption.selectOptionBak = cloneDeep(newVal.selectOption);
    }
  }

  created() {
    this.externalOption = cloneDeep(Object.assign(cloneDeep(EXTERNAL_OPTION), this.option));
    const item: any = this.externalOption.selectOption.find((one: any) => one.value === this.option.model);
    this.internalOption.inputModel = item ? item.label : '';
    this.internalOption.model = this.option.model;
    this.prevOption = cloneDeep(this.option);
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  public prevOption: Option | undefined;
  public externalOption = cloneDeep(EXTERNAL_OPTION);
  public internalOption = {
    inputModel: '',
    model: '',
    selectOptionBak: [],
  };

  /* event */
  public menuItemClick(item: any) {
    if (!item.children.length) {
      this.$refs.menuRef.hide();
      this.internalOption.inputModel = item.label;
      this.$emit('input', item.value);
    }
  }

  private documentClickEvent(event: any) {
    // 检查点击事件是否发生在目标元素之外
    if (this.$refs.inputRef && !this.$refs.inputRef.$el.contains(event.target)) {
      this.$refs.menuRef.hide();
    }
  }

  public menuShow() {
    document.addEventListener('click', this.documentClickEvent);
  }

  public menuHide() {
    document.removeEventListener('click', this.documentClickEvent);
  }

  public inputFocus() {
    this.inputValue(this.internalOption.inputModel);
    this.$refs.menuRef.show();
  }

  public inputBlur() {
    if (!this.externalOption.selectOption.some((one: any) => one.label === this.internalOption.inputModel)) {
      this.internalOption.inputModel = '';
    }
  }

  public inputValue(value: any) {
    const selectOptionBak = cloneDeep(this.internalOption.selectOptionBak);
    if (!value) {
      this.$emit('input', null);
      this.externalOption.selectOption = selectOptionBak;
      return;
    }
    value = value.toLowerCase();
    this.externalOption.selectOption = selectOptionBak.filter((one: any) => {
      if (one.label.toLowerCase().includes(value)) return true;
      else {
        one.children = one.children.filter((two: any) => {
          if (two.label.toLowerCase().includes(value)) return true;
          else {
            two.children = two.children.filter((three: any) => {
              return three.label.toLowerCase().includes(value);
            });
            return two.children.length;
          }
        });
        return one.children.length;
      }
    });
  }
}
</script>

<style lang="scss" scoped></style>