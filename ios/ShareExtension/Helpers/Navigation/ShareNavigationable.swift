//
//  ShareNavigationable.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/20/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol ShareNavigationable: class {
    var navigationBarContainerView: UIView! { get }
    
    func setupNavigationBar(backButton: Bool, title: String?, rightButton: String?)
    func updateNatvigationBar(backButton: Bool, title: String?, rightButton: String?)
    
    func navigationDidTapBack()
    func navigationDidTapCancel()
    func navigationDidTapRightButton()
}

extension ShareNavigationable {
    func setupNavigationBar(backButton: Bool, title: String?, rightButton: String?) {
        navigationBarContainerView.subviews.forEach({ $0.removeFromSuperview() })
        let navigationBar = ShareNavigationBar.loadFromNib()
        navigationBar.translatesAutoresizingMaskIntoConstraints = false
        navigationBarContainerView.addSubview(navigationBar)
        navigationBarContainerView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": navigationBar]))
        navigationBarContainerView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": navigationBar]))
        
        navigationBar.update(backButton: backButton, title: title, rightButtonTitle: rightButton)
        navigationBarContainerView.layoutIfNeeded()
        
        navigationBar.backPressHandler = { [weak self] in
            self?.navigationDidTapBack()
        }
        
        navigationBar.cancelPressHandler = { [weak self] in
            self?.navigationDidTapCancel()
        }
        
        navigationBar.rightButtonPressHandler = { [weak self] in
            self?.navigationDidTapRightButton()
        }
    }
    
    func updateNatvigationBar(backButton: Bool, title: String?, rightButton: String?) {
        guard let navigationBar = navigationBarContainerView.subviews.first as? ShareNavigationBar else {
            return
        }
        
        navigationBar.update(backButton: backButton, title: title, rightButtonTitle: rightButton)
    }
}
