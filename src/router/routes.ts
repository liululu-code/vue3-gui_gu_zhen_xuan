const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/components/login/Login.vue'),
        meta: {
            title: '登录',
            show: false,
            logo: 'Female',
        }
    },
    {
        path: '/',
        name: 'layout',
        component: () => import('@/components/layout/Layout.vue'),
        meta: {
            title: 'layout',
            show: true,
            logo: 'Female',
            hideOnBreadcrumb: true
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/components/layout/content/home/Home.vue'),
                meta: {
                    title: '首页',
                    show: true,
                    logo: 'Female',
                }
            },
        ]
    },
    {
        path: '/screen',
        name: 'screen',
        component: () => import('@/components/layout/screen/index.vue'),
        meta: {
            title: '数据大屏',
            show: true,
            logo: 'Female',
        }
    },
    {
        path: '/acl',
        name: 'acl',
        component: () => import('@/components/layout/Layout.vue'),
        meta: {
            title: '权限管理',
            show: true,
            logo: 'Female',
            
        },
        children: [
            {
                path: '/acl/user',
                name: 'user',
                component: () => import('@/components/layout/content/acl/user/User.vue'),
                meta: {
                    title: '用户管理',
                    show: true,
                    logo: 'Female',
                }
            },
            {
                path: '/acl/role',
                name: 'role',
                component: () => import('@/components/layout/content/acl/role/Role.vue'),
                meta: {
                    title: '角色管理',
                    show: true,
                    logo: 'Female',
                }
            },
            {
                path: '/acl/menu',
                name: 'menu',
                component: () => import('@/components/layout/content/acl/menu/Menu.vue'),
                meta: {
                    title: '菜单管理',
                    show: true,
                    logo: 'Female',
                }
            },
        ]
    },
    {
        path: '/goods',
        name: 'goods',
        component: () => import('@/components/layout/Layout.vue'),
        meta: {
            title: '商品管理',
            show: true,
            logo: 'Female',
            
        },
        children: [
            {
                path: '/goods/brand',
                name: 'brand',
                component: () => import('@/components/layout/content/goods/brand/Brand.vue'),
                meta: {
                    title: '品牌管理',
                    show: true,
                    logo: 'Female',
                    
                }
            },
            {
                path: '/goods/attribution',
                name: 'attribution',
                component: () => import('@/components/layout/content/goods/attribution/Attribution.vue'),
                meta: {
                    title: '属性管理',
                    show: true,
                    logo: 'Female',
                }
            },
            {
                path: '/goods/spu',
                name: 'spu',
                component: () => import('@/components/layout/content/goods/spu/Spu.vue'),
                meta: {
                    title: 'spu管理',
                    show: true,
                    logo: 'Female',
                }
            },
            {
                path: '/goods/sku',
                name: 'sku',
                component: () => import('@/components/layout/content/goods/sku/index.vue'),
                meta: {
                    title: 'sku管理',
                    show: true,
                    logo: 'Female',
                }
            },
        ]
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404/index.vue'),
        meta: {
            title: '404',
            show: false,
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'any',
        redirect: '/404',
        meta: {
            title: 'any',
            show: false,
        }
    }
]
export default constantRoutes