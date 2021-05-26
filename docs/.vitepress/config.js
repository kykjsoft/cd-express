module.exports = {
    extraWatchFiles: [
      '.vuepress/**/*.js', // Relative path usage
      'component/**/*.md'   // Absolute path usage
    ],
    title: '组件库',
    description: '基于 Vue3/SVG 的组件库',
    lang: 'zh-Hans',
    themeConfig: {
        repo: 'configure-driver/cd-express',
        docsDir: 'docs',

        editLinks: false,
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '最后更新时间',
        

        nav: [
            { text: '首页', link: '/', activeMatch: '^/$|^/guide/' },
            {
                text: '配置',
                link: '/setting',
                activeMatch: '^/config/'
            },
            {
                text: '发布日志',
                link: 'https://github.com/vuejs/vitepress/releases'
            }
        ],
        
        sidebar: {
            '/': getHomeSidebar()
        }
    }
}


function getHomeSidebar(){
    return [
      {
        text: '说明',
        link: '/'
      },
      {
        text: '组件',
        children: [
          { text: '列表', link: '/components/index' },
          { text: '轨道', link: '/components/pathway' }
        ]
      },
      {
        text: '列子',
        link: '/example'
      },
      {
        text: 'SVG',
        link: '/svg'
      },
      {
        text: '演示',
        children: [
          { text: '完整', link: '/example' },
          { text: 'Global Computed', link: '/guide/global-computed' },
          { text: 'Global Component', link: '/guide/global-component' },
          { text: 'Customization', link: '/guide/customization' },
          {
            text: 'Differences from Vuepress',
            link: '/guide/differences-from-vuepress'
          }
        ]
      }
    ]
}