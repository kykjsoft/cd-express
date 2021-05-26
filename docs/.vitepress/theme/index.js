import DefaultTheme from 'vitepress/theme'
import  Example from "./Example.vue"

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Example', Example)
  }
}