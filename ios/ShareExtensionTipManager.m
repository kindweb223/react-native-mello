//
//  ShareExtensionTip.m
//  Mello
//
//  Created by Andrei on 2019/2/10.
//  Copyright © 2019 Facebook. All rights reserved.
//

//#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"

@interface RCT_EXTERN_MODULE(ShareExtensionTipManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(onDismiss, RCTDirectEventBlock)
@end
