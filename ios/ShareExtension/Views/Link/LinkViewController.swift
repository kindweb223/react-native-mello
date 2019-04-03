//
//  LinkViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/20/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol LinkViewControllerDelegate: class {
  func linkViewControllerDidTapCloseButton(_ vc: LinkViewController)
  func linkViewControllerDidTapBackButton(_ vc: LinkViewController)
  func linkViewControllerDidTapFlows(_ vc: LinkViewController)
  func linkViewController(_ vc: LinkViewController, didTapCreateCard withParsedUrl: ParsedURL, description: String,
                          imagesWithSize: [ImageURLWithSize], selectedFlow: Flow?)
}

class LinkViewController: UIViewController {
  
  @IBOutlet weak var scrollView: UIScrollView!
  @IBOutlet weak var navigationBarContainerView: UIView!
  @IBOutlet weak var imageView: FLAnimatedImageView!
  @IBOutlet weak var linkViewContainer: UIView!
  @IBOutlet weak var imageViewHeightConstraint: NSLayoutConstraint!
  
  @IBOutlet weak var multipleImageContainerView: UIView!
  @IBOutlet weak var multipleImageLabel: UILabel!
  
  @IBOutlet weak var textViewHeightConstraint: NSLayoutConstraint!
  @IBOutlet weak var textView: UITextView!
  
  @IBOutlet weak var footerContainerView: UIView!
  
  weak var delegate: LinkViewControllerDelegate?
  
  private var assetLoader: AssetLoader?
  private var parsedURL: ParsedURL
  private var selectedAssets: [AssetLoader]?
  private var flowSelectorFooter: FlowSelectorFooter!
  
  private let placeholder = "Add a note"
  private let placeholderColor = #colorLiteral(red: 0.6666666865, green: 0.6666666865, blue: 0.6666666865, alpha: 1)
  
  private let hideImage: Bool
  
  init(selectedAssets: [AssetLoader], parsedURL: ParsedURL, hideImage: Bool) {
    self.parsedURL = parsedURL
    self.selectedAssets = selectedAssets
    self.hideImage = hideImage
    
    super.init(nibName: String(describing: LinkViewController.self), bundle: nil)
  }
  
  init(parsedURL: ParsedURL, hideImage: Bool) {
    self.parsedURL = parsedURL
    self.selectedAssets = nil
    self.hideImage = hideImage
    
    super.init(nibName: String(describing: LinkViewController.self), bundle: nil)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    setupNavigationBar(backButton: selectedAssets != nil, title: nil, rightButton: "Create card")
    setupFooterView()
    imageView.contentMode = .scaleAspectFill
    
    imageView.layer.cornerRadius = 5
    imageView.layer.masksToBounds = true
    
    if let assets = selectedAssets {
      updateImages(assets)
    } else {
      updateImage(parsedURL.images.first)
    }
    addLinkView(url: parsedURL.url, faviconURL: parsedURL.faviconURL)
    
    view.isUserInteractionEnabled = true
    
    multipleImageContainerView.layer.cornerRadius = 5
    multipleImageContainerView.backgroundColor = #colorLiteral(red: 0.9254901961, green: 0.9254901961, blue: 0.9254901961, alpha: 1)
    multipleImageLabel.text = "+\((selectedAssets?.count ?? 0) - 1)"
    multipleImageContainerView.isHidden = selectedAssets?.count ?? 0 <= 1
    
    textView.delegate = self
    textView.font = UIFont.systemFont(ofSize: 16)
  }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    
    updateTextView(parsedURL.description)
    updateFooterView(selectedFlow: nil)
  }
  
  private func updateImages(_ assets: [AssetLoader]) {
    guard let firstAsset = assets.first else {
      updateImage(parsedURL.images.first)
      return
    }
    switch firstAsset.state {
    case .gif(let gif):
      imageView.animatedImage = gif
      updateImageViewHeight(gif.posterImage)
    case .image(let image):
      imageView.image = image
      updateImageViewHeight(image)
    default:
      print("Shouldn't be here lols")
    }
  }
  
  private func updateImage(_ imageURL: URL?) {
    guard let imageURL = imageURL, !hideImage else {
        imageViewHeightConstraint.constant = -16
        return
    }
    assetLoader = AssetLoader(url: imageURL, index: 0)
    assetLoader?.delegate = self
    DispatchQueue.global().async {
      self.assetLoader?.loadIfNeeded()
    }
  }
  
  private func addLinkView(url: URL, faviconURL: URL) {
    let linkView = LinkView.loadFromNib()
    linkView.translatesAutoresizingMaskIntoConstraints = false
    linkViewContainer.addSubview(linkView)
    
    linkViewContainer.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": linkView]))
    linkViewContainer.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": linkView]))
    
    linkView.update(url, faviconURL: faviconURL)
  }
  
  private func updateTextView(_ text: String) {
    if text == "" {
      textView.text = placeholder
      textView.textColor = placeholderColor
    } else {
      textView.text = text
      textView.textColor = .black
    }
    textViewDidChange(textView)
  }
}

extension LinkViewController: UITextViewDelegate {
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

extension LinkViewController: AssetLoaderDelegate {
  func assetLoader(_ assetLoader: AssetLoader, didFinishLoadingWithIndex index: Int) {
    switch assetLoader.state {
    case .gif(let gif):
      updateImageViewHeight(gif.posterImage)
      imageView.animatedImage = gif
    case .image(let image):
      updateImageViewHeight(image)
      imageView.image = image
    case .error:
      print("ERROR LOADING ASSET")
    case .loading, .nothing:
      break
    }
  }
  
  private func updateImageViewHeight(_ image: UIImage, animated: Bool = false) {
    view.layoutIfNeeded()
    UIView.animate(withDuration: animated ? 0.3 : 0) {
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

extension LinkViewController: ShareNavigationable {
  func navigationDidTapBack() {
    textView.resignFirstResponder()
    delegate?.linkViewControllerDidTapBackButton(self)
  }
  
  func navigationDidTapCancel() {
    textView.resignFirstResponder()
    delegate?.linkViewControllerDidTapCloseButton(self)
  }
  
  func navigationDidTapRightButton() {
    
    var imagesWithSize: [ImageURLWithSize] = []
    if let selectedAssets = selectedAssets {
      imagesWithSize = selectedAssets.map({ (url: $0.url, size: $0.size) })
    } else if !hideImage, parsedURL.images.count > 0, let size = imageView.image?.size {
      imagesWithSize = [( url: parsedURL.images.first!, size: size )]
    }
    
    delegate?.linkViewController(self, didTapCreateCard: parsedURL, description: textView.text ?? "", imagesWithSize: imagesWithSize, selectedFlow: selectedFlow())
  }
}

extension LinkViewController: FlowFooterSelectable {
  func flowSelectorDidReceiveTap(_ selector: FlowSelectorFooter?) {
    textView.resignFirstResponder()
    delegate?.linkViewControllerDidTapFlows(self)
  }
}

extension UIImageView {
  public func imageFromURL(_ url: URL) {
    self.image = nil
    URLSession.shared.dataTask(with: url, completionHandler: { (data, response, error) -> Void in
      guard let data = data else { return }
      DispatchQueue.main.async(execute: { () -> Void in
        let image = UIImage(data: data)
        self.image = image
      })
      
    }).resume()
  }
}
