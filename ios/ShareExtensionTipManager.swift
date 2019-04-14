//
//  ShareExtensionTip.swift
//  Mello
//
//  Created by Andrei on 2019/2/10.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation


@objc(ShareExtensionTipManager)
class ShareExtensionTipManager: RCTViewManager {
  override func view() -> UIView! {
    return ShareExtensionTip()
  }
  // this is required since RN 0.49+
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // @objc func updateFromManager(_ node: NSNumber, count: NSNumber) {
  //   DispatchQueue.main.async {
  //     let component = self.bridge.uiManager.view(
  //       forReactTag: node
  //       ) as! ShareExtensionTip
  //     component.update(value: count)
  //   }
  // }
 
}
