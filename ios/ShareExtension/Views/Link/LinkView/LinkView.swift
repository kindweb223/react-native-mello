//
//  LinkView.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/20/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

class LinkView: UIView {
    @IBOutlet weak var urlLabel: UILabel!
    @IBOutlet weak var faviconImageView: UIImageView!
    @IBOutlet weak var containerView: UIView!
    
    
    class func loadFromNib() -> LinkView {
        return Bundle.main.loadNibNamed(String(describing: LinkView.self),
                                        owner: self,
                                        options: nil)!.first as! LinkView
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        containerView.layer.cornerRadius = 5
        containerView.backgroundColor = #colorLiteral(red: 0.9254901961, green: 0.9254901961, blue: 0.9254901961, alpha: 1)
        
        faviconImageView.layer.cornerRadius = 3
        faviconImageView.layer.masksToBounds = true
        
        urlLabel.font = UIFont.systemFont(ofSize: 16)
    }
    
    func update(_ url: URL, faviconURL: URL) {
        let urlString = url.absoluteString.replacingOccurrences(of: "http://", with: "").replacingOccurrences(of: "https://", with: "")  // Remove http/https stuff
        urlLabel.text = urlString
        
        faviconImageView.imageFromURL(faviconURL)
    }
}
