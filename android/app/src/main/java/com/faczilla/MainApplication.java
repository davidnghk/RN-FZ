package cloud.letsapp.faczilla;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.ReactInstanceManager;

import java.lang.reflect.InvocationTargetException;
import java.util.List;
import java.util.Map;

import com.huawei.hms.rn.push.HmsPushPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import com.facebook.react.modules.i18nmanager.I18nUtil;
import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Typeface;
import android.util.Log;
import java.lang.reflect.Field;

import androidx.multidex.MultiDexApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    loadFonts();
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  private void loadFonts() {
    AssetManager assetManager = getAssets();
    Typeface antDesign = Typeface.createFromAsset(assetManager, "fonts/AntDesign.ttf");
    Typeface materialIcons = Typeface.createFromAsset(assetManager, "fonts/MaterialIcons.ttf");
    try {
      Field field = Typeface.class.getDeclaredField("sSystemFontMap");
      field.setAccessible(true);
      Map<String, Typeface> systemFonts = (Map<String, Typeface>) field.get(null);
      systemFonts.put("antdesign", antDesign);
      systemFonts.put("MaterialIcons-Regular", materialIcons);
    } catch (NoSuchFieldException e) {
      Log.e("MainApplication", "Failed to update system fonts", e);
    } catch (IllegalAccessException e) {
      Log.e("MainApplication", "Failed to update system fonts", e);
    }
    I18nUtil.getInstance().allowRTL(getApplicationContext(), true);
  }

  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        Class<?> aClass = Class.forName("cloud.letsapp.faczilla.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}

