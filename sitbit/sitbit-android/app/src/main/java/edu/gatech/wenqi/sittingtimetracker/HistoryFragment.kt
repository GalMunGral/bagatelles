package edu.gatech.wenqi.sittingtimetracker

import android.annotation.TargetApi
import android.os.Bundle
import android.support.v4.app.Fragment
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import kotlinx.android.synthetic.main.fragment_history.*
import java.util.*
import kotlin.concurrent.schedule

@TargetApi(23)
class HistoryFragment : Fragment() {
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_history, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        webView.webViewClient = object: WebViewClient() {
            override fun onReceivedError(view: WebView?, request: WebResourceRequest?, error: WebResourceError?) {
                super.onReceivedError(view, request, error)
                Log.d("TEST", error?.description as String)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                Timer("hideProgress", false).schedule(2000) {
                    activity?.runOnUiThread {
                        progressBar.visibility = View.GONE
                    }
                }
            }
        }

        webView.settings.javaScriptEnabled = true
        webView.isVerticalScrollBarEnabled = false
        webView.loadUrl("http://${getString(R.string.server_ip)}/?token=${(activity as MainActivity).token}")
    }
}