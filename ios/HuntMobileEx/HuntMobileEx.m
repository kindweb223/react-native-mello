//
//  HuntMobileEx.m
//  HuntMobileEx
//
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReactNativeShareExtension.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@interface HuntMobileEx : ReactNativeShareExtension
@end

@implementation HuntMobileEx

RCT_EXPORT_MODULE();

- (UIView*) shareView {
    NSURL *jsCodeLocation;
    
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"HuntMobileEx"
                                                 initialProperties:nil
                                                     launchOptions:nil];
    rootView.backgroundColor = nil;
    return rootView;
}

@end
