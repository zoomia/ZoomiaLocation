var http = require("http");

const BASE_URL = 'https://my.zoomiya.com/rapi';

export default {

    signUp(email, password) {
        let formData = [];
        formData.push(encodeURIComponent('user_email') + '=' + encodeURIComponent(email));
        formData.push(encodeURIComponent('password') + '=' + encodeURIComponent(password));
        formData = formData.join("&");

        return http.request({
            url: BASE_URL + "/public/getUserValidation",
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
            content: formData
        });
    },

    setPushToken(key, device_uuid, owner_id, user_id, token) {
      let formData = [];
      formData.push(encodeURIComponent('app_token_id') + '=' + encodeURIComponent(token));
      formData = formData.join("&");

      return http.request({
        url: BASE_URL + "/user/setPushNotificationUUID",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          'key': key,
          'device_uuid': device_uuid,
          'owner_id': owner_id,
          'user_id': user_id
        },
        content: formData
      });
    },

    setLocation(key, device_uuid, owner_id, user_id, position) {
        let formData = [];
        formData.push(encodeURIComponent('JSON_PARAMS') + '=' + encodeURIComponent(JSON.stringify(position)));
        formData = formData.join("&");

        return http.request({
            url: BASE_URL + "/gps/setlocation",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'key': key,
                'device_uuid': device_uuid,
                'owner_id': owner_id,
                'user_id': user_id
            },
            content: formData
        });
    },

    setLocationHistory(key, device_uuid, owner_id, user_id, positions) {

        let formData = [];
        formData.push(encodeURIComponent('JSON_PARAMS') + '=' + encodeURIComponent(JSON.stringify(positions)));
        formData = formData.join("&");

        return http.request({
            url: BASE_URL + "/gps/setlocationhistory",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'key': key,
                'device_uuid': device_uuid,
                'owner_id': owner_id,
                'user_id': user_id
            },
            content: formData
        });
    },

    setFormAnswer(key, device_uuid, owner_id, user_id, request) {
        let obj = {
            button_id: request.button_id,
            request_id: request.request_id,
        };

        let formData = [];
        formData.push(encodeURIComponent('JSON_PARAMS') + '=' + encodeURIComponent(JSON.stringify(obj)));
        //formData.push(encodeURIComponent('FILES') + '=' + encodeURIComponent(JSON.stringify("")));
        formData = formData.join("&");

        return http.request({
            url: BASE_URL + "/gps/setFormAnswer",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'key': key,
                'device_uuid': device_uuid,
                'owner_id': owner_id,
                'user_id': user_id
            },
            content: formData
        });
    },

    formLanded(key, device_uuid, owner_id, user_id, request_id) {
        let obj = {
            request_id: request_id
        };

        let formData = [];
        formData.push(encodeURIComponent('JSON_PARAMS') + '=' + encodeURIComponent(JSON.stringify(obj)));
        formData = formData.join("&");

        return http.request({
            url: BASE_URL + "/gps/FormLanded",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'key': key,
                'device_uuid': device_uuid,
                'owner_id': owner_id,
                'user_id': user_id
            },
            content: formData
        });
    },

    pointsLanded(key, device_uuid, owner_id, user_id, chain_id) {
        let obj = {
            chain_id: chain_id
        };

        let formData = [];
        formData.push(encodeURIComponent('JSON_PARAMS') + '=' + encodeURIComponent(JSON.stringify(obj)));
        formData = formData.join("&");

        return http.request({
            url: BASE_URL + "/gps/PointsLanded",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                'key': key,
                'device_uuid': device_uuid,
                'owner_id': owner_id,
                'user_id': user_id
            },
            content: formData
        });
    }

};