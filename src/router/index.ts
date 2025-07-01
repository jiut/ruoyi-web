import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupPageGuard } from './permission'
import { ChatLayout } from '@/views/chat/layout'
import mjlayout from '@/views/mj/layout.vue'
import lumalayout from '@/views/luma/layout.vue'
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
    component: () => import('@/views/talent/layout.vue'),
    redirect: '/talent/jobs',
    children: [
      {
        path: 'jobs',
        name: 'Jobs',
        component: () => import('@/views/talent/jobs/index.vue'),
        meta: { title: '企业需求池' }
      },
      {
        path: 'jobs/:id',
        name: 'JobDetail',
        component: () => import('@/views/talent/jobs/detail.vue'),
        meta: { title: '岗位详情' }
      },
      {
        path: 'designers',
        name: 'Designers',
        component: () => import('@/views/talent/designers/index.vue'),
        meta: { title: '设计师档案' }
      },
      {
        path: 'designers/:id',
        name: 'DesignerDetail',
        component: () => import('@/views/talent/designers/detail.vue'),
        meta: { title: '设计师详情' }
      },
      // {
      //   path: 'works',
      //   name: 'Works',
      //   component: () => import('@/views/talent/works/index.vue'),
      //   meta: { title: '学生作品库' }
      // },
      // {
      //   path: 'works/:id',
      //   name: 'WorkDetail',
      //   component: () => import('@/views/talent/works/detail.vue'),
      //   meta: { title: '作品详情' }
      // },
      {
        path: 'schools',
        name: 'Schools',
        component: () => import('@/views/talent/schools/index.vue'),
        meta: { title: '院校数据库' }
      },
      {
        path: 'schools/:id',
        name: 'SchoolDetail',
        component: () => import('@/views/talent/schools/detail.vue'),
        meta: { title: '院校详情' }
      },
      // {
      //   path: 'profile',
      //   name: 'Profile',
      //   redirect: '/talent/profile/designer',
      //   children: [
      //     {
      //       path: 'designer',
      //       name: 'DesignerProfile',
      //       component: () => import('@/views/talent/profile/designer.vue'),
      //       meta: { title: '设计师档案' }
      //     },
      //     {
      //       path: 'enterprise',
      //       name: 'EnterpriseProfile',
      //       component: () => import('@/views/talent/profile/enterprise.vue'),
      //       meta: { title: '企业档案' }
      //     },
      //     {
      //       path: 'school',
      //       name: 'SchoolProfile',
      //       component: () => import('@/views/talent/profile/school.vue'),
      //       meta: { title: '院校档案' }
      //     }
      //   ]
      // }
    ]
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
