//
//  AppDelegate.swift
//  SittingTimeTracker
//
//  Created by Wenqi He on 1/13/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

import UIKit
import CoreMotion
import CoreLocation

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, CLLocationManagerDelegate {

  var window: UIWindow?
  var mainVC: ViewController?
  
  var motionManager: CMMotionManager?
  var locationManager: CLLocationManager?
  var timer: Timer?
  let queue = OperationQueue()
  var prevAcceleration = 0.0

  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    
    // Use background location updates to keep app awake in the background
    // (At least when user is moving)
    self.locationManager = CLLocationManager()
    locationManager!.delegate = self
    if (CLLocationManager.authorizationStatus() != .authorizedAlways) {
      locationManager!.requestAlwaysAuthorization()
    }
    locationManager!.desiredAccuracy = kCLLocationAccuracyBestForNavigation
    locationManager!.allowsBackgroundLocationUpdates = true
    locationManager!.startUpdatingLocation()

    // Start monitoring device motion
    self.motionManager = CMMotionManager()
    motionManager!.deviceMotionUpdateInterval = 1.0 / 60.0
    motionManager!.startDeviceMotionUpdates(using: .xArbitraryZVertical)
    
    self.timer = Timer.scheduledTimer(withTimeInterval: 1.0 / 60.0, repeats: true, block: { (timer) in
      // Process motion data here
      if let data = self.motionManager!.deviceMotion {
        // Take inner product of gravity and user acceleration
        let acceleration = (
          data.gravity.x * data.userAcceleration.x
            + data.gravity.y * data.userAcceleration.y
            + data.gravity.z * data.userAcceleration.z
          ) / 9.81
        
        if (acceleration.magnitude < 0.01) { return } // THRESHOLD
        
        if (self.prevAcceleration <= 0 && acceleration > 0) {
          self.updateUIWith(text: "아래")
        } else if (self.prevAcceleration >= 0 && acceleration < 0) {
          self.updateUIWith(text: "위")
        }
        self.prevAcceleration = acceleration
      }
    })
    return true
  }
  
  func updateUIWith(text: String) {
    self.mainVC?.displayText.text = text
  }
  
  func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
    print("Authorization status changed")
  }
  
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    // Nothing to implement. This is just to keep the app awake in the background.
  }

}

