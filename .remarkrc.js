// remark 配置文件
// 针对 Docusaurus MDX 和中文文档优化

module.exports = {
  plugins: [
    // 基础 lint 预设
    'remark-preset-lint-recommended',
    'remark-preset-lint-consistent',
    
    // 自定义规则配置
    ['remark-lint-maximum-line-length', false], // 禁用行长度限制，适应中文文档
    ['remark-lint-no-file-name-irregular-characters', false], // 允许中文文件名
    ['remark-lint-no-file-name-consecutive-dashes', false], // 允许连续破折号
    ['remark-lint-no-file-name-outer-dashes', false], // 允许文件名首尾破折号
    
    // 标题相关
    ['remark-lint-maximum-heading-length', false], // 禁用标题长度限制
    ['remark-lint-no-duplicate-headings', false], // 允许重复标题（不同章节）
    
    // 列表相关
    ['remark-lint-list-item-indent', 'space'], // 使用空格缩进
    ['remark-lint-list-item-spacing', false], // 允许列表项之间有空行
    
    // 链接相关
    ['remark-lint-no-literal-urls', false], // 允许裸露的 URL
    ['remark-lint-no-undefined-references', false], // 允许未定义的引用（Docusaurus 会处理）
    
    // 代码相关
    ['remark-lint-fenced-code-flag', true], // 要求代码块指定语言
    ['remark-lint-fenced-code-marker', '`'], // 使用反引号作为代码块标记
    
    // 强调相关
    ['remark-lint-emphasis-marker', '*'], // 使用星号作为斜体标记
    ['remark-lint-strong-marker', '*'], // 使用双星号作为粗体标记
    
    // 表格相关
    ['remark-lint-table-pipes', true], // 要求表格使用管道符
    ['remark-lint-table-pipe-alignment', false], // 不强制表格对齐
    
    // 其他
    ['remark-lint-no-shell-dollars', false], // 允许 shell 命令中的 $ 符号
    ['remark-lint-no-tabs', false], // 允许制表符（某些代码示例需要）
  ],
  
  // 设置处理的文件类型
  settings: {
    bullet: '-', // 使用破折号作为无序列表标记
    emphasis: '*', // 使用星号作为强调标记
    strong: '*', // 使用双星号作为加粗标记
    fence: '`', // 使用反引号作为代码围栏
    fences: true, // 启用围栏式代码块
    incrementListMarker: false, // 不自动递增有序列表标记
  }
};