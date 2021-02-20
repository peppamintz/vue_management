<!--
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-20 15:26:17
 * @LastEditors: mintZ
 * @LastEditTime: 2021-02-20 18:01:44
-->
<template>
  <div>
    <button @click="logout">退出</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
  },

  components: {},

  computed: {},

  mounted: {},
};

</script>
<style lang='scss' scoped>
</style>
