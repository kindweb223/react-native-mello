//
//  ShareNavigationBar.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/20/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

class ShareNavigationBar: UIView {
    @IBOutlet weak var leftButton: UIButton!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var rightButton: UIButton!
    @IBOutlet weak var separatorView: UIView!
    
    var backPressHandler: (() -> Void)?
    var cancelPressHandler: (() -> Void)?
    var rightButtonPressHandler: (() -> Void)?
    
    private var backButton: Bool = false
    
    class func loadFromNib() -> ShareNavigationBar {
        return Bundle.main.loadNibNamed(String(describing: ShareNavigationBar.self), owner: self, options: nil)!.first as! ShareNavigationBar
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        titleLabel.font = UIFont.systemFont(ofSize: 17, weight: .semibold)
        titleLabel.textColor = UIColor.darkText
        
        separatorView.backgroundColor = #colorLiteral(red: 0.7921568627, green: 0.7921568627, blue: 0.7921568627, alpha: 1)
        
        rightButton.setTitleColor(#colorLiteral(red: 0.2901960784, green: 0, blue: 0.8, alpha: 1), for: .normal)
        leftButton.setTitleColor(#colorLiteral(red: 0.2901960784, green: 0, blue: 0.8, alpha: 1), for: .normal)
    }
    
    func update(backButton: Bool, title: String?, rightButtonTitle: String?) {
        self.backButton = backButton
        self.titleLabel.text = title
        
        if let rightButtonTitle = rightButtonTitle {
            rightButton.setTitle(rightButtonTitle, for: .normal)
            rightButton.isHidden = false
        } else {
            rightButton.isHidden = true
        }
        
        if backButton {
            leftButton.setImage(#imageLiteral(resourceName: "button_back").withRenderingMode(.alwaysOriginal), for: .normal)
            leftButton.setTitle("", for: .normal)
        } else {
            leftButton.setTitle("Cancel", for: .normal)
            leftButton.setImage(nil, for: .normal)
        }
        
    }
    
    @IBAction func didPressLeftButton(_ sender: Any) {
        if backButton {
            backPressHandler?()
        } else {
            cancelPressHandler?()
        }
    }
    
    @IBAction func didPressRightButton(_ sender: Any) {
        rightButtonPressHandler?()
    }
}
