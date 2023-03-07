import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import requireTransform from 'vite-plugin-require-transform';
// mock服务
import { viteMockServe } from 'vite-plugin-mock'

export default ({ mode }: ConfigEnv): UserConfig => {
  // 获取.env 环境配置文件
  const env = loadEnv(mode, process.cwd());

  console.log(env)

  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      viteMockServe({
        // ↓解析根目录下的mock文件夹
        mockPath: "./src/mock",
        supportTs: true, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        watchFiles: true, // 监视文件更改
      }),
      requireTransform({
        fileRegex: /.ts$|.vue$/
      }),
    ],
    // 本地反向代理解决浏览器跨域限制
    server: {
      host: '127.0.0.1',
      port: Number(env.VITE_APP_PORT),
      open: true, // 运行自动打开浏览器
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: 'http://127.0.0.1:8080/api',
          changeOrigin: true,
          rewrite: path =>
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
      }
    },
    resolve: {
      // Vite路径别名配置
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
}