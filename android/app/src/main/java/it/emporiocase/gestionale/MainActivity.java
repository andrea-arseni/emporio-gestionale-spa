package it.emporiocase.nativeapp;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import ch.byrds.capacitor.contacts.Contacts;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(Contacts.class);
        super.onCreate(savedInstanceState);
    }




}
