<template>
    <Page class="page" actionBarHidden="true">
        <ScrollView>
            <StackLayout verticalAlignment="center" horizontalAlignment="center" class="login-background">
                <Label :text="$t('language')" class="login-language" @tap="changeLocale()" />
                <Image src="~/assets/images/logo_title.png" class="login-logo" />
                <Label :text="$t('enter')" class="login-title" />
                <template v-if="isLoading">
                    <ActivityIndicator busy="true" class="login-indicator" />
                </template>
                <template v-else>
                    <TextField v-model="email" keyboardType="email" :hint="$t('email')" class="login-input" />
                    <TextField v-model="password" :hint="$t('password')" secure="true" class="login-input" />
                    <Button :text="$t('button')" @tap="onLoginPress()" class="login-enter" />
                </template>
            </StackLayout>
        </ScrollView>
    </Page>
</template>

<script>
    import * as geolocation from "nativescript-geolocation";
    import * as Toast from "nativescript-toast";
    import { mapActions } from 'vuex';

    import CTS from '../services/connectToServer';

    import Moment from 'moment';
    import { extendMoment } from 'moment-range';

    const moment = extendMoment(Moment);

    export default {
        data () {
            return {
                email: "",
                password: "",
                isLoading: false
            };
        },
        //pavel.k@capstone.kz
        //ZOOMMAGo2018+!

        methods: {
            ...mapActions([
                'changeLanguage',
                'setInitialRoute',
                'addProfileData',
                'addLastPosition'
            ]),
            changeRoute(to) {
                this.$navigateTo(this.$routes[to], { clearHistory: true });
            },
            changeLocale() {
                this.changeLanguage();
                this.$i18n.set(this.$store.state.profile.language);
            },
            onLoginPress() {
                if (this.email.length > 0 && this.password.length > 0) {
                    this.isLoading = true;

                    CTS.signUp(this.email, this.password)
                        .then((response) => {
                            this.isLoading = false;
                            let data = response.content.toJSON();
                            if (data.success) {
                                this.addProfileData({user_id:data.user_id, access_key:data.access_key, owners:data.owners});
                                this.setInitialRoute('main');
                                this.changeRoute('main');
                            } else {
                                if (data.tittle == "Password is not match") {
                                    Toast.makeText(this.$t('signInErrorPassword')).show();
                                } else if (data.error_message == "There is no user with mentioned EMail") {
                                    Toast.makeText(this.$t('signInErrorEmail')).show();
                                }
                            }
                        }).catch( (err) => this.isLoading = false);
                } else {
                    Toast.makeText(this.$t('signInErrorInput')).show();
                }
            },
            getPosition() {
                geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).then( (location) => {
                    if (location) {
                        this.addLastPosition({
                            gps_lat: location.latitude,
                            gps_lon: location.longitude,
                            gps_alt: location.altitude,
                            time_unix: moment().unix()
                        });
                    }
                }, function(e){});
            }
        },
        mounted() {
            geolocation.isEnabled().then( (isEnabled) => {
                if (isEnabled) {
                    this.getPosition();
                } else {
                    geolocation.enableLocationRequest().then( () => {
                        this.getPosition();
                    }, function (e) {
                        Toast.makeText(this.$t('permissions_message')).show();
                    });
                }
            }, function (e) {
                Toast.makeText(this.$t('permissions_message')).show();
            });
        }
    }
</script>

<style scoped>

    .login-background {
        background-color: #ffffff;
    }

    .login-indicator {
        margin-top: 20;
    }

    .login-language {
        font-size: 27;
        text-align: right;
    }

    .login-logo {
        margin-top: 10;
        width: 250;
        height: 100;
    }

    .login-title {
        margin-top: 10;
        font-size: 30;
        color: #2b2a29;
        text-align: center;
    }

    .login-input {
        margin-top: 10;
    }

    .login-enter {
        margin-top: 10;
        color: #fff;
        background-color: #85ce36;
    }

</style>