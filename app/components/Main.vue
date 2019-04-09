<template>
    <Page>
        <ActionBar class="menu" flat="true" >
            <Image src="~/assets/images/logo_title.png" class="menu-logo" />
            <ActionItem ios.position="right" class="menu-lang" :text="$t('language')"  @tap="changeLocale" />
        </ActionBar>
        <StackLayout>
            <SegmentedBar class="menu-bar" android:selectedBackgroundColor="#ffffff" v-model="selectedItem" @selectedIndexChange="onSelectedIndexChange" >
                <SegmentedBarItem :title="$t('tabMap')" />
                <SegmentedBarItem :title="$t('tabList')" />
            </SegmentedBar>
            <MapFragment v-show="selectedItem == 0" />
            <ListFragment v-show="selectedItem == 1" />
        </StackLayout>
    </Page>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                selectedItem: 0,
            }
        },
        methods: {
            ...mapActions([
                'changeLanguage'
            ]),
            onSelectedIndexChange() {
            },
            changeLocale() {
                this.changeLanguage();
                this.$i18n.set(this.$store.state.profile.language);
            },
        }
    }
</script>

<style scoped>
    .menu {
        background-color: #fff;
        color: #c4ffdf;
    }

    .menu-bar {
        background-color: #85ce36;
        color: #ffffff;
    }

    .menu-logo {
        width: 100;
        height: 30;
    }

    .menu-lang {
        color: #f5f5f5;
    }
</style>
