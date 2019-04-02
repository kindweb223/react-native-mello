//
//  ShareViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/6/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit
import Social
import MobileCoreServices

class MainViewController: UIViewController {
    
    @IBOutlet weak var containerView: UIView!
    @IBOutlet weak var containerViewCenterConstraint: NSLayoutConstraint!
    @IBOutlet weak var navigationBarContainerView: UIView!
    @IBOutlet var ghostViews: [UIView]!
    
    @IBOutlet weak var bottomButtonTopConstraint: NSLayoutConstraint!
    @IBOutlet weak var bottomButton: UIButton!
    
    private var navController: MainNavigationController!
    
    private var keyboardHeight: CGFloat? = nil
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navController = MainNavigationController(vc: self,
                                                 containerView: self.containerView,
                                                 bottomButton: self.bottomButton,
                                                 bottomButtonTopConstraint: self.bottomButtonTopConstraint)
        
        loadContent()
        
        modalPresentationStyle = .overCurrentContext
        view.isUserInteractionEnabled = true
        
        
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillShow(_:)), name: UIResponder.keyboardWillShowNotification, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillDismiss(_:)), name: UIResponder.keyboardWillHideNotification, object: nil)
        
        bottomButton.backgroundColor = UIColor.white.withAlphaComponent(0.94)
        bottomButton.layer.cornerRadius = 10
        bottomButton.setTitleColor(#colorLiteral(red: 0.2901960784, green: 0, blue: 0.8, alpha: 1), for: .normal)
        bottomButton.alpha = 0
        
        API.shared.login { _ in
            API.shared.getFlows { flows in
                flows?.forEach({ print($0.name) })
                print("flows retrieved")
            }
            print("completed")
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        containerView.layer.cornerRadius = 7
        containerView.layer.masksToBounds = true
        containerView.alpha = 0
        containerViewCenterConstraint.constant += 100
        
        setupNavigationBar(backButton: false, title: "Loading...", rightButton: nil)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        self.view.layoutIfNeeded()
        
        UIView.animate(withDuration: 0.25) {
            self.containerView.alpha = 1
            self.view.backgroundColor = UIColor.black.withAlphaComponent(0.6)
            self.containerViewCenterConstraint.constant -= 100
            
            self.view.layoutIfNeeded()
        }
        
        ghostViews.forEach({
            $0.alpha = 0.2
            $0.layer.cornerRadius = 8
            $0.backgroundColor = #colorLiteral(red: 0.8294810557, green: 0.8294810557, blue: 0.8294810557, alpha: 1)
        })
        animateGhostViews()
    }
    
    func animateGhostViews() {
        UIView.animate(withDuration: 0.95, delay: 0, options: .curveEaseInOut, animations: { [weak self] in
            for view in self?.ghostViews ?? [] {
                view.alpha = view.alpha == 1 ? 0.2 : 1
            }
        }) { [weak self] _ in
            self?.animateGhostViews()
        }
    }

    func loadContent() {
        var imageProviders: [NSItemProvider] = []
        
        guard let item = ((extensionContext?.inputItems as? [NSExtensionItem]) ?? []).first else {
            showErrorAndClose("Could not process sharing item")
            return
        }
      
        for provider in getProviderToLoad(providers: item.attachments ?? []){
            if provider.hasItemConformingToTypeIdentifier(String(kUTTypeURL)) {
                print("Loading URL")
                provider.loadItem(forTypeIdentifier: String(kUTTypeURL), options: nil) { codedItem, error in
                    DispatchQueue.main.async {
                        switch codedItem {
                        case let url as URL:
                            if url.isFileURL {
                                let imageFormats = ["gif", "jpeg", "png", "gif"]
                                if imageFormats.contains((url.absoluteString as NSString).pathExtension) {
                                    self.showLocalImage([provider])
                                    return
                                } else {
                                    self.showText("", withAttachement: url)
                                    return
                                }
                            } else {
                                API.shared.parseURL(url, completion: { parsedURL in
                                    guard let parsedURL = parsedURL else {
                                        self.showErrorAndClose("Could not read the provided link")
                                        return
                                    }
                                    if parsedURL.images.count > 1 {
                                        self.showImagePickerVC(parsedURL)
                                        return
                                    } else {
                                        self.showLinkVC(parsedURL)
                                        return
                                    }
                                })
                            }
                        default:
                            print("unexpected codedItem: ", type(of: codedItem))
                        }
                    }
                }
            } else if provider.hasItemConformingToTypeIdentifier(String(kUTTypeText)) {
                print("text found")
                provider.loadItem(forTypeIdentifier: String(kUTTypeText), options: nil) { codedItem, error in
                    DispatchQueue.main.async {
                        switch codedItem {
                        case let text as String:
                            let detector = try? NSDataDetector(types: NSTextCheckingResult.CheckingType.link.rawValue)
                            let matches = detector?.matches(in: text, options: [], range: NSRange(location: 0, length: text.utf16.count))
                            if matches?.count ?? 0 > 0 {
                                guard let range = Range(matches!.first!.range, in: text),
                                    let url = URL(string: String(text[range])) else {
                                        self.showText(text)
                                        return
                                }
                                API.shared.parseURL(url, completion: { parsedURL in
                                    guard let parsedURL = parsedURL else {
                                        self.showText(text)
                                        return
                                    }
                                    if parsedURL.images.count > 1 {
                                        self.showImagePickerVC(parsedURL)
                                        return
                                    } else {
                                        self.showLinkVC(parsedURL)
                                        return
                                    }
                                })
                            } else {
                                self.showText(text)
                            }
                            return
                        default:
                            self.showErrorAndClose("Unexpected codeItem for text")
                        }
                    }
                }
            } else if provider.hasItemConformingToTypeIdentifier(String(kUTTypeImage)) {
                print("Image found")
                imageProviders.append(provider)
            }
        }
        
        if imageProviders.count > 0 {
            showLocalImage(imageProviders)
            return
        }
    }
    
    // Will return link, if there's no link will return images, if there's no images will return text
    func getProviderToLoad(providers: [NSItemProvider]) -> [NSItemProvider] {
        var textProvider: NSItemProvider? // third
        var imageProviders: [NSItemProvider] = [] // second
        
        for provider in providers {
            if provider.hasItemConformingToTypeIdentifier(String(kUTTypeURL)) {
                return [provider] // first
            } else if provider.hasItemConformingToTypeIdentifier(String(kUTTypeText)) {
                textProvider = provider
            } else if provider.hasItemConformingToTypeIdentifier(String(kUTTypeImage)) {
                imageProviders.append(provider)
            }
        }
        
        if imageProviders.count > 0 {
            return imageProviders
        } else if let textProvider = textProvider {
            return [textProvider]
        }
        
        return []
    }
    
    @IBAction func didTapBottomButton(_ sender: UIButton) {
        if let imagePicker = navController.viewControllersStack.last as? ImagePickerViewController {
            let linkVC = LinkViewController(selectedAssets: [], parsedURL: imagePicker.parsedURL)
            linkVC.delegate = self
            navController.hideBottomButton()
            navController.push(fromVC: navController.viewControllersStack.last!, toViewController: linkVC)
        }
    }
    
    private func showLinkVC(_ parsedURL: ParsedURL) {
        let linkVC = LinkViewController(parsedURL: parsedURL)
        linkVC.delegate = self
        navController.presentInitial(vc: linkVC)
    }
    
    private func showImagePickerVC(_ parsedURL: ParsedURL) {
        let imagePickerVC = ImagePickerViewController(parsedURL: parsedURL)
        imagePickerVC.delegate = self
        navController.presentInitial(vc: imagePickerVC)
        
        navController.showBottomButton(withTitle: "Skip")
    }
    
    private func showLocalImage(_ imageProviders: [NSItemProvider]) {
        let localImageVC = LocalImageViewController(imageProviders: imageProviders)
        localImageVC.delegate = self
        navController.presentInitial(vc: localImageVC)
    }
    
    private func showText(_ text: String, withAttachement attachementPath: URL? = nil) {
        let textVC = TextViewController(text: text, attachementPath: attachementPath)
        textVC.delegate = self
        navController.presentInitial(vc: textVC)
    }
    
    @objc func keyboardWillShow(_ notification: Notification) {
        var height: CGFloat = 300
        if let keyboardHeight = keyboardHeight {
            height = keyboardHeight
        } else {
            if let keyboardInfo = notification.userInfo?[UIResponder.keyboardFrameBeginUserInfoKey] as? NSValue {
                keyboardHeight = keyboardInfo.cgRectValue.size.height
                height = keyboardHeight!
            }
        }
        
        view.layoutIfNeeded()
        UIView.animate(withDuration: 0.35) {
            self.containerViewCenterConstraint.constant -= (height / 2)
            self.view.layoutIfNeeded()
        }
    }
    
    @objc func keyboardWillDismiss(_ notification: Notification) {
        view.layoutIfNeeded()
        UIView.animate(withDuration: 0.35) {
            self.containerViewCenterConstraint.constant += ((self.keyboardHeight ?? 300) / 2)
            self.view.layoutIfNeeded()
        }
    }
    
    private func dismissAnimated(_ completion: @escaping () -> Void) {
        self.view.layoutIfNeeded()
        UIView.animate(withDuration: 0.4, animations: {
            self.containerView.alpha = 0
            self.view.backgroundColor = .clear
            self.containerViewCenterConstraint.constant += 200
            self.view.layoutIfNeeded()
        }) { _ in
            completion()
        }
    }
    
    private func dismissAndCreateCard(withParsedUrl: ParsedURL?, description: String, imagesWithSize: [ImageURLWithSize], selectedFlow: Flow?) {
        view.isUserInteractionEnabled = false
        let loadingVC = BottomStatusViewController(state: .loading)
        loadingVC.delegate = self
        present(loadingVC, animated: true, completion: nil)
        dismissAnimated {
            if let selectedFlow = selectedFlow {
                API.shared.newCard(parsedURL: withParsedUrl, selectedImageUrls: imagesWithSize, text: description, inFlow: selectedFlow) { success in
                    if success {
                        loadingVC.update(.success)
                    } else {
                        loadingVC.update(.error)
                    }
                }
            } else {
                API.shared.newFlow(Flow(name: "New flow", description: "")) { flowCreated in
                    guard let flowCreated = flowCreated else {
                        loadingVC.update(.error)
                        return
                    }
                    API.shared.newCard(parsedURL: withParsedUrl, selectedImageUrls: imagesWithSize, text: description, inFlow: flowCreated) { success in
                        if success {
                            loadingVC.update(.success)
                        } else {
                            loadingVC.update(.error)
                        }
                    }
                }
            }
        }
    }
    
    private func showErrorAndClose(_ error: String) {
        let alert = UIAlertController(title: "Error", message: error, preferredStyle: .alert)
        
        alert.addAction(UIAlertAction(title: "Close", style: .cancel, handler: { action in
            self.dismissAnimated {
                self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
            }
        }))
        
        present(alert, animated: true, completion: nil)
    }
}

extension MainViewController: ShareNavigationable {
    func navigationDidTapBack() {
        
    }
    
    func navigationDidTapCancel() {
        dismissAnimated {
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
    
    func navigationDidTapRightButton() {
        
    }
}

extension MainViewController: LinkViewControllerDelegate {
    func linkViewControllerDidTapCloseButton(_ vc: LinkViewController) {
        dismissAnimated {
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
    
    func linkViewControllerDidTapBackButton(_ vc: LinkViewController) {
        navController.pop(vc: vc)
        navController.showBottomButton(withTitle: "Skip")
    }
    
    func linkViewControllerDidTapFlows(_ vc: LinkViewController) {
        AllFlows.shared.get { flows in
            let flowSelectorVC = FlowSelectorViewController(flows: flows)
            flowSelectorVC.delegate = self
            self.navController.push(fromVC: vc, toViewController: flowSelectorVC)
        }
    }
    
    func linkViewController(_ vc: LinkViewController, didTapCreateCard withParsedUrl: ParsedURL, description: String, imagesWithSize: [ImageURLWithSize], selectedFlow: Flow?) {
        dismissAndCreateCard(withParsedUrl: withParsedUrl, description: description, imagesWithSize: imagesWithSize, selectedFlow: selectedFlow)
    }
}

extension MainViewController: ImagePickerViewControllerDelegate {
    func imagePickerViewControllerDidTapCloseButton(_ vc: ImagePickerViewController) {
        navController.hideBottomButton()
        dismissAnimated {
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
    
    func imagePickerViewController(_ vc: ImagePickerViewController, didSelectAssets assets: [AssetLoader], fromParsedURL parsedURL: ParsedURL) {
        navController.hideBottomButton()
        let linkVC = LinkViewController(selectedAssets: assets, parsedURL: parsedURL)
        linkVC.delegate = self
        navController.push(fromVC: vc, toViewController: linkVC)
    }
}

// MARK: LocalImage Delegate
extension MainViewController: LocalImageViewControllerDelegate {
    func localImageViewControllerDidTapFlows(_ vc: LocalImageViewController) {
        AllFlows.shared.get { flows in
            let flowSelectorVC = FlowSelectorViewController(flows: flows)
            flowSelectorVC.delegate = self
            self.navController.push(fromVC: vc, toViewController: flowSelectorVC)
        }
    }
    
    func localImageViewControllerDidTapCancel(_ vc: LocalImageViewController) {
        dismissAnimated {
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
    
    func localImageViewController(_ vc: LocalImageViewController, wantsToCreateCard images: [UIImage], text: String, flow: Flow?) {
        dismissAnimated {
            let loadingVC = BottomStatusViewController(state: .loading)
            loadingVC.delegate = self
            self.present(loadingVC, animated: true, completion: nil)
            
            self.createFlowIfNeeded(flow, completion: { createdFlow in
                guard let createdFlow = createdFlow else {
                    loadingVC.update(.error)
                    return
                }
                self.uploadImagesToNewCard(images, withText: text, forFlow: createdFlow, stepper: { count, total in
                    loadingVC.update(.step(count: count, total: total), animated: false)
                }) { success in
                    if success {
                        loadingVC.update(.success)
                    } else {
                        loadingVC.update(.error)
                    }
                }
            })
        }
    }
    
    func createFlowIfNeeded(_ flow: Flow?, completion: @escaping (_ flow: Flow?) -> Void) {
        if let flow = flow {
            completion(flow)
        } else {
            API.shared.newFlow(Flow(name: "New flow", description: "")) { flowCreated in
                completion(flowCreated)
            }
        }
    }
    
    typealias Stepper = (_ current: Int, _ total: Int) -> Void
    
    func uploadImagesToNewCard(_ images: [UIImage], withText text: String, forFlow flow: Flow, stepper: @escaping Stepper, completion: @escaping (_ success: Bool) -> Void) {
        API.shared.newTempCard(forFlow: flow, completion: { cardId in
            guard let cardId = cardId else {
                completion(false)
                return
            }
            
            self.addImagesToTempCard(images, cardId: cardId, forFlow: flow, stepper: stepper, completion: {
                API.shared.publishCard(cardId, text: text, flowId: flow.id, completion: {
                    completion(true)
                })
            })
        })
    }
    
    func addImagesToTempCard(_ images: [UIImage], cardId: String, forFlow flow: Flow, stepper: @escaping Stepper, completion: @escaping () -> Void) {
        let queue = DispatchGroup()
        var loadingCount = 1
        for image in images {
            queue.enter()
            API.shared.getTempFileUrl(forFlow: flow, cardId: cardId) { tempFileUrl in
                guard let tempFileUrl = tempFileUrl else {
                    stepper(loadingCount, images.count)
                    loadingCount += 1
                    queue.leave()
                    return
                }
                API.shared.saveImage(image, inURL: tempFileUrl.uploadUrl, completion: {
                    API.shared.addFile("image\(images.index(of: image)!)", toCardId: cardId, mimeType: "image/png", fileType: .media, tempFileUrl: tempFileUrl, size: image.size, completion: { fileId in
                        guard let fileId = fileId else {
                            stepper(loadingCount, images.count)
                            loadingCount += 1
                            queue.leave()
                            return
                        }
                        if images.index(of: image)! == 0 {
                            API.shared.setCoverImage(forCardId: cardId, fileId: fileId, completion: {
                                stepper(loadingCount, images.count)
                                loadingCount += 1
                                queue.leave()
                            })
                        } else {
                            stepper(loadingCount, images.count)
                            loadingCount += 1
                            queue.leave()
                        }
                    })
                })
            }
        }
        queue.resume()
        queue.notify(queue: .main) {
            completion()
        }
    }
}

// MARK: Text Delegate
extension MainViewController: TextViewControllerDelegate {
    func textViewControllerDidTapCancel(_ vc: TextViewController) {
        dismissAnimated {
            self.extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
        }
    }
    
    func textViewControllerDidTapFlows(_ vc: TextViewController) {
        AllFlows.shared.get { flows in
            let flowSelectorVC = FlowSelectorViewController(flows: flows)
            flowSelectorVC.delegate = self
            self.navController.push(fromVC: vc, toViewController: flowSelectorVC)
        }
    }
    
    func textViewController(_ vc: TextViewController, didTapCreateCard text: String, inFlow flow: Flow?) {
        dismissAndCreateCard(withParsedUrl: nil, description: text, imagesWithSize: [], selectedFlow: flow)
    }
    
    func textViewController(_ vc: TextViewController, didTapCreateCard text: String, inFlow flow: Flow?, withAttachement attachementPath: URL) {
        dismissAnimated {
            let loadingVC = BottomStatusViewController(state: .loading)
            loadingVC.delegate = self
            self.present(loadingVC, animated: true, completion: nil)
            
            self.createFlowIfNeeded(flow, completion: { createdFlow in
                guard let createdFlow = createdFlow else {
                    loadingVC.update(.error)
                    return
                }
                
                self.uploadFileToNewCard(createdFlow, filePath: attachementPath, completion: { cardId in
                    guard let cardId = cardId else {
                        loadingVC.update(.error)
                        return
                    }
                    API.shared.publishCard(cardId, text: text, flowId: createdFlow.id, completion: {
                        loadingVC.update(.success)
                    })
                })
                
            })
        }
    }
    
    func uploadFileToNewCard(_ flow: Flow, filePath: URL, completion: @escaping (_ cardId: String?) -> Void) {
        API.shared.newTempCard(forFlow: flow) { cardId in
            guard let cardId = cardId else {
                completion(nil)
                return
            }
            API.shared.getTempFileUrl(forFlow: flow, cardId: cardId, completion: { tempFileUrl in
                guard let tempFileUrl = tempFileUrl else {
                    completion(nil)
                    return
                }
                API.shared.saveFile(filePath, inURL: tempFileUrl.uploadUrl, completion: {
                    API.shared.addFile(filePath.lastPathComponent, toCardId: cardId, mimeType: filePath.mimeType(), fileType: .file, tempFileUrl: tempFileUrl, size: nil, completion: { fileId in
                        completion(cardId)
                    })
                })
            })
        }
    }
}

// MARK: FlowSelector Delegate
extension MainViewController: FlowSelectorViewControllerDelegate {
    func flowSelectorViewController(_ vc: FlowSelectorViewController, didTapNewFlowWithSearchText searchText: String?) {
        let newFlowVC = NewFlowViewController(withFlowName: searchText)
        newFlowVC.delegate = self
        
        navController.push(fromVC: vc, toViewController: newFlowVC)
    }
    
    func flowSelectorViewControllerDidTapBack(_ vc: FlowSelectorViewController) {
        navController.pop(vc: vc)
    }
    
    func flowSelectorViewController(_ vc: FlowSelectorViewController, didSelectFlow selectedFlow: Flow) {
        navController.viewControllersStack.forEach({
            if let vc = $0 as? FlowFooterSelectable {
                vc.updateFooterView(selectedFlow: selectedFlow)
            }
        })
        navController.pop(vc: vc)
    }
}

//MARK: NewFlow Delegate
extension MainViewController: NewFlowViewControllerDelegate {
    func newFlowViewController(_ vc: NewFlowViewController, wantsToCreateFlow name: String, description: String) {
        let newFlow = Flow(name: name, description: description)
        
        API.shared.newFlow(newFlow) { createdFlow in
            if let createdFlow = createdFlow {
                AllFlows.shared.clean()
                self.newFlowViewController(vc, didCreateNewFlow: createdFlow)
            }
        }
    }
    
    func newFlowViewControllerDidTapBack(_ vc: NewFlowViewController) {
        navController.pop(vc: vc)
    }
    
    func newFlowViewController(_ vc: NewFlowViewController, didCreateNewFlow newFlow: Flow) {
        
        navController.pop(vc: vc)
        navController.viewControllersStack.forEach({
            if let vc = $0 as? FlowFooterSelectable {
                vc.updateFooterView(selectedFlow: newFlow)
            }
            if let vc = $0 as? FlowSelectorViewController {
                navController.pop(vc: vc)
            }
        })
    }
}

extension MainViewController: BottomStatusViewControllerDelegate {
    func bottomStatusViewControllerDidDismiss(_ vc: BottomStatusViewController) {
        extensionContext?.completeRequest(returningItems: nil, completionHandler: nil)
    }
}
