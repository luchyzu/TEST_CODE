export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  // {
  //   name: 'demo',
  //   icon: 'table',
  //   path: '/demo',
  //   component: './ChartsDemo',
  // },
  // {
  //   name: 'leaflet',
  //   icon: 'table',
  //   path: '/leaflet',
  //   component: './Leaflet',
  // },
  // {
  //   name: 'MapDemo',
  //   icon: 'table',
  //   path: '/MapDemo',
  //   component: './MapDemo',
  // },
  // {
  //   name: 'VideoPoint',
  //   icon: 'table',
  //   path: '/VideoPoint',
  //   component: './VideoPoint',
  // },
  // {
  //   name: 'ThreeJs',
  //   icon: 'table',
  //   path: '/ThreeJs',
  //   // layout: false,
  //   component: './ThreeJs',
  // },
  // {
  //   name: 'three1',
  //   icon: 'table',
  //   path: '/three1',
  //   component: './ThreeJs/three1',
  // },
  // {
  //   name: 'qiankunMap',
  //   icon: 'table',
  //   path: '/qiankunMap',
  //   component: './qiankunMap',
  //   routes: [
  //     {
  //       path: '/qiankunMap',
  //     },
  //     {
  //       path: '/qiankunMap/*',
  //     },
  //   ],
  // },
  // {
  //   name: 'Map',
  //   icon: 'book',
  //   path: 'data-map',
  //   routes: [
  //     {
  //       name: 'Map2',
  //       path: '*',
  //       component: './qiankunMap',
  //     },
  //   ],
  // },
  // {
  //   name: '组件',
  //   icon: 'table',
  //   path: '/zujian',
  //   routes: [
  //     {
  //       name: '轮播图',
  //       icon: 'table',
  //       path: '/zujian/lunbo',
  //       component: './Zujian/lunbo',
  //     },
  //   ],
  // },
  {
    name: 'ThreeJs',
    icon: 'table',
    path: '/ThreeJs',
    // layout: false,
    component: './ThreeJs',
  },
  {
    name: 'three1',
    icon: 'table',
    path: '/three1',
    component: './ThreeJs/three1',
  },
  {
    name: 'qiankunMap',
    icon: 'table',
    path: '/qiankunMap',
    component: './qiankunMap',
    routes: [
      {
        path: '/qiankunMap',
      },
      {
        path: '/qiankunMap/*',
      },
    ]
  },
  {
    name: 'Map',
    icon: 'book',
    path: 'data-map',
    routes: [
      {
        name: 'Map2',
        path: '*',
        component: './qiankunMap',
      },
    ],
  },
  {
    name: '组件',
    icon: 'table',
    path: '/zujian',
    routes: [
      {
        name: '轮播图',
        icon: 'table',
        path: '/zujian/lunbo',
        component: './Zujian/lunbo',
      }
    ]
  },
  {
    name: 'Earthsdk3',
    icon: 'table',
    path: '/earthsdk3',
    component: './Earthsdk3',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
