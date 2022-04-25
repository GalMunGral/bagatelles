//
//  TodoData.m
//  todo
//
//  Created by Wenqi He on 6/26/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

#import "TodoData.h"

NSInteger INIT_NUM_ITEMS = 3;

@implementation TodoItem

+ (instancetype) makeItem {
  TodoItem *item = [[TodoItem alloc] initWithTitle:@"A title" details:@"Some details"];
  return item;
}

- initWithTitle:(NSString *)title details:(NSString *)details {
  self = [super init];
  if (self) {
    if (title == nil || details == nil) {
      return nil;
    }
    self.title = [NSMutableString stringWithFormat:@"%@", title];
    self.details = [NSMutableString stringWithFormat:@"%@", details];
    self.priority = Normal;
    self.done = NO;
    self.dirty = NO;
    return self;
  }
  return nil;
}

@end
@implementation TodoData

static TodoData *_current = nil;

- (instancetype)init
{
  self = [super init];
  if (self) {
    self.todoItems = [NSMutableArray arrayWithCapacity:20];
    for (int i = 0; i < INIT_NUM_ITEMS; i++) {
      TodoItem *item = [TodoItem makeItem];
      [item.title appendString:[NSString stringWithFormat:@" %d", i]];
      [self.todoItems addObject:item];
    }
  }
  return self;
}

+ (instancetype) current {
  if (_current == nil) {
    _current = [[TodoData alloc] init];
  }
  return _current;
}

@end
