//
//  ImagePickerViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/21/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol ImagePickerViewControllerDelegate: class {
    func imagePickerViewControllerDidTapCloseButton(_ vc: ImagePickerViewController)
    func imagePickerViewController(_ vc: ImagePickerViewController, didSelectAssets assets: [AssetLoader], fromParsedURL parsedURL: ParsedURL)
}

class ImagePickerViewController: UIViewController {

    @IBOutlet weak var navigationBarContainerView: UIView!
    @IBOutlet weak var collectionView: UICollectionView!
    
    var parsedURL: ParsedURL
    private var cellModels: [(asset: AssetLoader, selected: Bool, size: CGSize)] = []
    
    weak var delegate: ImagePickerViewControllerDelegate?
    
    init(parsedURL: ParsedURL) {
        self.parsedURL = parsedURL
        
        super.init(nibName: String(describing: ImagePickerViewController.self), bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        setupNavigationBar(backButton: false, title: "Choose images", rightButton: nil)
        
        
        collectionView.delegate = self
        collectionView.dataSource = self
        collectionView.register(UINib(nibName: String(describing: AssetCell.self), bundle: nil),
                                forCellWithReuseIdentifier: String(describing: AssetCell.self))
        
        for (index, url) in parsedURL.images.enumerated() {
            let asset = AssetLoader(url: url, index: index)
            asset.delegate = self
            cellModels.append((asset: asset, selected: false, size: .zero))
        }
    }
    
    private func updateNextButton() {
        if cellModels.filter({ $0.selected }).count > 0 {
            // Add 'Next' button
            updateNatvigationBar(backButton: false, title: "Choose images", rightButton: "Next")
        } else {
            // Remove 'Next' button
            updateNatvigationBar(backButton: false, title: "Choose images", rightButton: nil)
        }
    }
}

extension ImagePickerViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        cellModels[indexPath.item].selected = !cellModels[indexPath.item].selected
        if let cell = self.collectionView.cellForItem(at: indexPath) as? AssetCell {
            cell.update(cellModels[indexPath.item].asset, selected: cellModels[indexPath.item].selected, animated: true)
        } else {
            collectionView.reloadItems(at: [indexPath])
        }
        
        updateNextButton()
    }
}

extension ImagePickerViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return cellModels.count
    }

    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: String(describing: AssetCell.self), for: indexPath) as! AssetCell
        let model = cellModels[indexPath.item]
        model.asset.loadIfNeeded()
        cell.update(model.asset, selected: model.selected)

        return cell
    }
}

extension ImagePickerViewController: UICollectionViewDelegateFlowLayout {

    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        sizeForItemAt indexPath: IndexPath) -> CGSize {
        return CGSize(width: collectionView.frame.width / 3, height: collectionView.frame.width / 3)
    }

    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        minimumInteritemSpacingForSectionAt section: Int) -> CGFloat {
        return 0
    }

    func collectionView(_ collectionView: UICollectionView,
                        layout collectionViewLayout: UICollectionViewLayout,
                        minimumLineSpacingForSectionAt section: Int) -> CGFloat {
        return 0
    }
}

extension ImagePickerViewController: ShareNavigationable {    
    func navigationDidTapBack() {
        
    }
    
    func navigationDidTapCancel() {
        delegate?.imagePickerViewControllerDidTapCloseButton(self)
    }
    
    func navigationDidTapRightButton() {
        let selectedAssets = cellModels.compactMap({ $0.selected ? $0.asset : nil })
        delegate?.imagePickerViewController(self, didSelectAssets: selectedAssets, fromParsedURL: parsedURL)
    }
}

extension ImagePickerViewController: AssetLoaderDelegate {
    func assetLoader(_ assetLoader: AssetLoader, didFinishLoadingWithIndex index: Int) {
        if let cell = self.collectionView.cellForItem(at: IndexPath(row: index, section: 0)) as? AssetCell {
            cell.update(assetLoader, selected: cellModels[index].selected)
        } else {
            collectionView.reloadItems(at: [IndexPath(row: index, section: 0)])
        }
    }
}
