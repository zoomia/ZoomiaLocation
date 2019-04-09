<template>
    <StackLayout class="background">
        <Label :text="$t('destination_points')" class="title" />
        <ListView for="item in points" @itemTap="onItemTap">
            <v-template>
                <StackLayout class="item-background">
                    <Label :text="item.title" class="item-title" />
                    <Label :text="item.description" class="item-address" />
                </StackLayout>
            </v-template>
        </ListView>
    </StackLayout>
</template>

<script>
    import * as Toast from "nativescript-toast";
    import { mapActions } from 'vuex';

    export default {
        data() {
            return {
                points: this.$store.state.profile.destinations
            }
        },
        methods: {
            onItemTap(event) {
                //console.log(event.index);
                //console.log(event.item);
                /*action("Choose action", "Cancel", ["Show route", "Confirm visit"])
                    .then(result => {
                        console.log(result);
                        if (result == "Show route") {
                        } else if (result == "Confirm visit") {
                            //this.$showModal(Detail, { props: { id: 14 }});
                        }
                    });*/
            }
        },
        mounted() {
            console.log("PAYLOAD", JSON.stringify(this.points));
        }
    }
</script>

<style scoped>
    .background {
        padding: 20;
        background-color: #ffffff;
    }

    .logo {
        width: 150;
        height: 60;
    }

    .language {
        width: 60;
        height: 60;
        font-size: 27;
    }

    .title {
        margin-top: 20;
        margin-bottom: 20;
        font-size: 24;
        color: #2b2a29;
    }

    .item-background {
        padding: 10;
    }

    .item-title {
        color: #2b2a29;
        font-size: 18;
        font-weight: bold;
    }

    .item-address {

    }

</style>