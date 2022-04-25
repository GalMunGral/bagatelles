//
//  EmptyViewController.m
//  todo
//
//  Created by Wenqi He on 6/27/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

#import "EmptyViewController.h"

@interface EmptyViewController ()

@end

@implementation EmptyViewController

- (instancetype)init {
  self = [super init];
  if (self != nil) {
    self.tabBarItem.title = @"Done";
    self.tabBarItem.image = [UIImage imageNamed:@"done"];
    return self;
  }
  return nil;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  self.view.backgroundColor = UIColor.whiteColor;
  UILabel *label = [[UILabel alloc] init];
  label.text = @"To be implemented";
  [self.view addSubview:label];
  [label setTranslatesAutoresizingMaskIntoConstraints:NO];
  [[label.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor] setActive:YES];
  [[label.centerYAnchor constraintEqualToAnchor:self.view.centerYAnchor] setActive:YES];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
