<template>
  <div>
    <div class="login-root">
      <div class="box-root flex-flex flex-direction--column" style="min-height: 100vh; flex-grow: 1">
        <div class="loginbackground padding-top--64">
          <div class="loginbackground-gridContainer">
            <div class="box-root flex-flex" style="grid-area: top / start / 8 / end">
              <div class="box-root" style="background-image: linear-gradient(white 0%, rgb(247, 250, 252) 33%); flex-grow: 1"></div>
            </div>
            <div class="box-root flex-flex" style="grid-area: 4 / 2 / auto / 5">
              <div class="box-root box-divider--light-all-2 animationLeftRight tans3s" style="flex-grow: 1"></div>
            </div>
            <div class="box-root flex-flex" style="grid-area: 6 / start / auto / 2">
              <div class="box-root box-background--blue800" style="flex-grow: 1"></div>
            </div>
            <div class="box-root flex-flex" style="grid-area: 7 / start / auto / 4">
              <div class="box-root box-background--blue animationLeftRight" style="flex-grow: 1"></div>
            </div>
            <div class="box-root flex-flex" style="grid-area: 8 / 4 / auto / 6">
              <div class="box-root box-background--gray100 animationLeftRight tans3s" style="flex-grow: 1"></div>
            </div>
            <div class="box-root flex-flex" style="grid-area: 2 / 15 / auto / end">
              <div class="box-root box-background--cyan200 animationRightLeft tans4s" style="flex-grow: 1"></div>
            </div>
            <div class="box-root flex-flex" style="grid-area: 3 / 14 / auto / end">
              <div class="box-root box-background--blue animationRightLeft" style="flex-grow: 1"></div>
            </div>
            <div class="box-root flex-flex" style="grid-area: 4 / 17 / auto / 20">
              <div class="box-root box-background--gray100 animationRightLeft tans4s" style="flex-grow: 1"></div>
            </div>
            <div class="box-root flex-flex" style="grid-area: 5 / 14 / auto / 17">
              <div class="box-root box-divider--light-all-2 animationRightLeft tans3s" style="flex-grow: 1"></div>
            </div>
          </div>
        </div>
        <div class="box-root padding-top--24 flex-flex flex-direction--column" style="flex-grow: 1; z-index: 9">
          <div class="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
            <h3 class="text-primary bg-gradient-primary text-gradient">
              {{ PrdTitle }}
            </h3>
          </div>
          <div class="formbg-outer">
            <div class="formbg">
              <div class="formbg-inner padding-horizontal--48">
                <span class="padding-bottom--15">Sign in to your account</span>
                <form id="stripe-login">
                  <div class="field padding-bottom--24">
                    <label for="email">Username</label>
                    <input type="text" name="email" autocapitalize="off" v-model="username" autocomplete="new-password" />
                  </div>
                  <div class="field padding-bottom--24">
                    <div class="grid--50-50">
                      <label for="password">Password</label>
                      <div class="reset-pass">
                        <a href="#">Forgot your password?</a>
                      </div>
                    </div>
                    <input type="text" name="password" class="input-password" v-model="password" autocapitalize="off" autocomplete="new-password" />
                  </div>
                  <div class="field padding-bottom--24" v-show="useVerifyCode">
                    <label for="verifyCode">Code</label>
                    <div class="flex justify-between">
                      <input type="text" name="verifyCode" v-model="verifyCode" autocapitalize="off" style="width: 55%; height: 100%" autocomplete="new-password" />
                      <div id="verify-code-login" style="width: 40%; height: 44px"></div>
                    </div>
                  </div>
                  <div class="field field-checkbox padding-bottom--24 flex-flex align-center">
                    <label for="checkbox" @click="useSwipeVerifyCode = !useSwipeVerifyCode">
                      <input type="checkbox" name="checkbox" v-model="useSwipeVerifyCode" />
                      Use swipe verification code to verify?
                    </label>
                  </div>
                  <div class="field field-checkbox padding-bottom--24 flex-flex align-center">
                    <label for="checkbox" @click="useVerifyCode = !useVerifyCode">
                      <input type="checkbox" name="checkbox" v-model="useVerifyCode" />
                      Use verification code to verify?
                    </label>
                  </div>
                  <div class="field padding-bottom--24">
                    <div class="login-submit-button bg-gradient-primary" @click.prevent="handLogin" v-ripple>Login</div>
                  </div>
                  <div class="field">
                    <a class="ssolink" href="#">Use single sign-on (Google) instead</a>
                  </div>
                </form>
              </div>
            </div>
            <div class="footer-link padding-top--24">
              <span>
                Don't have an account?
                <a href="#">Sign up</a>
              </span>
              <div class="listing padding-top--24 padding-bottom--24 flex-flex center-center">
                <span>
                  <a href="https://dirkhe1051931999.github.io/quasar/" target="__blank" class="bg-gradient-primary text-gradient">vue2 with quasar and use vue-class-decorator</a>
                </span>
                <q-icon name="arrow_forward_ios" class="text-h6 text-primary bg-gradient-primary text-gradient"></q-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="showUseSwipeVerifyCode" class="useSwipeVerifyCode">
      <q-card>
        <q-card-section>
          <div class="text-h6">Use swipe verification code to verify</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div id="captcha"></div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-facing-decorator';
import setting from 'src/setting.json';
import { UserModule } from 'src/store/modules/user';
import { Dictionary } from 'lodash';
import { GVerify } from 'src/utils/canvas_verify_code';
import { sliderCaptcha } from 'src/utils/slidercaptcha';
import { sleep } from 'src/utils/tools';

@Component({ name: 'LoginPage' })
export default class LoginPage extends Vue {
  @Watch('$route', { immediate: true })
  private onRouteChange(route: any) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>;
    if (query) {
      this.redirect = query.redirect;
      this.otherQuery = this.getOtherQuery(query);
    }
  }

  created() {}

  mounted() {
    try {
      this.verifyCodeInstance = new GVerify('verify-code-login');
    } catch (error) {
      console.log(error);
    }
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur];
      }
      return acc;
    }, {} as Dictionary<string>);
  }

  private verifyCodeInstance: any;
  private otherQuery: Dictionary<string> = {};
  private username = 'admin';
  private password = '123456';
  private verifyCode = '';
  private redirect?: string;
  private PrdTitle = setting.title;
  private useVerifyCode = false;
  private useSwipeVerifyCode = false;
  private showUseSwipeVerifyCode = false;
  private lockShowUseSwipeVerifyCode = false;

  private async handLogin() {
    let verifyCodeResult = true;
    if (this.useVerifyCode) {
      verifyCodeResult = this.verifyCodeInstance.validate(this.verifyCode);
    }
    if (!verifyCodeResult) {
      this.$globalMessage.show({
        type: 'error',
        content: 'Wrong verification code',
      });
      return;
    }
    const loginSuccess = async () => {
      this.$q.loading.show();
      await UserModule.Login({
        username: this.username,
        password: this.password,
      });
      this.$q.loading.hide();
      this.useSwipeVerifyCode = false;
      this.useVerifyCode = false;
      this.$globalMessage.show({
        type: 'success',
        content: this.$t('messages.success'),
      });
      await sleep(500);
      location.reload();
    };
    if (this.useSwipeVerifyCode) {
      if (!this.lockShowUseSwipeVerifyCode) {
        this.lockShowUseSwipeVerifyCode = true;
        this.showUseSwipeVerifyCode = true;
        var captcha = new sliderCaptcha(document.querySelector('#captcha'), {
          id: 'captcha',
          onSuccess: () => {
            var handler = setTimeout(() => {
              this.showUseSwipeVerifyCode = false;
              this.lockShowUseSwipeVerifyCode = false;
              window.clearTimeout(handler);
              captcha.reset();
              loginSuccess();
            }, 500);
          },
        });
      }
    } else {
      loginSuccess();
    }
  }
}
</script>

<style lang="scss">
.body--dark {
  .slider {
    box-shadow: 0 0 3px rgba($color: #ffffff, $alpha: 0.4);
  }
}

.body--light {
  .slider {
    box-shadow: 0 0 3px rgba($color: #000000, $alpha: 0.4);
  }
}

.slidercaptcha-block {
  position: absolute;
  left: 0;
  top: 0;
}

.sliderContainer {
  position: relative;
  text-align: center;
  line-height: 40px;
  background: var(--my-grey-7);
  border-radius: 2px;
}

.sliderbg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background-color: var(--my-grey-7);
  height: 40px;
}

.sliderContainer_success .slider {
  background-color: $teal-4;
}

.sliderContainer_success .sliderMask {
  background-color: $teal-2;
}

.sliderContainer_fail .slider {
  background: $red-11 !important;
}

.sliderContainer_fail .sliderMask {
  background: $red-3 !important;
}

.sliderContainer_fail .slider,
.sliderContainer_success .slider {
  color: var(--my-white);
}

.sliderContainer_active .sliderText,
.sliderContainer_success .sliderText,
.sliderContainer_fail .sliderText {
  display: none;
}

.sliderMask {
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  background: $light-blue-2;
  border-radius: 2px;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  background: var(--my-white);
  cursor: pointer;
  transition: background 0.1s linear;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider:hover {
  background: $light-blue-5;
  color: var(--my-white);
}

.sliderText {
  position: relative;
}

.refreshIcon {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  color: $grey;
  font-size: 14px;
  z-index: 5;
  transition: color 0.3s linear;
}

.refreshIcon:hover {
  color: var(--my-dark-1);
}
</style>
<style lang="scss" scoped>
@import './index.scss';

.useSwipeVerifyCode {
  position: absolute;
  width: 320px;
  height: 310px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>