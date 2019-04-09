import * as application from "application";
import * as platform from "platform";
import * as color from "color";

export function setStatusBarColors() {
    if (application.android && platform.device.sdkVersion >= "21") {
        application.android.on("activityStarted", () => {
            let androidColor = new color.Color("#fff").android;
            const window = application.android.startActivity.getWindow();
            window.setStatusBarColor(androidColor);
            const decor = window.getDecorView();
            decor.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        });
    }
}