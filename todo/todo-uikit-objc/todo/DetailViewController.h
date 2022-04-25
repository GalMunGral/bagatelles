//
//  DetailViewController.h
//  todo
//
//  Created by Wenqi He on 6/25/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface DetailViewController : UIViewController <UITextFieldDelegate, UITextViewDelegate>

@property NSInteger index;
@property UIButton *button;
@property UITextField *titleTextField;
@property UITextView *detailTextView;

- (instancetype) initWithIndex:(NSInteger)index;

@end

NS_ASSUME_NONNULL_END
