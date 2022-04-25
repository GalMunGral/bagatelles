package edu.gatech.wenqi.twofactor

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.support.v4.app.NotificationManagerCompat
import android.util.Log
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import org.jetbrains.anko.defaultSharedPreferences
import org.json.JSONObject

class AuthService: Service() {

    private lateinit var username: String

    override fun onCreate() {
        super.onCreate()
        username = defaultSharedPreferences.getString("username", "retarded")!!
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action != "CONFIRM") return Service.START_STICKY

        with(NotificationManagerCompat.from(this)) {
            cancel(1) // Dismiss notification (in cases there is one)
        }
        val sessionId = intent?.getStringExtra("session_id")
        Log.d("NEWTEST", username)
        Volley.newRequestQueue(this).add(JsonObjectRequest(
            Request.Method.POST,
            "http://${getString(R.string.server_ip)}/confirm",
            JSONObject().apply {
                put("sessionId", sessionId)
                put("username", username)
            },
            Response.Listener {
                Log.i("TestFirebase", "Success!")
            },
            Response.ErrorListener {
                Log.d("TestFirebase", it.toString())
            }
        ))
        return Service.START_STICKY

    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

}