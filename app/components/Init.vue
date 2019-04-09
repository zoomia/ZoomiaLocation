<template>
    <Page actionBarHidden="true">
    </Page>
</template>

<script>
    import { mapActions } from 'vuex';
    import { device } from "platform";

    export default {
        methods: {
            ...mapActions([
                'addDeviceId'
            ])
        },
        mounted() {
            if (!this.$store.state.profile.device_id) this.addDeviceId(device.uuid);
            setTimeout( ()=> {
                this.$navigateTo(this.$routes[this.$store.state.profile.initRoute], { clearHistory: true });
            } , 1);
        }
    }
</script>

<style scoped>

</style>