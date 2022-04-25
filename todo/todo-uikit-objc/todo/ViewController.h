//
//  ViewController.h
//  todo
//
//  Created by Wenqi He on 6/25/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController <UITableViewDataSource, UITableViewDelegate>

@property NSIndexPath *selectedIndex;

@end

