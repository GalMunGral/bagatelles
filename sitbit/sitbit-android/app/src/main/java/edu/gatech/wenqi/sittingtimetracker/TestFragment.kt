package edu.gatech.wenqi.sittingtimetracker

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Bundle
import android.support.v4.app.Fragment
import android.support.v4.content.LocalBroadcastManager
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import kotlinx.android.synthetic.main.fragment_test.*
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.*

class TestFragment : Fragment() {

    private val receiver: BroadcastReceiver = object: BroadcastReceiver() {
        var start: Date? = null

        override fun onReceive(context: Context?, intent: Intent?) {
            textView.text = intent?.getStringExtra("dir")
            if (textView.text.toString() == "아래") {
                start = Date()
            } else if (textView.text.toString() == "위" && start != null) {
                val formatter = SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                val startString = formatter.format(start)
                val endString = formatter.format(Date())
                val token = (activity as MainActivity).token!!
                Log.i("TEST", "start:$startString, end:$endString")
                val request = JsonObjectRequest(Request.Method.POST, "http://${getString(R.string.server_ip)}/record?token=$token", JSONObject("""{
                    "start": "$startString",
                    "end": "$endString"
                }""".trimIndent()), Response.Listener { json ->
                    Log.i("TEST", json.toString())
                }, Response.ErrorListener { err ->
                    Log.d("TEST", "Status: ${err.networkResponse.statusCode}")
                })
                (activity as MainActivity).requestQueue.add(request)
            }
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_test, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        LocalBroadcastManager.getInstance(context!!).registerReceiver(receiver, IntentFilter("MY_ACTION"))
    }

    override fun onDestroyView() {
        super.onDestroyView()
        LocalBroadcastManager.getInstance(context!!).unregisterReceiver(receiver)
    }
}