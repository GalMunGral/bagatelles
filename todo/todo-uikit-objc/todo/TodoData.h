//
//  TodoData.h
//  todo
//
//  Created by Wenqi He on 6/26/19.
//  Copyright © 2019 Wenqi He. All rights reserved.
//

#import <Foundation/Foundation.h>

typedef enum {
  Low, Normal, High
} Priority;


@interface TodoItem : NSObject

@property NSMutableString *title;
@property NSMutableString *details;
@property Priority priority;
@property BOOL done;
@property BOOL dirty;

- initWithTitle:(NSString *)title details:(NSString *)details;

@end


@interface TodoData : NSObject

@property (class, readonly) TodoData *current;

@property NSMutableArray<TodoItem *> *todoItems;

@end
