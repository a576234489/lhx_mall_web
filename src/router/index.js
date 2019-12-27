import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Layout from '../views/layout/Layout'

const constRouterMap = [
    {
        path:'/login',
        component:()=>import('@/views/login/index'),
        hidden:true //通过判断路由对象里面的hidden值选择是否渲染该路由入口，然而你在路由视图里面是无法通过$route.hidden来取得路由对象的hidden属性的，因为路由渲染的时候会把无关的字段忽略掉。说到底这个只是一个判断路由入口是否可见的开关而已，具体你可以找一下路由的组件渲染方式看一下
    },
    {
        path: '',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'home',
            component: () => import('@/views/home/index'),
            meta: {title: '首页', icon: 'home'}
        }]
    },
    {
        path:'/pms',
        component:Layout,
        redirect: '/pms/product',
        name:'pms',
        meta:{title:'商品',icon:'product'},
        children: [
            {
                path:'product',
                name:'product',
                component:()=>import('@/views/pms/product/index'),
                meta:{title:'商品列表',icon:'product-list'}
            },
            {
                path:'updateProduct',
                name:'updateProduct',
                component:()=>import('@/views/pms/product/update'),
                meta:{title:'修改商品',icon:'product-add'},
                hidden: true
            }
        ]
    }

]

const router = new Router({
    routes:constRouterMap,
    mode:'history',
    scrollBehavior:() => ({y: 0}),//当切换到新路由时,页面滚动位置设定
})

export default router;