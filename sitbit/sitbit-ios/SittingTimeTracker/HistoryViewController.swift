//
//  HistoryViewController.swift
//  SittingTimeTracker
//
//  Created by Wenqi He on 2/5/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

import UIKit
import WebKit

class HistoryViewController: UIViewController, WKUIDelegate, WKNavigationDelegate, UIScrollViewDelegate {

  var webView: WKWebView!

  override func viewDidLoad() {
    super.viewDidLoad()
    self.title = "History"
    let preferences = WKPreferences()
    preferences.javaScriptEnabled = true
    let configuration = WKWebViewConfiguration()
    configuration.preferences = preferences
    webView = WKWebView(
      frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: UIScreen.main.bounds.height),
      configuration: configuration
    )
    view.addSubview(webView)
    webView.uiDelegate = self
    webView.navigationDelegate = self
    webView.scrollView.delegate = self
    webView.load(URLRequest(url: URL(string: "http://sitting-time-tracker.herokuapp.com")!, cachePolicy: URLRequest.CachePolicy.reloadIgnoringLocalAndRemoteCacheData, timeoutInterval: 60.0))
  }

  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    print(error.localizedDescription)
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    print("Page loaded")
  }

  func scrollViewWillBeginZooming(_ scrollView: UIScrollView, with view: UIView?) {
    scrollView.pinchGestureRecognizer?.isEnabled = false
  }


  /*
  // MARK: - Navigation

  // In a storyboard-based application, you will often want to do a little preparation before navigation
  override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
      // Get the new view controller using segue.destination.
      // Pass the selected object to the new view controller.
  }
  */

}
