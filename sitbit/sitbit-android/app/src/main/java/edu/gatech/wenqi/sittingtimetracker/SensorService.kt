package edu.gatech.wenqi.sittingtimetracker

import android.annotation.TargetApi
import android.app.*
import android.content.Context
import android.content.Intent
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.IBinder
import android.support.v4.content.LocalBroadcastManager
import kotlin.math.absoluteValue

@TargetApi(26)
class SensorService : Service(), SensorEventListener {
    private var notificationManager: NotificationManager? = null
    private var vertUnitVec: FloatArray = FloatArray(3)
    private var acceleration: FloatArray = FloatArray(3)
    private var prevAcc: Float = 0.0.toFloat()

    override fun onCreate() {
        super.onCreate()
        this.notificationManager = (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager)
        val sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val accelerometer: Sensor = sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION)
        val gravitySensor: Sensor = sensorManager.getDefaultSensor(Sensor.TYPE_GRAVITY)
        // Register self as event listener
        sensorManager.registerListener(this, gravitySensor, SensorManager.SENSOR_DELAY_FASTEST)
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_FASTEST)
    }


    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        NotificationChannel("default", "Default Channel", NotificationManager.IMPORTANCE_LOW).also {
            this.notificationManager?.createNotificationChannel(it)
        }
        val intent = Intent(this, MainActivity::class.java).let {
            PendingIntent.getActivity(this, 0, it, 0)
        }
        val notification = Notification.Builder(this, "default")
            .setContentTitle("Tracking Sitting Time")
            .setContentText("This might drain your battery")
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentIntent(intent)
            .build()
        this.startForeground(1, notification)
        return Service.START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    // Implement SensorEventListener interface
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
    override fun onSensorChanged(event: SensorEvent?) {
        event?.let {
            val sensor:Sensor = it.sensor
            when(sensor.type) {
                Sensor.TYPE_LINEAR_ACCELERATION -> this.acceleration = it.values
                Sensor.TYPE_GRAVITY -> this.vertUnitVec = it.values.map { v -> (v / 9.81).toFloat() }.toFloatArray()
            }
        }

        val curAcc: Float = vertUnitVec[0] * acceleration[0] + vertUnitVec[1] * acceleration[1] + vertUnitVec[2] * acceleration[2]
        if (curAcc.absoluteValue > 3.0) { // Threshold??
            val intent = Intent().apply {
                action = "MY_ACTION"
            }
            if (prevAcc >= 0 && curAcc < 0) {
                intent.putExtra("dir", "위")
                LocalBroadcastManager.getInstance(this).sendBroadcast(intent)
            } else if (prevAcc <= 0 && curAcc > 0) {
                intent.putExtra("dir", "아래")
                LocalBroadcastManager.getInstance(this).sendBroadcast(intent)
            }
            prevAcc = curAcc
        }
    }
}