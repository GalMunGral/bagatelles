//
//  ViewController.m
//  todo
//
//  Created by Wenqi He on 6/25/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

#import "ViewController.h"
#import "DetailViewController.h"
#import "TodoData.h"

NSString *CELL_ID = @"test-identifier";

@interface ViewController ()

@end

@implementation ViewController

- (instancetype)init {
  self = [super init];
  if (self != nil) {
    self.title = @"Test";
    self.selectedIndex = nil;
    return self;
  }
  return nil;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  self.tabBarItem = [[UITabBarItem alloc] initWithTitle:@"yo" image: [UIImage imageNamed:@"list"] selectedImage:nil];
  
  UITableView *tableView = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStylePlain];
  tableView.dataSource = self;
  tableView.delegate = self;
//  [tableView registerClass:[UITableViewCell class] forCellReuseIdentifier:CELL_ID];
  self.view = tableView;
  
  self.navigationItem.rightBarButtonItem =
    [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemAdd target:self action:@selector(addItem)];
  self.navigationItem.leftBarButtonItem =
  [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemEdit target:self action:@selector(editTodoList)];
}

- (void)viewDidAppear:(BOOL)animated {
  if (self.selectedIndex == nil) {
    // Display newly created item
    [((UITableView *)self.view) reloadData];
    return;
  }
  // Reload updated row
  TodoItem *item = TodoData.current.todoItems[self.selectedIndex.row];
  if (item.dirty) {
    [((UITableView *)self.view) reloadRowsAtIndexPaths:@[self.selectedIndex] withRowAnimation:UITableViewRowAnimationTop];
    item.dirty = NO;
  }
  [((UITableView *)self.view) deselectRowAtIndexPath:self.selectedIndex animated:YES];
  self.selectedIndex = nil;
}

// Action methods
- (void)addItem {
  DetailViewController *vc = [[DetailViewController alloc] initWithIndex:-1];
  UINavigationController *navigation = [[UINavigationController alloc] initWithRootViewController:vc];
  [self presentViewController:navigation animated:YES completion:nil];
}

- (void)cancelEditing {
  [((UITableView *) self.view) setEditing:NO animated:YES];
  self.navigationItem.leftBarButtonItem =
    [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemEdit target:self action:@selector(editTodoList)];
}

- (void)editTodoList {
  [((UITableView *) self.view) setEditing:YES animated:YES];
  self.navigationItem.leftBarButtonItem =
    [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemDone target:self action:@selector(cancelEditing)];
}


// Implementation: UITableViewDataSource
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath {
  if (editingStyle == UITableViewCellEditingStyleDelete) {
    NSInteger index = indexPath.row;
    [TodoData.current.todoItems removeObjectAtIndex:index];
//    [((UITableView *)self.view) reloadRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationLeft];
    [((UITableView *)self.view) reloadData];
  }
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
  return TodoData.current.todoItems.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
  UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CELL_ID];
  // Set styles
  if (cell == nil) {
    cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:CELL_ID];
  }
  // Fetch data
  TodoItem *item = TodoData.current.todoItems[indexPath.row];
  cell.textLabel.text = item.title;
  cell.detailTextLabel.text = item.details;
  return cell;
}

// Implementation: UITableviewDelegate
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
  // Push detail VC, passing in its index
  self.selectedIndex = indexPath;
  DetailViewController *vc = [[DetailViewController alloc] initWithIndex:indexPath.row];
  [self.navigationController pushViewController:vc animated:YES];
}


@end

