//
//  BottomStatusViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/29/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol BottomStatusViewControllerDelegate: class {
    func bottomStatusViewControllerDidDismiss(_ vc: BottomStatusViewController)
}

class BottomStatusViewController: UIViewController {
    
    enum State {
        case loading, step(count: Int, total: Int), success, error
    }

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var bottomConstraint: NSLayoutConstraint!
    @IBOutlet weak var messageContainerView: UIView!
    
    private var state: State
    
    weak var delegate: BottomStatusViewControllerDelegate?
    
    init(state: State) {
        self.state = state
        super.init(nibName: String(describing: BottomStatusViewController.self), bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        modalPresentationStyle = .overCurrentContext
        view.backgroundColor = UIColor.white.withAlphaComponent(0.01)
        view.addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(didTapView(_:))))
        view.isUserInteractionEnabled = true
        
        titleLabel.textColor = .white
        titleLabel.font = UIFont.boldSystemFont(ofSize: 26)
        
        messageContainerView.layer.cornerRadius = 10
        messageContainerView.backgroundColor = UIColor.black
        
        update(state, animated: false)
    }

    @objc func didTapView(_ sender: UITapGestureRecognizer) {
        switch state {
        case .loading:
            return
        default:
            dismiss()
        }
    }
    
    func update(_ state: State, animated: Bool = true) {
        self.state = state
        
        view.layoutIfNeeded()
        if animated {
            UIView.animate(withDuration: 0.1, animations: {
                self.bottomConstraint.constant += 20
                self.view.layoutIfNeeded()
            }) { _ in
                UIView.animate(withDuration: 0.15, animations: {
                    self.bottomConstraint.constant -= 28
                    self.view.layoutIfNeeded()
                }, completion: { _ in
                    UIView.animate(withDuration: 0.2, animations: {
                        self.bottomConstraint.constant += 8
                        self.view.layoutIfNeeded()
                    }, completion: nil)
                })
            }
        }
        switch state {
        case .loading:
            titleLabel.text = "Loading..."
        case .success:
            titleLabel.text = "Success!"
            Timer.scheduledTimer(withTimeInterval: 2, repeats: false) { [weak self] _ in
                self?.dismiss()
            }
        case .error:
            titleLabel.text = "Error"
            Timer.scheduledTimer(withTimeInterval: 2, repeats: false) { [weak self] _ in
                self?.dismiss()
            }
        case .step(let count, let total):
            titleLabel.text = "Uploading \(count) of \(total)..."
        }
    }
    
    func dismiss() {
        self.view.layoutIfNeeded()
        UIView.animate(withDuration: 0.3, animations: { [weak self] in
            self?.bottomConstraint.constant = -100
            self?.view.layoutIfNeeded()
        }) { _ in
            self.delegate?.bottomStatusViewControllerDidDismiss(self)
        }
    }
}
