// 定义项目发布阶段（build）需奥用到的babel插件
const prodPlugins = [];
// 判断项目当前是否处于发布阶段
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console');
}


module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 扩展运算符，把数组每一项分割成逗号分割的序列
    // 发布 产品时候的插件数组
    ...prodPlugins,
    // 声明路由懒加载
    '@babel/plugin-syntax-dynamic-import'
  ]
};
