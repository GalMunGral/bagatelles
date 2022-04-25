package edu.gatech.wenqi.twofactor

import android.app.PendingIntent
import android.content.Intent
import android.support.v4.app.NotificationCompat
import android.support.v4.app.NotificationManagerCompat
import android.support.v4.content.LocalBroadcastManager
import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import org.jetbrains.anko.defaultSharedPreferences

const val TAG = "TestFirebase"

class MyFirebaseMessagingService : FirebaseMessagingService() {

    var sessionId: String? = null

    override fun onNewToken(token: String?) {
        super.onNewToken(token)
        Log.d(TAG, "Received FCM token: $token")
        token.let {

            // Save the token
            with(defaultSharedPreferences.edit()) {
                putString(getString(R.string.device_token_key), it)
                apply()
                Log.i("TestFirebase", "Save token $it")
            }

            // Let MainActivity know
            LocalBroadcastManager.getInstance(this).sendBroadcast(Intent("UPDATE_TOKEN").apply {
                putExtra(getString(R.string.device_token_key), it)
            })
        }
    }

    override fun onMessageReceived(message: RemoteMessage?) {
        super.onMessageReceived(message)

        sessionId = message?.data?.get("sessionId")
        Log.i("TestFirebase", "Login attempt initiated by server session $sessionId")

        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(this, 0, intent, 0)

        val testIntent = Intent(this, AuthService::class.java).apply {
            action = "CONFIRM"
            putExtra("session_id", sessionId.toString())
        }
        Log.i("TestFirebase", testIntent.getStringExtra(("session_id")))
        val pendingTestIntent = PendingIntent.getService(this, 0, testIntent, PendingIntent.FLAG_IMMUTABLE)
        val notification = NotificationCompat.Builder(this, getString(R.string.default_notification_channel_id))
            .setSmallIcon(R.drawable.ic_launcher_background)
            .setContentTitle("Hi")
            .setContentText("You are retarded")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .addAction(R.drawable.abc_btn_check_material, "Confirm", pendingTestIntent)
            .setAutoCancel(true) // Close after being clicked
            .build()
        with(NotificationManagerCompat.from(this)) {
            notify(1, notification)
        }

    }

    override fun onDeletedMessages() {
        super.onDeletedMessages()
    }
}