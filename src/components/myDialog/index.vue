<template>
  <div>
    <q-dialog transition-show="jump-down" transition-hide="jump-up" v-model="myDialogParams.visible" persistent @before-hide="handlerBeforeHide">
      <q-card class="my-dialog" :style="calcMyDialogWidth">
        <div class="title f-bold q-pa-md text-h6">
          {{ myDialogParams.title }}
        </div>
        <div class="split-line h-1"></div>
        <div class="scroll content" style="max-height: 500px">
          <q-form :ref="myDialogParams.id">
            <slot />
          </q-form>
        </div>
        <div class="q-px-md q-pb-md">
          <slot name="extra-description" />
        </div>
        <div class="split-line h-1"></div>
        <div class="text-center q-pa-md row justify-end">
          <q-btn :label="$t(`action.cancel`)" :disable="myDialogParams.clickLoading" @click="handlerClickCancel()" outline color="primary" />
          <q-btn :label="$t(`action.confirm`)" color="primary" class="q-ml-md" @click="handlerClickDialogConfirmButton()" :loading="myDialogParams.clickLoading" v-show="myDialogParams.showConfirm" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { getCurrentInstance } from 'vue';
import { cloneDeep } from 'lodash';

interface IOption {
  id: string;
  dialogType: string;
  getDataLoading: boolean;
  clickLoading: boolean;
  visible: boolean;
  title: string;
  showConfirm: boolean;
  params: any;
  customComfirm: boolean;
  noTwiceConfirm: boolean;
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
  customComfirm: false,
  noTwiceConfirm: false,
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
      return {
        width: `${width}vw`,
      };
    }
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

  created() {
    this.myDialogParams = Object.assign(cloneDeep(DEFAULT_OPTION), cloneDeep(this.option));
    this.bakParams = cloneDeep(this.option.params);
    this.prevOption = cloneDeep(this.option);
  }

  private globals = getCurrentInstance()!.appContext.config.globalProperties;
  private bakParams = {};
  private prevOption: IOption | undefined;
  public myDialogParams = cloneDeep(DEFAULT_OPTION);

  /* event */
  public handlerClickCancel() {
    this.$nextTick(() => {
      this.$emit('close', { type: this.myDialogParams.dialogType });
      this.$refs[this.myDialogParams.id] && this.$refs[this.myDialogParams.id].resetValidation();
    });
  }

  public handlerClickDialogConfirmButton() {
    if (!this.option.customComfirm) {
      this.$refs[this.myDialogParams.id].validate().then(async (valid: boolean) => {
        if (valid) {
          if (this.option.noTwiceConfirm) {
            this.$emit('confirm', { type: this.myDialogParams.dialogType });
          } else {
            const result = await this.$globalConfirm.show({
              title: this.$t('messages.tishi'),
              color: 'primary',
              content: this.$t('messages.areYouSure'),
              confirmButtonText: this.$t('action.yes'),
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
  }

  public validForm() {
    this.$refs[this.myDialogParams.id].validate();
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
}

.my-dialog {
  border-radius: 12px;

  .title {
    padding: 16px;
    font-size: 16px;
    position: relative;
  }

  .content {
    padding: 16px;
  }
}
</style>