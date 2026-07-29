package com.parky.app;

import android.os.Bundle;
import android.view.View;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Edge-to-edge: WebView ocupa toda la pantalla incluyendo detrás del status bar
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // Ocultar status bar cuando la app tiene foco (reaparece con swipe desde arriba)
        if (hasFocus) {
            hideStatusBar();
        }
    }

    private void hideStatusBar() {
        View decorView = getWindow().getDecorView();
        WindowInsetsControllerCompat controller =
            WindowCompat.getInsetsController(getWindow(), decorView);
        controller.hide(WindowInsetsCompat.Type.statusBars());
        controller.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
    }
}
