//
//  ViewController.swift
//  SittingTimeTracker
//
//  Created by Wenqi He on 1/13/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

import UIKit
import CoreMotion

class ViewController: UIViewController {
    
  
  @IBOutlet weak var displayText: UILabel!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    self.title = "Sitting Time Tracker"
    (UIApplication.shared.delegate as! AppDelegate).mainVC = self
  }
  
  @IBAction func viewHistory(_ sender: Any) {
    self.navigationController!.pushViewController(HistoryViewController(), animated: true)
  }
  
}
