<template>
  <div>
    <q-dialog
      :transition-show="myDialogParams.rightPanel ? 'slide-left' : 'jump-down'"
      :transition-hide="myDialogParams.rightPanel ? 'slide-right' : 'jump-up'"
      v-model="myDialogParams.visible"
      @before-hide="handlerBeforeHide"
      :full-height="myDialogParams.rightPanel"
      :position="myDialogParams.rightPanel ? 'right' : 'standard'"
      :persistent="myDialogParams.persistent"
    >
      <q-card
        class="my-dialog"
        :style="calcMyDialogWidth"
        :class="{
          'right-panel': myDialogParams.rightPanel,
        }"
      >
        <div class="title q-pa-md row items-center">
          <span class="fs-18 text-weight-bold">{{ myDialogParams.title }}</span>
          <q-icon class="q-ml-auto cursor-pointer" name="close" @click="handleClickCancel" size="20px" v-if="myDialogParams.showClose" color="grey-9" />
        </div>
        <div class="loading-mask" v-show="myDialogParams.getDataLoading">
          <q-inner-loading
            :showing="myDialogParams.getDataLoading"
            :label="$t('action.loading')"
            color="primary"
            label-class="text-primary text-weight-medium"
            :spinner-color="$q.dark.isActive ? 'white' : 'black'"
          ></q-inner-loading>
        </div>
        <div class="content" :class="{ 'q-pa-lg': !myDialogParams.showConfirm }">
          <q-form :ref="myDialogParams.id">
            <slot />
          </q-form>
        </div>
        <div class="q-px-md q-pb-md" :class="{ 'q-px-lg': !myDialogParams.showConfirm }" style="margin-top: -12px">
          <slot name="extra-description" />
        </div>
        <q-card-actions class="actions q-pa-none" v-show="myDialogParams.showConfirm">
          <div class="q-pl-md q-pb-md q-pr-md full-width text-right">
            <q-btn :label="$t(`action.cancel`)" :disable="myDialogParams.clickLoading" @click="handleClickCancel()" outline no-caps style="min-width: 80px" />
            <q-btn
              :label="$t(`action.confirm`)"
              color="primary"
              class="q-ml-md"
              @click="handleClickDialogConfirmButton()"
              :loading="myDialogParams.clickLoading"
              :ripple="false"
              unelevated
              no-caps
              style="min-width: 80px"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { getCurrentInstance } from 'vue';
import { cloneDeep } from 'lodash';
import { AppModule } from 'src/store/modules/app';

interface IOption {
  id: string;
  dialogType: string;
  getDataLoading: boolean;
  clickLoading: boolean;
  visible: boolean;
  title: string;
  showConfirm: boolean;
  params: any;
  customConfirm: boolean;
  noTwiceConfirm: boolean;
  persistent?: boolean;
  showClose?: boolean;
  rightPanel: boolean;
}

const DEFAULT_OPTION: IOption = {
  id: '',
  dialogType: '',
  getDataLoading: false,
  clickLoading: false,
  visible: false,
  title: '',
  showConfirm: true,
  params: {},
  customConfirm: false,
  noTwiceConfirm: false,
  persistent: true,
  showClose: true,
  rightPanel: false,
};

@Component({
  name: 'MyDialogComponent',
  emits: ['close', 'confirm', 'before-hide'],
})
export default class MyDialogComponent extends Vue {
  declare $refs: any;
  @Prop({ default: '50vw' }) width!: string;
  @Prop({ default: () => ({}) }) option!: IOption;

  @Watch('option', { deep: true })
  onOptionChange(newVal: IOption) {
    // 检查哪些属性发生了变化，并执行相应的逻辑
    if (newVal.visible !== this.prevOption!.visible) {
      AppModule.SET_DIALOG_VISIBLE(newVal.visible);
      if (newVal.visible) {
        this.$nextTick(() => {
          this.$refs[this.myDialogParams.id] && this.$refs[this.myDialogParams.id].resetValidation();
        });
      }
      this.myDialogParams.visible = newVal.visible;
    }
    if (newVal.dialogType !== this.prevOption!.dialogType) {
      this.myDialogParams.dialogType = newVal.dialogType;
    }
    if (newVal.clickLoading !== this.prevOption!.clickLoading) {
      this.myDialogParams.clickLoading = newVal.clickLoading;
    }
    if (newVal.getDataLoading !== this.prevOption!.getDataLoading) {
      this.myDialogParams.getDataLoading = newVal.getDataLoading;
    }
    if (newVal.title !== this.prevOption!.title) {
      this.myDialogParams.title = newVal.title;
    }
    this.prevOption = cloneDeep(newVal);
  }

  get calcMyDialogWidth() {
    const width = Number(this.width.replace('vw', ''));
    if (width !== 50) {
      if (width === 40) {
        const documentWidth = document.body.clientWidth;
        if (documentWidth > 1440) {
          return {
            width: '25vw',
            maxWidth: '40vw',
          };
        } else {
          return {
            width: '40vw',
            maxWidth: '40vw',
          };
        }
      }
      return {
        width: `${width}vw`,
        maxWidth: '100vw',
      };
    } else {
      //   根据document width计算dialog width
      const documentWidth = document.body.clientWidth;
      if (documentWidth < 600) {
        return {
          width: '90vw',
          maxWidth: '100vw',
        };
      } else if (documentWidth < 960) {
        return {
          width: '80vw',
          maxWidth: '100vw',
        };
      } else if (documentWidth < 1280) {
        return {
          width: '80vw',
          maxWidth: '100vw',
        };
      } else if (documentWidth < 1920) {
        return {
          width: '75vw',
          maxWidth: '100vw',
        };
      } else {
        return {
          width: '50vw',
          maxWidth: '100vw',
        };
      }
    }
  }

  created() {
    this.myDialogParams = Object.assign(cloneDeep(DEFAULT_OPTION), cloneDeep(this.option));
    this.bakParams = cloneDeep(this.option.params);
    this.prevOption = cloneDeep(this.option);
    if (this.myDialogParams.persistent) {
      this.$watch(
        () => this.myDialogParams.params,
        (newVal) => {
          const keys = Object.keys(newVal);
          this.myDialogParams.persistent = keys.some((key) => {
            if (!newVal[key]) {
              return false;
            }
            if (typeof newVal[key] === 'object') {
              return Object.keys(newVal[key]).some((k) => newVal[key][k]);
            }
            return newVal[key];
          });
        },
        { deep: true, immediate: true }
      );
    }
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  private bakParams = {};
  private prevOption: IOption | undefined;
  public myDialogParams = cloneDeep(DEFAULT_OPTION);

  /* event */
  public handleClickCancel() {
    if (this.myDialogParams.clickLoading) {
      return;
    }
    this.$nextTick(() => {
      this.$emit('close', { type: this.myDialogParams.dialogType });
      this.$refs[this.myDialogParams.id] && this.$refs[this.myDialogParams.id].resetValidation();
    });
  }

  public handleClickDialogConfirmButton() {
    if (!this.option.customConfirm) {
      this.$refs[this.myDialogParams.id].validate().then(async (valid: boolean) => {
        if (valid) {
          if (this.option.noTwiceConfirm) {
            this.$emit('confirm', { type: this.myDialogParams.dialogType });
          } else {
            const result = await this.$globalConfirm.show({
              title: this.$t('messages.tishi'),
              color: 'primary',
              content: this.$t('messages.areYouSure'),
              confirmButtonText: this.$t('action.confirm'),
            });
            if (result) {
              this.$emit('confirm', { type: this.myDialogParams.dialogType });
            }
          }
        }
      });
    } else {
      this.$emit('confirm', { type: this.myDialogParams.dialogType });
    }
  }

  public handlerBeforeHide() {
    this.myDialogParams.params = cloneDeep(this.bakParams);
    this.$emit('before-hide', {
      type: this.myDialogParams.dialogType,
      params: this.myDialogParams.params,
    });
    if (!this.myDialogParams.persistent) {
      this.$emit('close', { type: this.myDialogParams.dialogType });
    }
  }

  public validForm() {
    return Promise.resolve(this.$refs[this.myDialogParams.id].validate());
  }
}
</script>

<style lang="scss" scoped>
.body--dark {
  .my-dialog {
    background: #000000;
  }

  .title {
    .close {
      &:hover {
        color: #000000;
        background: #eeeeee;
      }
    }
  }

  .actions {
    background: #000000;
  }

  .loading-mask {
    background: rgba(255, 255, 255, 0.7);
  }
}

.body--light {
  .my-dialog {
    background: #ffffff;
  }

  .title {
    .close {
      &:hover {
        background: var(--my-grey-1);
      }
    }
  }

  .actions {
    background: #ffffff;
  }

  .loading-mask {
    background: rgba(0, 0, 0, 0.3);
  }
}

.my-dialog {
  border-radius: 4px !important;

  &.right-panel {
    border-radius: 0 !important;
  }

  display: flex;
  flex-direction: column;

  .title {
    font-size: 16px;
    padding: 16px;
    position: relative;
  }

  &.right-panel {
    border-radius: 0 !important;
    .title {
      padding: 16px 24px;
    }
  }

  .content {
    padding: 16px;

    &.q-pa-lg {
      padding: 16px 24px !important;
    }
  }

  .actions {
    width: 100%;
    margin-top: auto;
  }

  .loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>