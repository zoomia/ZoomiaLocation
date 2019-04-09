<template>
    <GridLayout colums="*" rows="*">
        <MapView row="0" :latitude="latitude" :longitude="longitude"  :zoom="zoom" :bearing="bearing" :tilt="tilt" :padding="padding" :minZoom="minZoom" :maxZoom="maxZoom" @mapReady="mapReady" @markerSelect="onMarkerSelect" />
    </GridLayout>
</template>

<script>
  import { mapActions } from 'vuex';
  import * as dialogs from "tns-core-modules/ui/dialogs";
  import * as imagepicker from "nativescript-imagepicker";
  import * as permissions from "nativescript-permissions";
  import { Position, Marker, Camera } from 'nativescript-google-maps-sdk';
  import * as Toast from "nativescript-toast";
  import * as geolocation from "nativescript-geolocation";
  var WS = require('nativescript-websockets');

  import { Image } from "tns-core-modules/ui/image";
  import * as http from "http";

  import CTS from '../services/connectToServer';

  import Moment from 'moment';
  import { extendMoment } from 'moment-range';

  const moment = extendMoment(Moment);

  const firebase = require("nativescript-plugin-firebase");

  const Detail = {
    props: ['json'],
    data() {
      return {
        profile: this.profi,
        html: this.json.html_header,
        buttons: this.json.buttons,
        request_id: this.json.request_id,
        imageAssets: []
      }
    },
    methods: {
      onButton(button) {
        if(button.picture_required == 1) {

          let self = this;

          function setPhoto(select) {
            console.log("PHOTO", select);
            //self.addProfileData({ type: 'photo', data: select });
          }

          permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "ZoomiaLocation requires permission")
            .then( () => {
              let context = imagepicker.create({
                mode: "single"
              });
              context
                .authorize()
                .then(() => {
                  return context.present();
                })
                .then( (selection) => {
                  selection.forEach( (selected) => {
                    //ANDROID
                    setPhoto(selected.android);
                  });
                }).catch( (e) => {});
            })
            .catch(() => {
              console.log("Uh oh, no permissions - plan B time!");
            });

        } else {
          const profile = this.$store.state.profile;
          const request = {
            button_id: button.button_id,
            request_id: this.request_id
          };
          CTS.setFormAnswer(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, request).then( (response) => {
            let data = response.content.toJSON();
            console.log(JSON.stringify(data));
            //Toast.makeText("Передали ответ успешно").show();
          }).catch( (err) => {});
          this.$modal.close('Foo');
        }
      }
    },
    template: `
    <Page>
      <StackLayout style="padding: 10;">
        <HtmlView :html="html" />
        <StackLayout v-for="button in buttons">
            <Button :text="button.title" @tap="onButton(button)" style="color: #fff; background-color: #85ce36;" />
        </StackLayout>
      </StackLayout>
    </Page>
  `,
  };

  export default {
    data() {
      return {
        latitude: this.$store.state.profile.lastPosition.gps_lat,
        longitude: this.$store.state.profile.lastPosition.gps_lon,
        zoom: 12,
        minZoom: 0,
        maxZoom: 22,
        bearing: 0,
        tilt: 0,
        padding: [40, 40, 40, 40],
        mapView: null,
        watchId: null
      }
    },
    methods: {
      ...mapActions([
        'addLastPosition',
        'addPosition',
        'clearPositions',
        'addDestination'
      ]),
      mapReady(args) {
        this.mapView = args.object;
        this.mapView.infoWindowTemplate = `
				<StackLayout orientation="vertical" width="200">
					<Label text="{{title}}" className="title"/>
					<Label text="{{snippet}}" textWrep="true" class="snippet"/>
				</StackLayout>
			`;

        let gMap = args.gMap;
        geolocation.isEnabled().then( (isEnabled) => {
          if (isEnabled) {
            gMap.setMyLocationEnabled(true);
          }
        }, function (e) {});

        this.displayDestinations(this.$store.state.profile.destinations);

        //Only Android
        //this.mapView.settings.mapToolbarEnabled = false;


        /*const marker = new Marker();
        marker.position = Position.positionFromLatLng(this.latitude+0.01, this.longitude+0.01);
        marker.title = "Test";
        marker.snippet = "Test Address";
        marker.userData = {test: 'test'};
        this.mapView.addMarker(marker);*/
      },
      onMarkerSelect(args) {

      },
      setPosition() {
        geolocation.isEnabled().then( (isEnabled) => {
          if (isEnabled) {
            geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 0, maximumAge: 20000, timeout: 20000}).then( (location) => {
              if (location) {
                this.addLastPosition({
                  gps_lat: location.latitude,
                  gps_lon: location.longitude,
                  time_unix: moment().unix()
                });

                //Toast.makeText(location.latitude+"#"+location.longitude).show();

                const profile = this.$store.state.profile;
                CTS.setLocation(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, profile.lastPosition).then( (response) => {
                  let data = response.content.toJSON();
                  console.log(JSON.stringify(response));
                }).catch( (err) => {});
              }
            }, function(e){});
          } else {
            Toast.makeText(this.$t('permissions_message')).show();
          }
        }, function (e) {

          Toast.makeText(this.$t('permissions_message')).show();
        });
      },
      setPositionsHistory() {
        const profile = this.$store.state.profile;
        CTS.setLocationHistory(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, profile.positions).then( (response) => {
          let data = response.content.toJSON();
          if (data.success) {
            this.clearPositions();
            //Toast.makeText("Передали и очистили успешно!").show();
          }
        }).catch( (err) => {});
      },
      displayForm(json) {
        const prof = this.$store.state.profile;
        let profile = {
          access_key: prof.access_key,
          device_id: prof.device_id,
          owner_id: prof.owners[0].owner_id,
          user_id: prof.user_id
        };
        this.$showModal(Detail, { props: { json: json }});
      },
      setDestinations(points) {
        const init = this.$store.state.profile.destinations;
        let currentArr = points.filter( e => {
          let confirm = true;
          for (let i = 0; i < init.length; i++) {
            if (e.order_no == init[i].order_no) {
              confirm = false;
              break;
            }
          }
          return confirm;
        });
        for(let i = 0; i < currentArr.length; i++) {
          let point = currentArr[i];
          this.addDestination({
            title: point.title,
            gps_lat: point.gps_lat,
            gps_lon: point.gps_lon,
            order_no: point.order_no,
            description: point.description,
            icon_url: point.icon_url ? point.icon_url : "",
          });
        }
        this.displayDestinations(currentArr);
      },
      displayDestinations(points) {
        for(let i = 0; i < points.length; i++) {
          let point = points[i];

          const marker = new Marker();
          marker.position = Position.positionFromLatLng(point.gps_lat, point.gps_lon);
          marker.title = point.title;
          marker.snippet = point.description;
          marker.userData = {test: 'test'};
          if (point.icon_url) {
            http.getImage(point.icon_url).then((result) => {
              let icon = new Image();
              icon.imageSource = result;
              marker.icon = icon;
              this.mapView.addMarker(marker);
            }, (error) => {
              console.log(error);
            });
          } else {
            this.mapView.addMarker(marker);
          }
        }
      },
      openSocket() {
        let mySocket = new WS("wss://my.zoomiya.com/wss/?user_id="+this.$store.state.profile.user_id+"&owner_id="+this.$store.state.profile.owners[0].owner_id+"&key="+this.$store.state.profile.access_key+"&device_uuid="+this.$store.state.profile.device_id,
          { protocols: [], timeout: 6000 } );
        mySocket.on('open', function (socket) {
          console.log("We are Open"); socket.send("Hello");
        });
        mySocket.on('message',
          (socket, message) => {
            console.log("We got a message: ", message);
            let json = JSON.parse(message);
            const profile = this.$store.state.profile;
            switch(json.task) {
              case "getCurrentGPS":
                this.setPosition();
                break;
              case "getHistoryGPS":
                this.setPositionsHistory();
                break;
              case "displayRequest":
                CTS.formLanded(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, json.request_id).then( (response) => {
                  //let data = response.content.toJSON();
                  //console.log(JSON.stringify(data));
                }).catch( (err) => {});
                this.displayForm(json);
                break;
              case "setNewPoints":
                CTS.pointsLanded(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, json.chain_id).then( (response) => {
                  //let data = response.content.toJSON();
                  //console.log(JSON.stringify(data));
                }).catch( (err) => {});
                this.setDestinations(json.points);
                break;
            }
          });
        mySocket.on('close', (socket, code, reason) => {
          console.log("Socket was closed because: ", reason, " code: ", code);
          setTimeout(() => {
            mySocket.open();
          }, 2000);
        });
        mySocket.on('error', (socket, error) => {
          console.log("Socket had an error", error);
        });

        mySocket.open();
      }
    },
    mounted() {
      geolocation.isEnabled().then( (isEnabled) => {
        if (isEnabled) {
          this.watchId = geolocation.watchLocation( (location) => {
              if (location) {
                this.addPosition({
                  gps_lat: location.latitude,
                  gps_lon: location.longitude,
                  gps_alt: location.altitude,
                  time_unix: moment().unix()
                });
              }
            },
            function(e){
              console.log("Error: " + e.message);
            },
            {desiredAccuracy: 3, updateDistance: 25, minimumUpdateTime : 1000 * 60});
        } else {
          Toast.makeText(this.$t('permissions_message')).show();
        }
      }, function (e) {
        Toast.makeText(this.$t('permissions_message')).show();
      });

      this.openSocket();

      firebase.init({
        showNotifications: true,
        showNotificationsWhenInForeground: true,
        onPushTokenReceivedCallback: function(token) {
          console.log("Firebase push token: " + token);
        },
        onMessageReceivedCallback: function(message) {
          console.log("PUSH", JSON.stringify(message));
        }
      }).then(
        () => {
          console.log("firebase.init done");
          firebase.getCurrentPushToken().then((token) => {
            console.log(`Current push token: ${token}`);
            const profile = this.$store.state.profile;
            CTS.setPushToken(profile.access_key, profile.device_id, profile.owners[0].owner_id, profile.user_id, token).then( (response) => {
              let data = response.content.toJSON();
              console.log(JSON.stringify(data));
            }).catch( (err) => {});
          });
        },
        error => {
          console.log(`firebase.init error: ${error}`);
        }
      );

    },
    beforeDestroy() {
      //Удалить GPS ватч и закрыть сокеты
    }
  }
</script>

<style scoped>

</style>