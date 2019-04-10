//
//  MainNavigationController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/29/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

class MainNavigationController {
    weak var vc: UIViewController!
    weak var containerView: UIView!
    var viewControllersStack: [UIViewController] = []
    
    weak var bottomButton: UIButton!
    weak var bottomButtonTopConstraint: NSLayoutConstraint!
    
    init(vc: UIViewController,
         containerView: UIView,
         bottomButton: UIButton,
         bottomButtonTopConstraint: NSLayoutConstraint!) {
        self.vc = vc
        self.containerView = containerView
        self.bottomButton = bottomButton
        self.bottomButtonTopConstraint = bottomButtonTopConstraint
    }
    
    func presentInitial(vc: UIViewController) {
        self.vc.addChild(vc)
        self.containerView.addSubview(vc.view)
        vc.view.translatesAutoresizingMaskIntoConstraints = false
        self.containerView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": vc.view]))
        self.containerView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": vc.view]))
        vc.didMove(toParent: self.vc)
        viewControllersStack.append(vc)
    }
    
    func push(fromVC: UIViewController, toViewController toVC: UIViewController) {
        fromVC.addChild(toVC)
        fromVC.view.addSubview(toVC.view)
        toVC.view.translatesAutoresizingMaskIntoConstraints = false
        fromVC.view.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:[view(\(UIScreen.main.bounds.width - 32)@1000)]", options: [], metrics: nil, views: ["view": toVC.view]))
        fromVC.view.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": toVC.view]))
        let leftMarginConstraint = NSLayoutConstraint(item: toVC.view, attribute: .leading, relatedBy: .equal, toItem: fromVC.view, attribute: .leading, multiplier: 1, constant: fromVC.view.frame.width)
        leftMarginConstraint.priority = UILayoutPriority(1000)
        fromVC.view.addConstraint(leftMarginConstraint)
        toVC.didMove(toParent: fromVC)
        
        fromVC.view.layoutIfNeeded()
        
        viewControllersStack.append(toVC)
        UIView.animate(withDuration: 0.20, delay: 0, options: .curveEaseIn, animations: {
            leftMarginConstraint.constant = 0
            fromVC.view.layoutIfNeeded()
        }, completion: nil)
    }
    
    func pop(vc: UIViewController) {
        guard let leftConstraint = vc.view.superview!.constraints.filter({ $0.firstItem as? UIView == vc.view && $0.firstAttribute == NSLayoutConstraint.Attribute.leading }).first else { return }
        vc.view.superview!.layoutIfNeeded()
        UIView.animate(withDuration: 0.25, animations: {
            leftConstraint.constant = self.containerView.frame.width
            vc.view.superview!.layoutIfNeeded()
        }) { _ in
            vc.view.removeFromSuperview()
            if let index = self.viewControllersStack.firstIndex(of: vc) {
                self.viewControllersStack.remove(at: index)
            }
        }
    }
    
    func showBottomButton(withTitle title: String) {
        let attributtedTitle = NSAttributedString(string: title,
                                                  attributes: [NSAttributedString.Key.font: UIFont.systemFont(ofSize: 17, weight: .semibold)])
        bottomButton.setAttributedTitle(attributtedTitle, for: .normal)
        bottomButtonTopConstraint.constant = 50
        
        vc.view.layoutIfNeeded()
        UIView.animate(withDuration: 0.25) {
            self.bottomButton.alpha = 1
            self.bottomButtonTopConstraint.constant = 8
            self.vc.view.layoutIfNeeded()
        }
    }
    
    func hideBottomButton() {
        self.vc.view.layoutIfNeeded()
        UIView.animate(withDuration: 0.25) {
            self.bottomButton.alpha = 0
            self.bottomButtonTopConstraint.constant = 50
            self.vc.view.layoutIfNeeded()
        }
    }
}
