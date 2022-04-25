//
//  AppDelegate.swift
//  Two Factor
//
//  Created by Wenqi He on 12/24/18.
//  Copyright © 2018 Wenqi He. All rights reserved.
//

import UIKit
import Foundation
import UserNotifications

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {

  var window: UIWindow?
  var deviceToken: String? // Testing

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    let center = UNUserNotificationCenter.current()
    center.delegate = self

    // Register notification category for customized actions
    let confirmAction = UNNotificationAction(identifier: "CONFIRM_ACTION", title: "Confirm", options: .authenticationRequired)
    let confirmationCategory = UNNotificationCategory(
      identifier: "CONFIRMATION",
      actions: [confirmAction],
      intentIdentifiers: [],
      options: UNNotificationCategoryOptions(rawValue: 0)
    )
    center.setNotificationCategories([confirmationCategory])
    
    // IMPORTANT: must be authorized to display alerts
    center.requestAuthorization(options: [.alert]) { (granted, err) in
      if let err = err { print(err.localizedDescription) }
      if granted { print("Authorization granted for alerts") }
    }
    
    // Request devide token
    UIApplication.shared.registerForRemoteNotifications()
    
    return true
  }

  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    self.deviceToken = deviceToken.hexEncodedString()
    print("From AppDelegate: Registration success!")
    
    do {
      let url = URL(string: "http://two-factor-galmungral.herokuapp.com/ios/device-token")!
      print(deviceToken.description)
      let json = try JSONSerialization.data(withJSONObject: [ "token": deviceToken.hexEncodedString() ], options: [])
      var request = URLRequest(url: url)
      request.httpMethod = "POST"
      request.addValue("application/json", forHTTPHeaderField: "Content-Type")
      request.httpBody = json
      let task = URLSession.shared.dataTask(with: request) { (data, res, err) in
        if err != nil { print(String(describing: err)) }
        if let data = data { self.handleJsonData(data) }
      }
      task.resume()
    } catch {
      print(error)
    }
    
  }
  
  private func handleJsonData(_ data: Data) {
    do {
      let json = try JSONSerialization.jsonObject(with: data, options: [])
      print(String(describing: json))
    } catch {
      print("Error: \(error)")
    }
  }
  
  
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    print("Will present notification: \(notification.request.content.title)")
        completionHandler(UNNotificationPresentationOptions.alert) // Display the alert anyways
  }
  
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    print("Did receive response")
    if response.actionIdentifier == "CONFIRM_ACTION" {
      do {
        let url = URL(string: "http://two-factor-galmungral.herokuapp.com/confirm")!
        let json = try JSONSerialization.data(withJSONObject: [ "username": "retarded" ], options: [])
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = json
        let task = URLSession.shared.dataTask(with: request) { (data, res, err) in
          if err != nil { print(String(describing: err)) }
          if let data = data { self.handleJsonData(data) }
        }
        task.resume()
      } catch {
        print(error)
      }
    }
    completionHandler()
  }

}

extension Data {
  func hexEncodedString() -> String {
    return map { String(format: "%02hhx", $0) }.joined()
  }
}

