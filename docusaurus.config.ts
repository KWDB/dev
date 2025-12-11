import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'KWDB 开发者文档',
  tagline: '面向 AIoT 物联网场景的分布式多模开源数据库',
  favicon: 'img/favcion.svg',

  // SEO 优化配置
  headTags: [
    // 基础 SEO 元标签
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'KWDB是面向AIoT物联网场景的分布式多模开源数据库，提供时序数据、关系数据、地理空间数据的统一存储和查询能力。支持高并发写入、实时查询、边缘计算等特性。',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'KWDB,多模数据库,时序数据库,物联网数据库,AIoT,分布式数据库,开源数据库,时间序列,边缘计算,实时数据',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'author',
        content: 'KWDB Team',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index,follow',
      },
    },
    // Open Graph 标签
    {
      tagName: 'meta',
      attributes: {
        property: 'og:title',
        content: 'KWDB 开发者文档 - 面向AIoT的分布式多模开源数据库',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content: 'KWDB是面向AIoT物联网场景的分布式多模开源数据库，提供时序数据、关系数据、地理空间数据的统一存储和查询能力。',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:url',
        content: 'https://kwdb.atomgit.net/dev/',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image',
        content: 'https://kwdb.atomgit.net/dev/img/docusaurus-social-card.jpg',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:site_name',
        content: 'KWDB 开发者文档',
      },
    },
    // Twitter Cards 标签
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'KWDB 开发者文档 - 面向AIoT的分布式多模开源数据库',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:description',
        content: 'KWDB是面向AIoT物联网场景的分布式多模开源数据库，提供时序数据、关系数据、地理空间数据的统一存储和查询能力。',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:image',
        content: 'https://kwdb.atomgit.net/dev/img/docusaurus-social-card.jpg',
      },
    },
    // 移动端优化
    {
      tagName: 'meta',
      attributes: {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
    },
    // 语言标签
    {
      tagName: 'meta',
      attributes: {
        'http-equiv': 'content-language',
        content: 'zh-CN',
      },
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://kwdb.atomgit.net',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/dev/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'kwdb', // Usually your GitHub org/user name.
  // projectName: 'dev', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // SEO 优化：设置友好的路由路径
          routeBasePath: 'docs',
          // 设置文档ID生成规则，使URL更简洁
          docItemComponent: '@theme/DocItem',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
            // 'https://github.com/kwdb/kwdb/tree/main/docs/',
        },
        blog: false, // 禁用博客功能
        theme: {
          customCss: './src/css/custom.css',
        },
        // SEO 优化：sitemap 配置
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  // 插件配置
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        // 是否索引博客内容（我们已禁用博客）
        indexBlog: false,
        // 是否索引文档内容
        indexDocs: true,
        // 是否索引页面内容
        indexPages: true,
        // 搜索结果的语言
        language: ['zh', 'en'],
        // 搜索结果高亮
        highlightSearchTermsOnTargetPage: true,
        // 搜索结果显示数量
        searchResultLimits: 12,
        // 搜索结果上下文长度
        searchResultContextMaxLength: 80,
        // 是否显示搜索建议
        explicitSearchResultPath: true,
        // 搜索相关的快捷键提示
        searchBarShortcut: true,
        searchBarShortcutHint: true,
        // 搜索栏位置
        searchBarPosition: 'right',
        // 文档基础路径
        docsRouteBasePath: '/docs',
        // 忽略的文件
        ignoreFiles: [],
        // 停用词与词干提取配置
        removeDefaultStopWordFilter: false,
        removeDefaultStemmer: false,
      },
    ],
    [
      // Google Analytics 4 集成（通过 gtag 插件）
      // 说明：优先从环境变量读取测量 ID，避免将敏感信息写入仓库
      require.resolve('@docusaurus/plugin-google-gtag'),
      {
        // 从构建环境注入，示例：GA_MEASUREMENT_ID="G-XXXX" pnpm build
        trackingID: process.env.GA_MEASUREMENT_ID || 'G-KJW7LC2SEM',
        // 尊重“请勿追踪”，合规与隐私优先
        anonymizeIP: true,
      },
    ],
  ],

  // 客户端模块配置
  clientModules: [
    require.resolve('./src/js/table-enhancements.js'),
    require.resolve('./src/js/navbar-active.js'),
  ],

  themeConfig: {
    // announcementBar: {
    //   id: 'support_us',
    //   content:
    //     'KWDB 核心贡献挑战赛，30万奖金池等你来瓜分！ <a target="_blank" rel="noopener noreferrer" href="https://competition.atomgit.com/competitionInfo?id=15a1cbf384173a304349de363511d037">了解更多</a>',
    //   backgroundColor: '#fafbfc',
    //   textColor: '#091E42',
    //   isCloseable: true,
    // },
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'KWDB',
      logo: {
        alt: 'KWDB Logo',
        src: 'img/KWDB-light.svg',
        srcDark: 'img/KWDB-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '文档',
        },
        {to: '/tutorial', label: '教程', position: 'left'},
        {to: '/download', label: '下载', position: 'left'},
        {to: '/video', label: '视频', position: 'left'},
        {to: '/competition', label: '大赛', position: 'left'},
        {to: '/mvp', label: 'MVP', position: 'left'},
        {
          href: 'https://github.com/kwdb/kwdb',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          href: 'https://gitee.com/kwdb/kwdb',
          position: 'right',
          className: 'header-gitee-link',
          'aria-label': 'Gitee repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '快速开始',
              to: '/docs/quickstart/5M-quick-start',
            },
            {
              label: '教程',
              to: '/tutorial',
            },
          ],
        },
        {
          title: '社区',
          items: [
            {
              label: 'KWDB 社区',
              href: 'https://kwdb.openatom.tech/',
            },
            {
              label: '开放原子开源基金会',
              href: 'https://openatom.org/',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'KWDB OpenRank Insight',
              href: 'https://kwdb.atomgit.net/openrank/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} OpenAtom KWDB Team. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: [
        'json',
        'javascript', 
        'typescript',
        'sql',
        'yaml',
        'bash',
        'shell-session',
        'python',
        'java',
        'go',
        'rust',
        'cpp',
        'c',
        'docker',
        'ini',
        'toml',
        'properties',
        'makefile',
        'diff'
      ],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: {start: 'highlight-start', end: 'highlight-end'},
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
    // 支持亮色和深色模式切换，保持终端风格
    colorMode: {
      defaultMode: 'light', // 默认显示亮模式（在无法获取系统偏好时使用）
      disableSwitch: false,
      respectPrefersColorScheme: true, // 默认跟随系统显示模式
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
