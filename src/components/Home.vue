<template>
    <div>
       <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
    methods: {
        logout(){
            // 1)首先，清空token
            sessionStorage.clear();
            // 2)其次，强制跳转到login登录页面
            this.$router.push('/login');
        }
    }
    
}
</script>

<style scoped>

</style>