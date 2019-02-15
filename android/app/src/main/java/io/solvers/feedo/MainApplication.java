package io.solvers.feedo;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.meedan.ShareMenuPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.mkuczera.RNReactNativeHapticFeedbackPackage;
import com.proyecto26.inappbrowser.RNInAppBrowserPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.bugsnag.BugsnagReactNative;
import com.airbnb.android.react.lottie.LottiePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.poppop.RNReactNativeSharedGroupPreferences.RNReactNativeSharedGroupPreferencesPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ShareMenuPackage(),
            new RNGoogleSigninPackage(),
            new RNReactNativeHapticFeedbackPackage(),
            new RNInAppBrowserPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAnalyticsPackage(),
            new SvgPackage(),
            new RNDeviceInfo(),
            BugsnagReactNative.getPackage(),
            new LottiePackage(),
            new ReactVideoPackage(),
            new RNVersionNumberPackage(),
            new ReactNativePushNotificationPackage(),
            new RNReactNativeSharedGroupPreferencesPackage(),
            new RNFetchBlobPackage(),
            new ImageResizerPackage(),
            new LinearGradientPackage(),
            new FastImageViewPackage(),
            new ReactNativeDocumentPicker(),
            new ImagePickerPackage(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
