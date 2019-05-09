//
//  NewFlowViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/27/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol NewFlowViewControllerDelegate: class {
  func newFlowViewControllerDidTapBack(_ vc: NewFlowViewController)
  func newFlowViewController(_ vc: NewFlowViewController, wantsToCreateFlow name: String, description: String)
  func newFlowViewController(_ vc: NewFlowViewController, didCreateNewFlow newFlow: Flow)
}

class NewFlowViewController: UIViewController {
  @IBOutlet weak var containerView: UIView!
  @IBOutlet weak var navigationBarContainerView: UIView!
  @IBOutlet weak var nameTextView: UITextView!
  @IBOutlet weak var descriptionTextView: UITextView!
  @IBOutlet weak var nameTextViewHeightConstraint: NSLayoutConstraint!
  @IBOutlet weak var descriptionTextViewHeightConstraint: NSLayoutConstraint!
  @IBOutlet weak var scrollView: UIScrollView!
  
  weak var delegate: NewFlowViewControllerDelegate?
  
  private let namePlaceholder = "Name your flow"
  private let descriptionPlaceholder = "Tap to give this flow a description"
  
  private var startingFlowName: String? = nil
  
  init() {
    super.init(nibName: String(describing: NewFlowViewController.self), bundle: nil)
  }
  
  convenience init(withFlowName flowName: String?) {
    self.init()
    self.startingFlowName = flowName
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    setupNavigationBar(backButton: true, title: nil, rightButton: "Create flow")
    
    nameTextView.font = UIFont.systemFont(ofSize: 36)
    descriptionTextView.font = UIFont.systemFont(ofSize: 16)
    
    nameTextView.textColor = .lightGray
    descriptionTextView.textColor = .lightGray
    
    nameTextView.text = namePlaceholder
    descriptionTextView.text = descriptionPlaceholder
    
    nameTextView.delegate = self
    descriptionTextView.delegate = self
    
    if let startingFlowName = startingFlowName, startingFlowName != "" {
      nameTextView.text = startingFlowName
      nameTextView.textColor = .black
    }
    
    textViewDidChange(nameTextView)
    textViewDidChange(descriptionTextView)
  }
}

extension NewFlowViewController: UITextViewDelegate {
  func textViewDidBeginEditing(_ textView: UITextView) {
    if textView.text == namePlaceholder || textView.text == descriptionPlaceholder {
      textView.text = nil
      textView.textColor = .black
    }
  }
  
  func textViewDidChange(_ textView: UITextView) {
    let newSize = textView.sizeThatFits(CGSize(width: textView.frame.width, height: CGFloat(MAXFLOAT)))
    
    if newSize.height != textView.frame.height {
      switch textView {
      case descriptionTextView:
        descriptionTextViewHeightConstraint.constant = newSize.height + 24
        descriptionTextView.layoutIfNeeded()
      case nameTextView:
        nameTextViewHeightConstraint.constant = newSize.height + 8
        nameTextView.layoutIfNeeded()
      default:
        break
      }
      
      scrollView.scrollToBottom(animated: false)
    }
  }
  
  func textViewDidEndEditing(_ textView: UITextView) {
    if textView.text.cleaningEmptySpaces() == "" {
      switch textView {
      case descriptionTextView:
        descriptionTextView.text = descriptionPlaceholder
        descriptionTextView.textColor = .lightGray
      case nameTextView:
        nameTextView.text = namePlaceholder
        nameTextView.textColor = .lightGray
      default: break
      }
    }
  }
}


extension NewFlowViewController: ShareNavigationable {
  func navigationDidTapBack() {
    nameTextView.resignFirstResponder()
    descriptionTextView.resignFirstResponder()
    delegate?.newFlowViewControllerDidTapBack(self)
  }
  
  func navigationDidTapCancel() {
    
  }
  
  func navigationDidTapRightButton() {
    guard validateFlowName() else {
      return
    }
    let descriptionText = descriptionTextView.text == descriptionPlaceholder ? "" : descriptionTextView.text
    delegate?.newFlowViewController(self, wantsToCreateFlow: nameTextView.text, description: descriptionText ?? "")
  }
  
  private func validateFlowName() -> Bool {
    guard let nameText = nameTextView.text, nameText != "",
      nameText.cleaningEmptySpaces() != "",
      nameText != namePlaceholder else {
      let label = UILabel(frame: CGRect.zero)
      label.translatesAutoresizingMaskIntoConstraints = false
      label.font = UIFont.systemFont(ofSize: 12)
      label.textColor = .red
      label.text = "Please give your flow a name."
      
      containerView.addSubview(label)
      containerView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-20-[label]-16-|", options: [], metrics: nil, views: ["label": label]))
      containerView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:[name]-(-14)-[label(20)]", options: [], metrics: nil, views: ["label": label, "name": nameTextView]))
      
      nameTextView.backgroundColor = .clear
      descriptionTextView.backgroundColor = .clear
      
      containerView.layoutIfNeeded()
      
      UIView.animate(withDuration: 1, delay: 2, options: .curveLinear, animations: {
        label.alpha = 0
      }) { _ in
        label.removeFromSuperview()
      }
      return false
    }
    return true
  }
}

extension String {
  func cleaningEmptySpaces() -> String {
    return self.replacingOccurrences(of: " ", with: "").replacingOccurrences(of: "\n", with: "")
  }
}
