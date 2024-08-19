import { loadCityJson, loadProvinceJson } from 'src/api/map';
import { i18n } from 'src/boot/i18n';
import settings from 'src/setting.json';
import { getLanguage, setLanguage } from 'src/utils/cookie';
import { getSidebarStatus, setSidebarStatus } from 'src/utils/localStorage';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '../index';

export enum DeviceType {
  Mobile,
  Desktop,
}
interface ISidebar {
  opened: boolean;
  withoutAnimation: boolean;
}
@Module({ dynamic: true, namespaced: true, store, name: 'App' })
class App extends VuexModule {
  public language = getLanguage() || settings.language;
  public sidebar: ISidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false,
  };
  public device: DeviceType = DeviceType.Desktop;
  public refreshPage = true;
  public toolTipClass = '';
  public dialogVisible = false;
  public appMainIsScroll = false;

  @Mutation
  public SET_TOOL_TIP_CLASS(className: string) {
    this.toolTipClass = className;
  }
  @Mutation
  public SET_REFRESH_PAGE(status: any) {
    this.refreshPage = status;
  }
  @Mutation
  public SET_LANGUAGE(status: any) {
    this.language = status;
    setLanguage(status);
  }

  @Mutation
  public SET_DIALOG_VISIBLE(value: boolean) {
    this.dialogVisible = value;
  }

  @Mutation
  public TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened;
    this.sidebar.withoutAnimation = withoutAnimation;
    if (this.sidebar.opened) {
      setSidebarStatus('opened');
    } else {
      setSidebarStatus('closed');
    }
  }
  @Mutation
  public CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false;
    this.sidebar.withoutAnimation = withoutAnimation;
    setSidebarStatus('closed');
  }
  @Mutation
  public TOGGLE_DEVICE(value: DeviceType) {
    this.device = value;
  }

  @Mutation
  public SET_APP_MAIN_IS_SCROLL(value: boolean) {
    this.appMainIsScroll = value;
  }

  @Action({ rawError: true })
  public refreshCurPage() {
    this.SET_REFRESH_PAGE(false);
    setTimeout(() => {
      this.SET_REFRESH_PAGE(true);
    }, 100);
  }
  @Action({ rawError: true })
  public async loadProvinceJson(data: any) {
    const result = await loadProvinceJson(data);
    return Promise.resolve(result);
  }
  @Action({ rawError: true })
  public async loadCityJson(data: any) {
    const result = await loadCityJson(data);
    return Promise.resolve(result);
  }
}

export const AppModule = getModule(App);
