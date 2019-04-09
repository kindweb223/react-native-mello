//
//  TextViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/22/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol TextViewControllerDelegate: class {
    func textViewControllerDidTapCancel(_ vc: TextViewController)
    func textViewControllerDidTapFlows(_ vc: TextViewController)
    func textViewController(_ vc: TextViewController, didTapCreateCard text: String, inFlow flow: Flow?)
    func textViewController(_ vc: TextViewController, didTapCreateCard text: String, inFlow flow: Flow?, withAttachement attachementPath: URL)
}

class TextViewController: UIViewController {
    
    @IBOutlet weak var navigationBarContainerView: UIView!
    @IBOutlet weak var footerContainerView: UIView!
    @IBOutlet weak var textView: UITextView!
    @IBOutlet weak var textViewHeightConstraint: NSLayoutConstraint!
    
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var attachementView: UIView!
    @IBOutlet weak var attachementLabel: UILabel!
    
    weak var delegate: TextViewControllerDelegate?
    
    private var text: String
    private var attachementPath: URL?
    private var flowSelectorFooter: FlowSelectorFooter!
    
    private let placeholder = "Add a note"
    private let placeholderColor = #colorLiteral(red: 0.6666666865, green: 0.6666666865, blue: 0.6666666865, alpha: 1)
    
    init(text: String, attachementPath: URL?) {
        self.text = text
        self.attachementPath = attachementPath
        
        super.init(nibName: String(describing: TextViewController.self), bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupNavigationBar(backButton: false, title: nil, rightButton: "Create card")
        textView.text = text
        textView.font = UIFont.systemFont(ofSize: 16)
        textView.delegate = self
        
        setupFooterView()
        
        if let attachementPath = attachementPath {
            attachementView.layer.cornerRadius = 5
            attachementView.backgroundColor = #colorLiteral(red: 0.9254901961, green: 0.9254901961, blue: 0.9254901961, alpha: 1)
            attachementLabel.font = UIFont.systemFont(ofSize: 14)
            attachementLabel.textColor =  #colorLiteral(red: 0.2901960784, green: 0, blue: 0.8, alpha: 1)
            
            textView.textColor = placeholderColor
            textView.text = placeholder
            attachementView.isHidden = false
            attachementLabel.text = "\((attachementPath.absoluteString as NSString).lastPathComponent)"
        } else {
            attachementView.isHidden = true
        }
        
        textViewDidChange(textView)
    }
}

extension TextViewController: UITextViewDelegate {
    func textViewDidChange(_ textView: UITextView) {
        let newSize = textView.sizeThatFits(CGSize(width: textView.frame.width, height: CGFloat(MAXFLOAT)))
        
        if newSize.height != textView.frame.height {
            textViewHeightConstraint.constant = newSize.height
            scrollView.scrollToBottom(animated: false)
        }
    }
    
    func textViewDidBeginEditing(_ textView: UITextView) {
        scrollView.scrollToView(view: textView, animated: true)
        
        if textView.text == placeholder {
            textView.text = nil
            textView.textColor = .black
        }
    }
}


extension TextViewController: FlowFooterSelectable {
    func flowSelectorDidReceiveTap(_ selector: FlowSelectorFooter?) {
        textView.resignFirstResponder()
        delegate?.textViewControllerDidTapFlows(self)
    }
}

extension TextViewController: ShareNavigationable {
    func navigationDidTapBack() {
        
    }
    
    func navigationDidTapCancel() {
        textView.resignFirstResponder()
        delegate?.textViewControllerDidTapCancel(self)
    }
    
    func navigationDidTapRightButton() {
        if let attachementPath = attachementPath {
            delegate?.textViewController(self, didTapCreateCard: textView.text, inFlow: selectedFlow(), withAttachement: attachementPath)
        } else {
            delegate?.textViewController(self, didTapCreateCard: textView.text, inFlow: selectedFlow())
        }
    }
}
