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
  func bottomStatusViewController(_ vc: BottomStatusViewController, wantsToOpenFlow flow: Flow)
}

class BottomStatusViewController: UIViewController {
  
  enum State {
    case loading, step(count: Int, total: Int), success(flow: Flow, imageUrl: URL?), error
  }
  
  @IBOutlet weak var titleLabel: UILabel!
  @IBOutlet weak var bottomConstraint: NSLayoutConstraint!
  @IBOutlet weak var messageContainerView: UIView!
  @IBOutlet weak var imageView: FLAnimatedImageView!
  @IBOutlet var labelCenterConstraint: NSLayoutConstraint!
  @IBOutlet var labelLeftConstraint: NSLayoutConstraint!
  @IBOutlet weak var messageContainerViewCenterConstraint: NSLayoutConstraint!
    
  private var assetLoader: AssetLoader? = nil
  private var state: State
  private var flow: Flow?
  
  private var startingPositionX: CGFloat?
  
  var shouldDismiss = true
  
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
    
    imageView.layer.masksToBounds = true
    imageView.contentMode = .scaleAspectFill
    imageView.layer.cornerRadius = 7
    
    messageContainerView.isUserInteractionEnabled = true
    
    update(state, animated: false)
  }
  
  @objc func didTapView(_ sender: UITapGestureRecognizer) {
    switch state {
    case .loading, .step(_, _):
      return
    default:
      dismiss(didTap: messageContainerView.frame.contains(sender.location(in: view)))
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
      labelLeftConstraint.isActive = false
      labelCenterConstraint.isActive = true
    case .success(let flow, let imageUrl):
      self.flow = flow
      let savedTo = NSMutableAttributedString(string: "Saved to ", attributes: [.font: UIFont.systemFont(ofSize: 20),
                                                                                .foregroundColor: UIColor.white])
      let flowName = NSAttributedString(string: flow.name, attributes: [.font: UIFont.boldSystemFont(ofSize: 20),
                                                                        .foregroundColor: UIColor.white])
      savedTo.append(flowName)
      titleLabel.attributedText = savedTo
      if let imageUrl = imageUrl {
        assetLoader = AssetLoader(url: imageUrl, index: 0)
        assetLoader?.delegate = self
        assetLoader?.loadIfNeeded()
        
        labelLeftConstraint.isActive = true
        labelCenterConstraint.isActive = false
      }

      Timer.scheduledTimer(withTimeInterval: 3, repeats: false) { [weak self] _ in
        if self?.shouldDismiss ?? false { self?.dismiss() }
      }
    case .error:
      titleLabel.text = "Oops! Something went wrong"
      labelLeftConstraint.isActive = false
      labelCenterConstraint.isActive = true
      
      Timer.scheduledTimer(withTimeInterval: 3, repeats: false) { [weak self] _ in
        if self?.shouldDismiss ?? false { self?.dismiss() }
      }
    case .step(let count, let total):
      titleLabel.text = "Uploading \(count) of \(total)..."
      labelLeftConstraint.isActive = false
      labelCenterConstraint.isActive = true
    }
  }
  
  func dismiss(didTap: Bool = false) {
    self.view.layoutIfNeeded()
    UIView.animate(withDuration: 0.3, animations: { [weak self] in
      self?.bottomConstraint.constant = -100
      self?.view.layoutIfNeeded()
    }) { _ in
      if didTap, let flow = self.flow {
        self.delegate?.bottomStatusViewController(self, wantsToOpenFlow: flow)
      } else {
        self.delegate?.bottomStatusViewControllerDidDismiss(self)
      }
    }
  }
  
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    switch state {
    case .success, .error:
      guard let touch = touches.first else { return }
      let touchLocation = touch.location(in: view)
      
      if messageContainerView.frame.contains(touchLocation) {
        startingPositionX = touchLocation.x
      }
    default: return
    }
  }
  
  override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
    guard let touch = touches.first,
      let startingPositionX = startingPositionX else { return }
    let touchLocation = touch.location(in: view)
    
    let diff = startingPositionX - touchLocation.x
    

      self.messageContainerViewCenterConstraint.constant = -diff
      self.view.layoutIfNeeded()
  }
  
  override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
    guard let _ = startingPositionX else { return }
    self.startingPositionX = nil
    
    touchesEnded()
  }
  
  override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
    guard let _ = startingPositionX else { return }
    self.startingPositionX = nil
    
    touchesEnded()
  }
  
  func touchesEnded() {
    self.view.layoutIfNeeded()
    
    if self.messageContainerViewCenterConstraint.constant > 75 {
      UIView.animate(withDuration: 0.3, delay: 0, options: .curveEaseIn, animations: {
        self.messageContainerViewCenterConstraint.constant = 600
        self.view.layoutIfNeeded()
      }, completion: { _ in
        self.delegate?.bottomStatusViewControllerDidDismiss(self)
      })
    } else if self.messageContainerViewCenterConstraint.constant < -75 {
      UIView.animate(withDuration: 0.3, delay: 0, options: .curveEaseIn, animations: {
        self.messageContainerViewCenterConstraint.constant = -600
        self.view.layoutIfNeeded()
      }, completion: { _ in
        self.delegate?.bottomStatusViewControllerDidDismiss(self)
      })
    } else {
      UIView.animate(withDuration: 0.3, delay: 0, options: .curveEaseOut, animations: {
        self.messageContainerViewCenterConstraint.constant = 0
        self.view.layoutIfNeeded()
      }, completion: nil)
    }
  }
}

extension BottomStatusViewController: AssetLoaderDelegate {
  func assetLoader(_ assetLoader: AssetLoader, didFinishLoadingWithIndex index: Int) {
    switch assetLoader.state {
    case .gif(let gif):
      imageView.animatedImage = gif
    case .image(let image):
      imageView.image = image
    default:
      break
    }
  }
}
