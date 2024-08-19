<template>
  <div>
    <p class="q-pb-sm row items-center text-weight-medium">
      <span class="q-mr-xs fs-12">
        <i v-if="externalOption.required" class="text-negative"> * </i>
        {{ externalOption.label }}
      </span>
      <slot name="subTitle"></slot>
    </p>
    <div class="pick-date">
      <div class="row">
        <span class="text-caption q-mr-sm q-mt-sm">
          {{ $t('components.start') }}
        </span>
        <q-input
          ref="startInputEl"
          :rules="internalOption.startRules"
          :class="internalOption.startClasses"
          v-model="internalOption.startModel"
          :placeholder="internalOption.startPlaceholder"
          :spellcheck="false"
          autocapitalize="off"
          mask="####/##/## ##:##:##"
          autocomplete="new-password"
          autocorrect="off"
          outlined
          no-error-icon
          dense
          clearable
          clear-icon="app:clear"
        >
          <template v-slot:append>
            <q-icon name="o_event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="jump-up" transition-hide="jump-down">
                <div class="row">
                  <q-date v-model="internalOption.startModel" mask="YYYY/MM/DD HH:mm:ss" no-caps flat> {{ $t('components.start_date_time') }}</q-date>
                  <q-time v-model="internalOption.startModel" mask="YYYY/MM/DD HH:mm:ss" format24h no-caps flat with-seconds></q-time>
                </div>
                <div class="row items-center justify-center q-my-sm q-gutter-x-md">
                  <q-btn v-close-popup :label="$t('components.now')" color="primary" no-caps flat @click="setNow('startModel')" />
                  <q-btn v-close-popup :label="$t('components.close')" color="primary" />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="row">
        <span class="text-caption q-mr-sm q-mt-sm">
          {{ $t('components.end') }}
        </span>
        <q-input
          ref="endInputEl"
          :rules="internalOption.endRules"
          :class="internalOption.endClasses"
          v-model="internalOption.endModel"
          :placeholder="internalOption.endPlaceholder"
          :spellcheck="false"
          autocapitalize="off"
          mask="####/##/## ##:##:##"
          autocomplete="new-password"
          autocorrect="off"
          outlined
          no-error-icon
          dense
          clearable
          clear-icon="app:clear"
        >
          <template v-slot:append>
            <q-icon name="o_event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="jump-up" transition-hide="jump-down" :target="!!internalOption.startModel">
                <div class="row">
                  <q-date v-model="internalOption.endModel" mask="YYYY/MM/DD HH:mm:ss" flat :options="endDateOption">
                    {{ $t('components.end_date_time') }}
                  </q-date>
                  <q-time v-model="internalOption.endModel" mask="YYYY/MM/DD HH:mm:ss" format24h flat with-seconds></q-time>
                </div>
                <div class="row items-center justify-center q-my-sm q-gutter-x-md">
                  <q-btn v-close-popup :label="$t('components.now')" color="primary" no-caps flat @click="setNow('endModel')" />
                  <q-btn v-close-popup :label="$t('components.close')" color="primary" no-caps />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { date } from 'quasar';
import { cloneDeep } from 'lodash';

interface Option {
  from: string;
  to: string;
  required: boolean;
  label: string;
}

const EXTERNAL_OPTION = {
  from: '',
  to: '',
  required: false,
  label: '',
};

@Component({ name: 'myDateRangeWithTImeComponent', emits: ['input'] })
export default class myDateRangeWithTImeComponent extends Vue {
  $refs: any;
  @Prop({ default: {} }) option!: any;

  get endDateOption(): any {
    return (date: string | number | Date) => {
      if (!this.internalOption.startModel) return false;
      const from = this.internalOption.startModel.split(' ')[0];
      return date >= from;
    };
  }

  @Watch('option', { deep: true })
  onOptionChange(newVal: any) {
    if (newVal.from !== this.prevOption?.from) {
      this.internalOption.startModel = newVal.from;
    }
    if (newVal.to !== this.prevOption?.to) {
      this.internalOption.endModel = newVal.to;
    }
    if (newVal.required !== this.prevOption?.required) {
      this.externalOption.required = newVal.required;
      this.initDateRule();
    }
    if (newVal.label !== this.prevOption?.label) {
      this.externalOption.label = newVal.label;
    }
    this.prevOption = cloneDeep(newVal);
  }

  @Watch('internalOption', { deep: true })
  onInternalOptionChange(newVal: any) {
    if (newVal.startModel !== this.prevInternalOption.startModel) {
      this.$emit('input', {
        from: newVal.startModel,
        to: newVal.endModel,
      });
    }
    if (newVal.endModel !== this.prevInternalOption.endModel) {
      this.$emit('input', {
        from: newVal.startModel,
        to: newVal.endModel,
      });
    }
    if (newVal.startModel) {
      this.$refs.endInputEl && this.$refs.endInputEl.validate();
    }
    if (newVal.endModel) {
      this.$refs.startInputEl && this.$refs.startInputEl.validate();
    }
    this.prevInternalOption = cloneDeep(newVal);
  }

  created() {
    this.externalOption = cloneDeep(Object.assign(cloneDeep(EXTERNAL_OPTION), this.option));
    this.internalOption.startModel = this.option.from;
    this.internalOption.endModel = this.option.to;
    this.initDateRule();
    this.prevOption = cloneDeep(this.option);
    this.prevInternalOption = cloneDeep(this.internalOption);
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  public prevOption: Option | undefined;
  public prevInternalOption: any;
  public externalOption = cloneDeep(EXTERNAL_OPTION);
  public internalOption = {
    startModel: '',
    endModel: '',
    startPlaceholder: this.globals.$t('components.start_date_time'),
    endPlaceholder: this.globals.$t('components.end_date_time'),
    startClasses: 'col',
    endClasses: 'col',
    startRules: [],
    endRules: [],
  };

  public setNow(type: string) {
    (this.internalOption as any)[type] = date.formatDate(new Date().getTime(), 'YYYY/MM/DD HH:mm:ss');
  }

  private initDateRule() {
    if (this.externalOption.required) {
      this.internalOption.startRules = [
        (val: any) => !!val || this.globals.$t('messages.required'),
        (val: any) => {
          if (val) {
            if (date.isValid(val)) {
              return true;
            } else {
              return this.globals.$t('components.start_time_invalid');
            }
          } else {
            return this.globals.$t('components.start_time_required');
          }
        },
        (val: any) => {
          const to = this.internalOption.endModel;
          if (val) {
            if (date.isValid(val) && date.isValid(to)) {
              if (+new Date(val) < +new Date(to)) {
                return true;
              } else {
                return this.globals.$t('components.end_date_less_than_start_date');
              }
            } else {
              return 'Start date is invalid';
            }
          } else {
            return 'Start date is required';
          }
        },
      ] as any;
      this.internalOption.endRules = [
        (val: any) => !!val || this.globals.$t('messages.required'),
        (val: any) => {
          if (val) {
            if (date.isValid(val)) {
              return true;
            } else {
              return this.globals.$t('components.end_date_invalid');
            }
          } else {
            return this.globals.$t('components.end_time_required');
          }
        },
        (val: any) => {
          const from = this.internalOption.startModel;
          if (val) {
            if (date.isValid(from) && date.isValid(val)) {
              if (+new Date(from) < +new Date(val)) {
                return true;
              } else {
                return this.globals.$t('components.end_date_less_than_start_date');
              }
            } else {
              return this.globals.$t('components.end_date_invalid');
            }
          } else {
            return this.globals.$t('components.end_time_required');
          }
        },
      ] as any;
    } else {
      this.internalOption.startRules = [];
      this.internalOption.endRules = [];
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.q-time) {
  border-radius: 0 !important;
}

:deep(.q-date) {
  border-radius: 0 !important;
}

.pick-date {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
}
</style>