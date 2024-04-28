<template>
  <div>
    <q-list>
      <div class="text-caption q-pb-md row items-center text-weight-regular">
        <span class="q-mr-md">
          {{ externalOption.rules.length ? '*' : '' }} {{ externalOption.label }}
          <span class="q-ml-sm detail-link-type" @click="handlerClickSetSlider">Input?</span>
        </span>
      </div>
      <q-item>
        <q-item-section side class="f-bold">
          {{ externalOption.min }}
        </q-item-section>
        <q-item-section>
          <q-slider
            dense
            v-model="internalOption.model"
            @update:model-value="(val) => (internalOption.model = val)"
            :min="externalOption.min"
            :step="externalOption.step"
            label-always
            label
            :max="externalOption.max"
          >
          </q-slider>
        </q-item-section>
        <q-item-section side class="f-bold">
          {{ externalOption.max }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { cloneDeep } from 'lodash';

interface Option {
  model: number;
  classes: string;
  rules: never[];
  label: string;
  min: number;
  max: number;
  step: number;
}

const EXTERNAL_OPTION = {
  model: 0,
  classes: '',
  rules: [],
  label: '',
  min: 0,
  max: 100,
  step: 0.1,
};

@Component({ name: 'mySliderComponent', emits: ['input'] })
export default class mySliderComponent extends Vue {
  $refs: any;
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
    if (newVal.min !== this.prevOption?.min) {
      this.externalOption.min = newVal.min;
    }
    if (newVal.max !== this.prevOption?.max) {
      this.externalOption.max = newVal.max;
    }
    if (newVal.step !== this.prevOption?.step) {
      this.externalOption.step = newVal.step;
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
    model: 0,
  };

  public handlerClickSetSlider() {
    const item = this.externalOption;
    this.$q
      .dialog({
        title: item.label,
        message: `Please enter ${item.label}`,
        transitionHide: 'jump-up',
        transitionShow: 'jump-down',
        prompt: {
          outlined: true,
          model: this.internalOption.model.toString(),
          noErrorIcon: true,
          clearIcon: 'app:clear',
          isValid: (val: any) => {
            if (!item && item !== 0) return false;
            if (item.step) {
              if (!/^[0-9]+$/.test(val)) return false;
              return !(Number(val) < item.min || Number(val) > item.max);
            } else {
              if (!/^\d+(\.\d{1})?$/.test(val)) return false;
              return !(Number(val) < item.min || Number(val) > item.max);
            }
          },
          rules: [
            (val: any) => {
              if (!item && item !== 0) return 'Please enter';
              if (item.step) {
                if (!/^[0-9]+$/.test(val)) return 'Please enter Integer';
                else if (Number(val) < item.min || Number(val) > item.max) {
                  return `Range of values：${item.min} - ${item.max}`;
                } else {
                  return true;
                }
              } else {
                if (!/^\d+(\.\d{1})?$/.test(val)) return 'Please enter a decimal (retain one decimal)';
                else if (Number(val) < item.min || Number(val) > item.max) {
                  return `Range of values：${item.min} - ${item.max}`;
                } else {
                  return true;
                }
              }
            },
          ],
          type: 'number', // optional
        },
        cancel: true,
        ok: {
          color: 'primary',
          persistent: true,
        },
        color: 'primary',
        persistent: true,
      })
      .onOk((data) => {
        this.internalOption.model = Number(data) as any;
      });
  }
}
</script>

<style lang="scss" scoped></style>