//
//  DetailViewController.m
//  todo
//
//  Created by Wenqi He on 6/25/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

#import "DetailViewController.h"
#import "TodoData.h"

NSString *PLACE_HOLDER = @"Enter some description here";

@interface DetailViewController ()

@end

@implementation DetailViewController

- (instancetype)initWithIndex:(NSInteger)index {
  self = [super init];
  if (self) {
    self.index = index;
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  self.title = self.index == -1 ? @"New Item" : @"Edit Item";
  self.tabBarItem.title = @"Yo";
  self.view.backgroundColor = UIColor.whiteColor;
  
  // Navigation bar button for create mode
  if (self.index == -1) {
    self.navigationItem.leftBarButtonItem =
      [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemCancel target:self action:@selector(discardEdit)];
    self.navigationItem.rightBarButtonItem =
      [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone target:self action:@selector(createNewItem)];
  }
  

  UIStackView *stack = [[UIStackView alloc] initWithArrangedSubviews:@[]];
  [self.view addSubview:stack];
  [stack setTranslatesAutoresizingMaskIntoConstraints:NO];
  stack.alignment = UIStackViewAlignmentFill;
  stack.axis = UILayoutConstraintAxisVertical;
  stack.distribution = UIStackViewDistributionEqualCentering;
  stack.spacing = 20;
  [self.view addConstraints: [NSLayoutConstraint
                              constraintsWithVisualFormat:@"V:|-200-[stack]"
                              options:0 metrics:nil views:@{@"stack": stack}]];
  [self.view addConstraints: [NSLayoutConstraint
                              constraintsWithVisualFormat:@"H:|-50-[stack]-50-|"
                              options:0 metrics:nil views:@{@"stack": stack}]];

  UITextField *titleTextField = [[UITextField alloc] init];
  self.titleTextField = titleTextField;
  titleTextField.delegate = self;
  titleTextField.text = self.index != -1 ? TodoData.current.todoItems[self.index].title : @"";
  titleTextField.placeholder = @"Enter new titlte";
  titleTextField.font = [UIFont systemFontOfSize:25 weight:UIFontWeightHeavy];
  [stack addArrangedSubview:titleTextField];
  [titleTextField setTranslatesAutoresizingMaskIntoConstraints:NO];
  [self.view addConstraints: [NSLayoutConstraint
                              constraintsWithVisualFormat:@"V:[label(50)]"
                              options:0 metrics:nil views:@{@"label": titleTextField}]];
  [self.view addConstraints: [NSLayoutConstraint
                              constraintsWithVisualFormat:@"H:|-[text]-|"
                              options:0 metrics:nil views:@{@"text": titleTextField}]];

  
  UITextView *detailTextView = [[UITextView alloc] initWithFrame:CGRectZero];
  self.detailTextView = detailTextView;
  detailTextView.delegate = self;
  detailTextView.text = self.index != -1 ? TodoData.current.todoItems[self.index].details : PLACE_HOLDER;
  detailTextView.textColor = UIColor.darkGrayColor;
  detailTextView.textColor = UIColor.lightGrayColor;
  [stack addArrangedSubview:detailTextView];
  detailTextView.font = [UIFont systemFontOfSize:20 weight:UIFontWeightRegular];
  [detailTextView setTranslatesAutoresizingMaskIntoConstraints:NO];
  [self.view addConstraints: [NSLayoutConstraint
                              constraintsWithVisualFormat:@"V:[text(300)]"
                              options:0 metrics:nil views:@{@"text": detailTextView}]];
  [self.view addConstraints: [NSLayoutConstraint
                              constraintsWithVisualFormat:@"H:|-[text]-|"
                              options:0 metrics:nil views:@{@"text": detailTextView}]];

}

// Action methods
- (void)discardEdit {
  [self endEditing];
  [self.navigationController dismissViewControllerAnimated:YES completion:nil];
}

- (void)createNewItem {
  [self endEditing];
  TodoItem *newItem = [[TodoItem alloc] initWithTitle:self.titleTextField.text details:self.detailTextView.text];
  [TodoData.current.todoItems addObject:newItem];
  [self.navigationController dismissViewControllerAnimated:YES completion:nil];
}

- (void)endEditing {
  if (self.titleTextField.isFirstResponder) {
    [self.titleTextField resignFirstResponder];
    return;
  }
  if (self.detailTextView.isFirstResponder) {
    [self.detailTextView resignFirstResponder];
    return;
  }
}


// UITextFieldDelegate implementation
- (void)textFieldDidEndEditing:(UITextField *)textField {
  if (self.index != -1) {
    TodoItem *item = TodoData.current.todoItems[self.index];
    [item.title setString:textField.text];
    item.dirty = YES;
  }
}

// UITextViewDelegte implementation
- (BOOL)textViewShouldBeginEditing:(UITextView *)textView {
  if (self.index == -1 && [textView.text isEqualToString:PLACE_HOLDER]) {
    textView.text = @"";
    textView.textColor = UIColor.darkGrayColor;
  }
  return YES;
}

- (void)textViewDidEndEditing:(UITextView *)textView {
  if (self.index != -1) {
    TodoItem *item = TodoData.current.todoItems[self.index];
    [item.details setString:textView.text];
    item.dirty = YES;
  } else if (textView.text.length == 0) {
    textView.text = PLACE_HOLDER;
    textView.textColor = UIColor.lightGrayColor;
  }
}

- (IBAction)testAction {
  [self.navigationController popViewControllerAnimated:YES];
}


// Override touch event handlers
- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [self endEditing];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [super touchesMoved:touches withEvent:event];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [super touchesEnded:touches withEvent:event];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  [super touchesCancelled:touches withEvent:event];
}

- (void)touchesEstimatedPropertiesUpdated:(NSSet<UITouch *> *)touches {
  [super touchesEstimatedPropertiesUpdated:touches];
}

@end
