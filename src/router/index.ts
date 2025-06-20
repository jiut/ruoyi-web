import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'
import mjlayout from '@/views/mj/layout.vue'
import lumalayout from '@/views/luma/layout.vue'
import storelayout from '@/views/store/layout.vue'
import pptlayout from '@/views/ppt/layout.vue'
import musiclayout from '@/views/suno/layout.vue'
import knowledgelayout from '@/views/knowledge/layout.vue'
import talentlayout from '@/views/talent/layout.vue'

const routes: RouteRecordRaw[] = [
  // 首页
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/AllianceHome.vue'),
  },
  // Chat 模块
  {
    path: '/chat',
    name: 'ChatRoot',
    component: ChatLayout,
    children: [
      {
        path: ':uuid?',
        name: 'Chat',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },

   {
    path: '/m',
    name: 'm',
    component: ChatLayout,
    redirect: '/m/gpt-3.5-turbo',
    children: [
      {
        path: '/m/:gid',
        name: 'Model',
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },

  {

    path: '/draw',
    name: 'Rootdraw',
    component: mjlayout,
    redirect: '/draw/index',
    children: [
      {
        path: '/draw/:uuid?',
        name: 'draw',
        component: () => import('@/views/mj/draw.vue'),
      },
    ],
  },

  {
		path: "/ppt",
		name: "Ppt",
		component: pptlayout,
		redirect: "/ppt/index",
		children: [
			{
				path: "index",
				name: "ppt",
				component: () => import('@/views/ppt/ppt.vue'),
			},
		],
	},

  {
    path: '/video',
    name: 'Video',
    component: lumalayout,
    redirect: '/video/index',
    children: [
      {
        path: '/video/:uuid?',
        name: 'video',
        component: () => import('@/views/luma/video.vue'),
      },
    ],
  },

	{
		path: "/music",
		name: "Music",
		component: musiclayout,
		redirect: "/music/index",
		children: [
			{
				path: "/music/:uuid?",
				name: "music",
				component: () => import('@/views/suno/music.vue'),
			},
		],
	},

  {
    path: '/store',
    name: 'Store',
    component: storelayout,
    redirect: '/store/t',
    children: [
      {
        path: 't',
        name: 'store',
        component: () => import('@/views/store/appList.vue'),
      },
    ],
  },


  {
    path: '/knowledge',
    name: 'Knowledge',
    component: knowledgelayout,
    redirect: '/knowledge/t',
    children: [
      {
        path: 't',
        name: 'knowledge1',
        component: () => import('@/views/knowledge/index.vue'),
      },
    ],
  },

  {
    path: '/annex',
    name: 'Annex',
    component: knowledgelayout,
    redirect: '/annex/t',
    children: [
      {
        path: 't',
        name: 'annex1',
        component: () => import('@/views/knowledge/annex.vue'),
      },
    ],
  },

  {
    path: '/fragment',
    name: 'Fragment',
    component: knowledgelayout,
    redirect: '/fragment/t',
    children: [
      {
        path: 't',
        name: 'fragment1',
        component: () => import('@/views/knowledge/fragment.vue'),
      },
    ],
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },

  {
    path: '/regist',
    name: 'regist',
    component: () => import('@/views/login/regist.vue'),
  },
  {
    path: '/resetpassword',
    name: 'resetpassword',
    component: () => import('@/views/login/reset.vue'),
  },

  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500/index.vue'),
  },

  // 人才模块
  {
    path: '/talent',
    name: 'TalentRoot',
    component: talentlayout,
    redirect: '/talent/works',
    children: [
      {
        path: 'works',
        name: 'Works',
        component: () => import('@/views/talent/works/index.vue'),
      },
      {
        path: 'works/:id',
        name: 'WorkDetail',
        component: () => import('@/views/talent/works/detail.vue'),
      },
      {
        path: 'schools',
        name: 'Schools',
        component: () => import('@/views/talent/schools/index.vue'),
      },
      {
        path: 'schools/:id',
        name: 'SchoolDetail',
        component: () => import('@/views/talent/schools/detail.vue'),
      },
      {
        path: 'jobs',
        name: 'Jobs',
        component: () => import('@/views/talent/jobs/index.vue'),
      },
      {
        path: 'jobs/:id',
        name: 'JobDetail',
        component: () => import('@/views/talent/jobs/detail.vue'),
      },
      {
        path: 'designers',
        name: 'Designers',
        component: () => import('@/views/talent/designers/index.vue'),
      },
      {
        path: 'designers/:id',
        name: 'DesignerDetail',
        component: () => import('@/views/talent/designers/detail.vue'),
      },
    ],
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

setupPageGuard(router)

export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
