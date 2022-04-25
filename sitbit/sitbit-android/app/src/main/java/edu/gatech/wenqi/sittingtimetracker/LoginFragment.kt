package edu.gatech.wenqi.sittingtimetracker

import android.content.Context
import android.os.Bundle
import android.support.v4.app.Fragment
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.JsonObjectRequest
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.android.synthetic.main.fragment_login.*
import org.json.JSONObject


class LoginFragment : Fragment() {

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_login, container, false)
    }

    override fun onResume() {
        super.onResume()
        Log.d("TOTO", "hey")
        (activity as MainActivity).navigationView.setCheckedItem(R.id.main)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        registerButton.setOnClickListener {

            val username = usernameInput.text.toString()
            val password = passwordInput.text.toString()
            val request = JsonObjectRequest(Request.Method.POST, "http://${getString(R.string.server_ip)}/register", JSONObject("""{
                "username": "$username",
                "password": "$password"
            }""".trimIndent()), Response.Listener { json ->
                val token = json["token"] as String
                Log.i("TEST", token)
                Toast.makeText(context, "Success!", Toast.LENGTH_SHORT).show()
            }, Response.ErrorListener { err ->
                Log.d("TEST", "Status: ${err.networkResponse.statusCode}")
                Toast.makeText(context, "Registration failed.", Toast.LENGTH_SHORT).show()
            })
            (activity as MainActivity).requestQueue.add(request)
        }

        loginButton.setOnClickListener {
            val username = usernameInput.text.toString()
            val password = passwordInput.text.toString()
            val request = JsonObjectRequest(Request.Method.POST, "http://${getString(R.string.server_ip)}/login", JSONObject("""{
                "username": "$username",
                "password": "$password"
            }""".trimIndent()), Response.Listener { json ->
                val token = json["token"] as String
                Log.i("TEST", token)
                (activity as MainActivity).onLoginSuccess(token)
            }, Response.ErrorListener { err ->
                Log.d("TEST", "Status: ${err.networkResponse.statusCode}")
                Toast.makeText(context, "Login failed.", Toast.LENGTH_SHORT).show()
            })
            (activity as MainActivity).requestQueue.add(request)
        }
    }
}