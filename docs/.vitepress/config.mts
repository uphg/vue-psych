import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/vue-psych/',
  title: "Vue Psych",
  description: "Psychological experiment process components, implemented with Vue.",
  locales: {
    root: {
      label: 'English',
      title: "Vue Psych",
      description: "Psychological experiment process components, implemented with Vue.",
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
        ],
        sidebar: [
          { text: 'Getting Started', link: '/' },
          { text: 'API Examples', link: '/api' },
          { text: 'Plugins', link: '/plugins' }
        ],
      }
    },
    zh: {
      link: '/zh/',
      label: '简体中文',
      title: 'Vue Psych',
      description: '一个心理实验流程组件，使用 Vue 实现。',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' }
        ],
        sidebar: [
          { text: '快速开始', link: '/zh/' },
          { text: 'API', link: '/zh/api' },
          { text: '插件', link: '/zh/plugins' }
        ],
      }
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/uphg/vue-psych' }
    ]
  }
})
