import { RouteConfig } from 'vue-router';
import Layout from '@/layouts/index.vue';
/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:
  meta: {
    pagePermissionId              页面权限的id, -1就是管理员才有的权限 ,父包含子的所有权限，父子路由都要有
    modify                        是否可编辑
    title: 'title'               子菜单和面包屑中显示的名称（推荐设置）
    icon: 'svg-name'             侧栏中显示的图标
    hidden: true                 if true, 此路由不会显示在侧边栏中（默认为false）
                                 if false, 当子路径少于或等于一个时，隐藏根菜单
    breadcrumb: false            if false, 该项目将隐藏在面包屑中（默认为true）
    tag: false                   if false, 该项目将隐藏在tag中（默认为true）
    root: true                  if true,是否是根节点，默认固定根节点
    nested:false                if true 是嵌套目录
    fatherPath:'nested/1'      配合nested去跳转页面，参考nested目录，最多支持3级嵌套
  }
*/

export const constantRoutes: RouteConfig[] = [
  {
    path: '*',
    redirect: '/middleware',
    meta: { hidden: true },
  },
  {
    path: '/middleware',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        name: 'middleware',
        meta: {
          breadcrumb: false,
        },
        component: () => import(/* webpackChunkName: "middleware" */ 'pages/middleware/index.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ 'pages/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/dashboard',
    component: Layout,
    meta: {
      pagePermissionId: ['-1', '1'],
    },
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'home',
          affix: true,
          pagePermissionId: ['-1', '1'],
        },
        component: () => import(/* webpackChunkName: "dashboard" */ 'pages/dashboard/index.vue'),
      },
    ],
  },
  {
    path: '/account',
    component: Layout,
    meta: {
      pagePermissionId: ['-1', '1'],
    },
    children: [
      {
        path: 'index',
        name: 'Account',
        meta: {
          title: 'account',
          icon: 'people',
        },
        component: () => import(/* webpackChunkName: "account" */ 'pages/account/index.vue'),
      },
    ],
  },
  {
    path: '/charts',
    component: Layout,
    meta: {
      title: 'charts',
      icon: 'bar_chart',
      pagePermissionId: ['-1', '1'],
    },
    children: [
      {
        path: 'columnLine',
        name: 'ColumnLine',
        meta: {
          title: 'columnLine',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "columnLine" */ 'pages/charts/columnLine.vue'),
      },
      {
        path: 'funnel',
        name: 'Funnel',
        meta: {
          title: 'funnel',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "funnel" */ 'pages/charts/funnel.vue'),
      },
      {
        path: 'line',
        name: 'Line',
        meta: {
          title: 'line',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "line" */ 'pages/charts/line.vue'),
      },
      {
        path: 'relationship',
        name: 'Relationship',
        meta: {
          title: 'relationship',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "line" */ 'pages/charts/relationship.vue'),
      },
      {
        path: 'map',
        name: 'Map',
        meta: {
          title: 'map',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "map" */ 'pages/charts/map.vue'),
      },
      {
        path: 'province',
        name: 'Province',
        meta: {
          title: 'province',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "province" */ 'pages/charts/province.vue'),
      },
      {
        path: 'city',
        name: 'City',
        meta: {
          title: 'city',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "city" */ 'pages/charts/city.vue'),
      },
    ],
  },
  {
    path: '/components',
    component: Layout,
    meta: { title: 'components', icon: 'extension', pagePermissionId: ['-1', '1'] },
    children: [
      {
        path: 'editer',
        name: 'Editer',
        meta: {
          title: 'editer',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "editer" */ 'pages/components/editer.vue'),
      },
      {
        path: 'md',
        name: 'Md',
        meta: {
          title: 'md',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "md" */ 'pages/components/md.vue'),
      },
      {
        path: 'splitter',
        name: 'Splitter',
        meta: {
          title: 'splitter',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "splitter" */ 'pages/components/splitter.vue'),
      },
      {
        path: 'jsonEditor',
        name: 'JsonEditor',
        meta: {
          title: 'jsonEditor',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "jsonEditor" */ 'pages/components/jsonEditor.vue'),
      },
      {
        path: 'tabs',
        name: 'Tabs',
        meta: {
          title: 'tabs',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "tabs" */ 'pages/components/tabs.vue'),
      },
      {
        path: 'sticky',
        name: 'Sticky',
        meta: {
          title: 'sticky',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "sticky" */ 'pages/components/sticky.vue'),
      },
      {
        path: 'dialog',
        name: 'Dialog',
        meta: {
          title: 'dialog',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "dialog" */ 'pages/components/dialog.vue'),
      },
      {
        path: 'carousel',
        name: 'Carousel',
        meta: {
          title: 'carousel',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "carousel" */ 'pages/components/carousel.vue'),
      },
      {
        path: 'colorPicker',
        name: 'ColorPicker',
        meta: {
          title: 'colorPicker',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "colorPicker" */ 'pages/components/colorPicker.vue'),
      },
      {
        path: 'skeleton',
        name: 'Skeleton',
        meta: {
          title: 'skeleton',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "skeleton" */ 'pages/components/skeleton.vue'),
      },
      {
        path: 'spinners',
        name: 'Spinners',
        meta: {
          title: 'spinners',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "spinners" */ 'pages/components/spinners.vue'),
      },
      {
        path: 'notice',
        name: 'Notice',
        meta: {
          title: 'notice',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "notice" */ 'pages/components/notice.vue'),
      },
      {
        path: 'transfer',
        name: 'Transfer',
        meta: {
          title: 'transfer',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "notice" */ 'pages/components/transfer.vue'),
      },
      {
        path: 'parallax',
        name: 'Parallax',
        meta: {
          title: 'parallax',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "notice" */ 'pages/components/parallax.vue'),
      },
      {
        path: 'colors',
        name: 'Colors',
        meta: {
          title: 'colors',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "notice" */ 'pages/components/color.vue'),
      },
    ],
  },
  {
    path: '/copy',
    component: Layout,
    meta: { pagePermissionId: ['-1', '1'] },
    children: [
      {
        path: 'index',
        name: 'Copy',
        meta: {
          title: 'copy',
          icon: 'content_cut',
        },
        component: () => import(/* webpackChunkName: "copy" */ 'pages/copy/index.vue'),
      },
    ],
  },
  {
    path: '/i18n',
    component: Layout,
    meta: { pagePermissionId: ['-1', '1'] },
    children: [
      {
        path: 'index',
        name: 'I18n',
        meta: {
          title: 'i18n',
          icon: 'g_translate',
        },
        component: () => import(/* webpackChunkName: "i18n" */ 'pages/i18n/index.vue'),
      },
    ],
  },
  {
    path: '/icon',
    component: Layout,
    meta: { pagePermissionId: ['-1', '1'] },
    children: [
      {
        path: 'index',
        name: 'Icon',
        meta: {
          title: 'icon',
          icon: 'face',
        },
        component: () => import(/* webpackChunkName: "icon" */ 'pages/icon/index.vue'),
      },
    ],
  },
  {
    path: '/table',
    component: Layout,
    meta: {
      pagePermissionId: ['-1', '1'],
      title: 'table',
      icon: 'table_chart',
    },
    children: [
      {
        path: 'index',
        name: 'table-index',
        meta: {
          title: 'table-index',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "table-index" */ 'pages/table/index.vue'),
      },
      {
        path: 'standard',
        name: 'table-standard',
        meta: {
          title: 'table-standard',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "table-standard" */ 'pages/table/standard.vue'),
      },
      {
        path: 'beta',
        name: 'table-beta',
        meta: {
          title: 'table-beta',
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "table-beta" */ 'pages/table/beta.vue'),
      },
    ],
  },
  {
    path: '/convert',
    component: Layout,
    meta: {
      pagePermissionId: ['-1', '1'],
    },
    children: [
      {
        path: 'index',
        name: 'Convert',
        meta: {
          title: 'convert',
          icon: 'code',
        },
        component: () => import(/* webpackChunkName: "convert" */ 'pages/convert/index.vue'),
      },
    ],
  },
  {
    path: '/nested',
    component: Layout,
    meta: {
      title: 'nested',
      pagePermissionId: ['-1', '1'],
      icon: 'format_align_center',
    },
    children: [
      {
        path: '1',
        name: 'nested1',
        meta: {
          title: 'nested1',
          pagePermissionId: ['-1', '1'],
          nested: true,
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "nested1" */ 'pages/nested/nested1/index.vue'),
        children: [
          {
            path: '1',
            name: 'nested1_1',
            meta: {
              title: 'nested1_1',
              icon: 'bookmark',
              fatherPath: '/nested/1',
              pagePermissionId: ['-1', '1'],
            },
            component: () => import(/* webpackChunkName: "nested1_1" */ 'pages/nested/nested1/1.vue'),
          },
          {
            path: '2',
            name: 'nested1_2',
            meta: {
              title: 'nested1_2',
              icon: 'bookmark',
              fatherPath: '/nested/1',
              pagePermissionId: ['-1', '1'],
            },
            component: () => import(/* webpackChunkName: "nested1_2" */ 'pages/nested/nested1/2.vue'),
          },
        ],
      },
      {
        path: '2',
        name: 'nested2',
        meta: {
          pagePermissionId: ['-1', '1'],
          title: 'nested2_1',
          nested: true,
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "nested2" */ 'pages/nested/nested2/index.vue'),
      },
      {
        path: '3',
        name: 'nested3',
        meta: {
          title: 'nested3',
          pagePermissionId: ['-1', '1'],
          nested: true,
          icon: 'label',
        },
        component: () => import(/* webpackChunkName: "nested3" */ 'pages/nested/nested3/index.vue'),
        children: [
          {
            path: '1',
            name: 'nested3_1',
            meta: {
              title: 'nested3_1',
              icon: 'bookmark',
              fatherPath: '/nested/3',
              pagePermissionId: ['-1', '1'],
            },
            component: () => import(/* webpackChunkName: "nested3_1" */ 'pages/nested/nested3/1.vue'),
          },
          {
            path: '2',
            name: 'nested3_2',
            meta: {
              title: 'nested3_2',
              icon: 'bookmark',
              fatherPath: '/nested/3',
              pagePermissionId: ['-1', '1'],
            },
            component: () => import(/* webpackChunkName: "nested3_2" */ 'pages/nested/nested3/2.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/profile',
    component: Layout,
    meta: {
      hidden: true,
      pagePermissionId: ['-1', '1'],
    },
    children: [
      {
        path: 'index',
        name: 'Profile',
        meta: {
          title: 'profile',
          icon: 'accessibility',
        },
        component: () => import(/* webpackChunkName: "profile" */ 'pages/profile/index.vue'),
      },
    ],
  },
];
/**
 * 有权限限制
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes: RouteConfig[] = [
  {
    path: '/auth',
    component: Layout,
    meta: {
      title: 'auth',
      icon: 'remove_from_queue',
      pagePermissionId: ['-1', '1', '2'],
      opened: false,
    },
    children: [
      {
        path: 'a',
        name: 'label',
        meta: {
          title: 'authA',
          icon: 'label',
          pagePermissionId: ['-1', '1'],
        },
        component: () => import(/* webpackChunkName: "authA" */ 'pages/auth/a.vue'),
      },
      {
        path: 'b',
        name: 'AuthB',
        meta: {
          title: 'authB',
          icon: 'label',
          pagePermissionId: ['-1', '2'],
        },
        component: () => import(/* webpackChunkName: "authB" */ 'pages/auth/b.vue'),
      },
    ],
  },
];
