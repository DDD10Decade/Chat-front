<template>
    <el-page-header @back="goBack" content="详情页面">
    </el-page-header>
</template>
<script>
export default {
    // name: "chat",
    data() {

    },
    methods: {
        goBack() {
            this.config.log('')
        }
    }
}
</script>
<style>

</style>