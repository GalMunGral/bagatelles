package edu.gatech.wenqi.sittingtimetracker

import android.content.Intent
import android.os.Bundle
import android.support.v4.app.FragmentActivity
import android.widget.Toast
import com.android.volley.RequestQueue
import com.android.volley.toolbox.Volley
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity: FragmentActivity() {

    lateinit var requestQueue: RequestQueue
    var token: String? = null
    private var isLoggedIn: Boolean = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        this.setContentView(R.layout.activity_main)
        this.requestQueue = Volley.newRequestQueue(this)

        // Start monitoring
        Intent(this, SensorService::class.java).also {
            startService(it)
        }

        val transaction = supportFragmentManager.beginTransaction()
        val loginFragment = LoginFragment()
        transaction.add(R.id.root, loginFragment)
        transaction.commit()

        navigationView.setNavigationItemSelectedListener {
            if (!isLoggedIn) {
                Toast.makeText(this, "Please log in", Toast.LENGTH_SHORT).show()
                false
            } else {
                it.isChecked = true
                drawerLayout.closeDrawers()
                val transaction = supportFragmentManager.beginTransaction()
                if (it.title == getString(R.string.main)) {
                    val testFragment = TestFragment()
                    transaction.replace(R.id.root, testFragment)
                } else if (it.title == getString(R.string.history)) {
                    val historyFragment = HistoryFragment()
                    transaction.replace(R.id.root, historyFragment)
                }
//                supportFragmentManager.popBackStack()
                transaction.addToBackStack("test")
                transaction.commit()
                true
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        Intent(this, SensorService::class.java).also {
            stopService(it)
        }
    }

    fun onLoginSuccess(token: String) {
        this.token = token
        this.isLoggedIn = true
        val testFragment = TestFragment()
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.root, testFragment)
        transaction.addToBackStack("test")
        transaction.commit()
    }

}