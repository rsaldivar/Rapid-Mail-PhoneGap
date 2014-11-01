package saldivar.paquete.phonegap;

import  com.phonegap.*;

import android.os.Bundle;

public class MyPhoneGapActivity extends DroidGap {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		//super.onCreate(savedInstanceState);
		//super.loadUrl("file:///android_asset/www/login.html");
		 super.onCreate(savedInstanceState);
	        super.setIntegerProperty("splashscreen", R.drawable.splash);
	        // Set by <content src="index.html" /> in config.xml
	        super.loadUrl("file:///android_asset/www/index.html",1000);
		
	}
	
}
