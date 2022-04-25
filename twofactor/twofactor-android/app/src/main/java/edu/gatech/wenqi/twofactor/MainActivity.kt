package edu.gatech.wenqi.twofactor

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.Bundle
import android.support.v4.app.NotificationManagerCompat
import android.support.v4.content.LocalBroadcastManager
import android.support.v7.app.AppCompatActivity
import android.util.Log
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import kotlinx.android.synthetic.main.activity_main.*
import org.jetbrains.anko.defaultSharedPreferences
import org.json.JSONObject

class MainActivity : AppCompatActivity() {
    private lateinit var requestQueue: RequestQueue
    private lateinit var token: String

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        requestQueue = Volley.newRequestQueue(this)
        token = defaultSharedPreferences.getString(getString(R.string.device_token_key), "") ?: ""
        if (token != "") {
            registerUserToken()
        }

        Log.i("TestFirebase", "Read from shared preferences: $token")

        createNotificationChannel()

        // Start receiving broadcasts from background services
        LocalBroadcastManager.getInstance(this)
            .registerReceiver(object: BroadcastReceiver() {
                override fun onReceive(context: Context?, intent: Intent?) {
                    Log.i("TestFirebase", "Main activity received token update: ${intent?.getStringExtra(getString(R.string.device_token_key))}")
                    registerUserToken()
                }
            }, IntentFilter("UPDATE_TOKEN"))
    }

    private fun registerUserToken() {
        requestQueue.add(JsonObjectRequest(
            Request.Method.POST,
            "http://${getString(R.string.server_ip)}/android/device-token",
            JSONObject().apply {
                put("username", "retarded")
                put("token", token)
            },
            Response.Listener {
                Log.i("TestFirebase", "Success!")
            },
            Response.ErrorListener {
                Log.d("TestFirebase", it.toString())
            }
        ))
    }
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                getString(R.string.default_notification_channel_id),
                "name", NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = "description"
                importance = NotificationManager.IMPORTANCE_HIGH
            }
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)
        }
    }


}
