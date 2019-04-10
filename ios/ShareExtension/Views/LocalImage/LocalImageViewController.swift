//
//  LocalImageViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/21/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit
import MobileCoreServices

protocol LocalImageViewControllerDelegate: class {
  func localImageViewControllerDidTapCancel(_ vc: LocalImageViewController)
  func localImageViewControllerDidTapFlows(_ vc: LocalImageViewController)
  func localImageViewController(_ vc: LocalImageViewController, wantsToCreateCard images:[UIImage], text: String, flow: Flow?)
}

class LocalImageViewController: UIViewController {
  
  @IBOutlet weak var footerContainerView: UIView!
  @IBOutlet weak var navigationBarContainerView: UIView!
  @IBOutlet weak var imageView: UIImageView!
  @IBOutlet weak var multipleImageContainerView: UIView!
  @IBOutlet weak var multipleImageLabel: UILabel!
  @IBOutlet weak var imageViewHeightConstraint: NSLayoutConstraint!
  @IBOutlet weak var scrollView: UIScrollView!
  @IBOutlet weak var textViewHeightConstraint: NSLayoutConstraint!
  @IBOutlet weak var textView: UITextView!
  
  private let placeholder = "Add a note"
  private let placeholderColor = #colorLiteral(red: 0.6666666865, green: 0.6666666865, blue: 0.6666666865, alpha: 1)
  
  weak var delegate: LocalImageViewControllerDelegate?
  
  private var imageProviders: [NSItemProvider]
  private var images: [UIImage] = []
  
  init(imageProviders: [NSItemProvider]) {
    self.imageProviders = imageProviders
    
    super.init(nibName: String(describing: LocalImageViewController.self), bundle: nil)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    imageView.contentMode = .scaleAspectFill
    imageView.layer.cornerRadius = 5
    imageView.layer.masksToBounds = true
    
    multipleImageContainerView.layer.cornerRadius = 5
    multipleImageContainerView.backgroundColor = #colorLiteral(red: 0.9254901961, green: 0.9254901961, blue: 0.9254901961, alpha: 1)
    
    
    setupNavigationBar(backButton: false, title: nil, rightButton: "Create card")
    loadImages()
    textView.delegate = self
    textView.text = placeholder
    textView.textColor = placeholderColor
    textView.font = UIFont.systemFont(ofSize: 16)
    
    setupFooterView()
  }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    
  }
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    
    scrollView.scrollToView(view: textView, animated: true)
  }
  
  func loadImages() {
    func addImageSynch(_ image: UIImage) {
      DispatchQueue.main.async {
        self.images.append(image)
        
        // Update front image if it's the first loaded one
        if self.images.count == 1 {
          self.imageView.image = image
          self.updateImageViewHeight(image)
        }
        
        self.multipleImageLabel.text = "+\(self.images.count - 1)"
        self.multipleImageContainerView.isHidden = self.images.count <= 1
      }
    }
    
    for provider in self.imageProviders {
      provider.loadItem(forTypeIdentifier: String(kUTTypeImage), options: [:], completionHandler: { codedItem, error in
        switch codedItem {
        case let image as UIImage:
          if let compressedImage = image.compressImage() {
            addImageSynch(compressedImage)
          }
        case let data as Data:
          if let image = UIImage(data: data),
            let compressedImage = image.compressImage() {
            addImageSynch(compressedImage)
          }
        case let url as URL:
          if let image = UIImage(contentsOfFile: url.path),
            let compressedImage = image.compressImage() {
            addImageSynch(compressedImage)
          } else if let data = try? Data(contentsOf: url),
            let image = UIImage(data: data),
            let compressedImage = image.compressImage() {
            addImageSynch(compressedImage)
          }
        default:
          //There may be other cases...
          print("Unexpected data:", type(of: codedItem))
        }
      })
    }
  }
  
  private func updateImageViewHeight(_ image: UIImage) {
    view.layoutIfNeeded()
    UIView.animate(withDuration: 0.3) {
      self.imageViewHeightConstraint.constant = max(self.imageSize(sourceImage: image, scaledToWidth: self.imageView.frame.width).height, 100)
      self.view.layoutIfNeeded()
    }
  }
  
  func imageSize(sourceImage: UIImage, scaledToWidth: CGFloat) -> CGSize {
    let oldWidth = sourceImage.size.width
    let scaleFactor = scaledToWidth / oldWidth
    
    let newHeight = sourceImage.size.height * scaleFactor
    let newWidth = oldWidth * scaleFactor
    
    return CGSize(width: newWidth, height: newHeight)
  }
}

extension LocalImageViewController: UITextViewDelegate {
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

extension LocalImageViewController: ShareNavigationable {
  func navigationDidTapBack() {
    
  }
  
  func navigationDidTapCancel() {
    textView.resignFirstResponder()
    delegate?.localImageViewControllerDidTapCancel(self)
  }
  
  func navigationDidTapRightButton() {
    textView.resignFirstResponder()
    let text = textView.text == placeholder ? "" : textView.text
    delegate?.localImageViewController(self, wantsToCreateCard: images, text: text ?? "", flow: selectedFlow())
  }
}

extension LocalImageViewController: FlowFooterSelectable {
  func flowSelectorDidReceiveTap(_ selector: FlowSelectorFooter?) {
    textView.resignFirstResponder()
    delegate?.localImageViewControllerDidTapFlows(self)
  }
}

extension UIScrollView {
  func scrollToView(view: UIView, animated: Bool) {
    if let origin = view.superview {
      let childStartPoint = origin.convert(view.frame.origin, to: self)
      scrollRectToVisible(CGRect(x: 0, y: childStartPoint.y, width: 1, height: self.frame.height), animated: animated)
    }
  }
  
  func scrollToTop(animated: Bool) {
    let topOffset = CGPoint(x: 0, y: -contentInset.top)
    setContentOffset(topOffset, animated: animated)
  }
  
  func scrollToBottom(animated: Bool) {
    let bottomOffset = CGPoint(x: 0, y: contentSize.height - bounds.size.height + contentInset.bottom)
    if (bottomOffset.y > 0) {
      setContentOffset(bottomOffset, animated: animated)
    }
  }
}
