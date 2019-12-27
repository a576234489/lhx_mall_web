<template>
  <div>
    <product-detail :is-edit="true"></product-detail>
  </div>
</template>

<script>
  import productDetail from  './components/ProductDetail'
  export default {
    name: "update",
    components:{
      productDetail
    }
  }
</script>

<style scoped>

</style>