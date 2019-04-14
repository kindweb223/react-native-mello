//
//  KeyboardHelper.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 4/3/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class KeyboardHelper {
  
  private var keyboardHeight: CGFloat? = nil
  let viewController: UIViewController
  let centerConstraint: NSLayoutConstraint
  let heightConstraint: NSLayoutConstraint
  
  private var didShow = false
  private var normalHeight: CGFloat = UIScreen.main.bounds.height / 4 * 3
  
  init(viewController: UIViewController, centerConstraint: NSLayoutConstraint, heightConstraint: NSLayoutConstraint) {
    self.viewController = viewController
    self.centerConstraint = centerConstraint
    self.heightConstraint = heightConstraint
    
    self.heightConstraint.constant = normalHeight
    self.viewController.view.layoutIfNeeded()
    
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow(_:)), name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillDismiss(_:)), name: UIResponder.keyboardWillHideNotification, object: nil)
  }
  
  deinit {
    NotificationCenter.default.removeObserver(self)
  }
  
  @objc func keyboardWillShow(_ notification: Notification) {
    guard !didShow else {
      return
    }
    didShow = true
    
    var height: CGFloat = 300
    if let keyboardHeight = keyboardHeight {
      height = keyboardHeight
    } else {
      if let keyboardInfo = notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue {
        keyboardHeight = keyboardInfo.cgRectValue.size.height
        height = keyboardHeight!
      }
    }
    
    viewController.view.layoutIfNeeded()
    UIView.animate(withDuration: 0.35) {
      self.centerConstraint.constant -= (height / 2)
      let safeArea = (UIApplication.shared.keyWindow?.safeAreaInsets.top ?? 0) + (UIApplication.shared.keyWindow?.safeAreaInsets.bottom ?? 0)
      self.heightConstraint.constant = UIScreen.main.bounds.height - height - 32 - safeArea
      self.viewController.view.layoutIfNeeded()
    }
  }
  
  @objc func keyboardWillDismiss(_ notification: Notification) {
    guard didShow else {
      return
    }
    didShow = false
    
    viewController.view.layoutIfNeeded()
    UIView.animate(withDuration: 0.35) {
      self.centerConstraint.constant += ((self.keyboardHeight ?? 300) / 2)
      self.heightConstraint.constant = self.normalHeight
      self.viewController.view.layoutIfNeeded()
    }
  }
}
