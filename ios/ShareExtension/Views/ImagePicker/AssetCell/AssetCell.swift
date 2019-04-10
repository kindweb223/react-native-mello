//
//  AssetCell.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/8/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

class AssetCell: UICollectionViewCell {

    @IBOutlet weak var loadingView: UIActivityIndicatorView!
    @IBOutlet weak var imageView: FLAnimatedImageView!
    @IBOutlet weak var selectedImageView: UIImageView!
    @IBOutlet weak var imageContainerView: UIView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        loadingView.startAnimating()
        loadingView.hidesWhenStopped = true
        imageView.contentMode = .scaleAspectFill
        imageView.layer.masksToBounds = true
        imageView.layer.cornerRadius = 5
        
        imageContainerView.layer.masksToBounds = false
        imageContainerView.layer.shadowColor = UIColor.black.cgColor
        imageContainerView.layer.shadowOpacity = 0.2
        imageContainerView.layer.shadowOffset = CGSize(width: -0.5, height: 0.5)
        imageContainerView.layer.shadowRadius = 2
        imageContainerView.layer.cornerRadius = 5
        
        layer.shadowPath = UIBezierPath(rect: bounds).cgPath
    }
    
    func update(_ asset: AssetLoader, selected: Bool, animated: Bool = false) {
        switch asset.state {
        case .image(let image):
            self.loadingView.stopAnimating()
            self.imageView.image = image
        case .gif(let gif):
            self.loadingView.stopAnimating()
            self.imageView.animatedImage = gif
        case .loading:
            self.loadingView.startAnimating()
        case .error:
            self.loadingView.startAnimating()
        case .nothing:
            self.loadingView.startAnimating()
        }
        
        if animated {
            UIView.animate(withDuration: 0.05, animations: {
                self.selectedImageView.transform = CGAffineTransform(scaleX: 0.8, y: 0.8)
            }) { _ in
                self.selectedImageView.image = selected ? #imageLiteral(resourceName: "icon_select") : #imageLiteral(resourceName: "icon_selected")
                UIView.animate(withDuration: 0.15, animations: {
                    self.selectedImageView.transform = CGAffineTransform(scaleX: 1.4, y: 1.4)
                }, completion: { _ in
                    UIView.animate(withDuration: 0.2, animations: {
                        self.selectedImageView.transform = CGAffineTransform(scaleX: 1, y: 1)
                    }, completion: nil)
                })
            }
        } else {
            selectedImageView.image = selected ? #imageLiteral(resourceName: "icon_select") : #imageLiteral(resourceName: "icon_selected")
        }
    }
    
    override func prepareForReuse() {
        super.prepareForReuse()
        
        imageView.image = nil
        imageView.animatedImage = nil
    }
}
