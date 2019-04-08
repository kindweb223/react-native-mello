//
//  VideoViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 4/8/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import UIKit
import AVFoundation

protocol VideoViewControllerDelegate: class {
  func videoViewControllerDidTapCancel(_ vc: VideoViewController)
  func videoViewController(_ vc: VideoViewController, wantsToCreateCard videoUrl: URL, text: String, flow: Flow?)
  func videoViewControllerDidTapFlows(_ vc: VideoViewController)
}

class VideoViewController: UIViewController {
  
  @IBOutlet weak var footerContainerView: UIView!
  @IBOutlet weak var navigationBarContainerView: UIView!
  
  @IBOutlet weak var imageView: UIImageView!
  @IBOutlet weak var imageViewHeightConstraint: NSLayoutConstraint!
  @IBOutlet weak var scrollView: UIScrollView!
  @IBOutlet weak var textViewHeightConstraint: NSLayoutConstraint!
  @IBOutlet weak var textView: UITextView!
  
  weak var delegate: VideoViewControllerDelegate?
  
  private let placeholder = "Add a note"
  private let placeholderColor = #colorLiteral(red: 0.6666666865, green: 0.6666666865, blue: 0.6666666865, alpha: 1)
  private let videoURL: URL
  
  init(url: URL) {
    self.videoURL = url
    
    super.init(nibName: String(describing: VideoViewController.self), bundle: nil)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    imageView.contentMode = .scaleAspectFill
    imageView.layer.cornerRadius = 5
    imageView.layer.masksToBounds = true
    
    setupNavigationBar(backButton: false, title: nil, rightButton: "Create card")
    loadImage()
    textView.delegate = self
    textView.text = placeholder
    textView.textColor = placeholderColor
    textView.font = UIFont.systemFont(ofSize: 16)
    
    setupFooterView()
  }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    
    updateFooterView(selectedFlow: nil)
  }
  
  func loadImage() {
    let asset = AVURLAsset(url: videoURL, options: nil)
    let imgGenerator = AVAssetImageGenerator(asset: asset)
    let cgImage = try? imgGenerator.copyCGImage(at: CMTimeMake(value: 0, timescale: 1), actualTime: nil)
    // !! check the error before proceeding
    if let cgImage = cgImage {
      let thubnail = UIImage(cgImage: cgImage).compressImage()
      
      self.imageView.image = thubnail
    }
  }
}

extension VideoViewController: UITextViewDelegate {
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

extension VideoViewController: ShareNavigationable {
  func navigationDidTapBack() {
    
  }

  func navigationDidTapCancel() {
    textView.resignFirstResponder()
    delegate?.videoViewControllerDidTapCancel(self)
  }
  
  func navigationDidTapRightButton() {
    textView.resignFirstResponder()
    let text = textView.text == placeholder ? "" : textView.text
    delegate?.videoViewController(self, wantsToCreateCard: videoURL, text: text ?? "", flow: selectedFlow())
  }
}

extension VideoViewController: FlowFooterSelectable {
  func flowSelectorDidReceiveTap(_ selector: FlowSelectorFooter?) {
    delegate?.videoViewControllerDidTapFlows(self)
  }
}
