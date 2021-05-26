<template>
  <div class="example">
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fold:true
    }
  },
  computed:{
    code(){
      debugger;
      return this.$slot
    }
  },
  mounted () {
      /*
    import('./lib-that-access-window-on-import').then(module => {
      this.dynamicComponent = module.default
    })
    */
  }
}
</script>

<style scoped>
.example{
  border:1px solid #ccc;
  border-radius:5px;
  color:#0009;
  padding:1rem;
}
</style>