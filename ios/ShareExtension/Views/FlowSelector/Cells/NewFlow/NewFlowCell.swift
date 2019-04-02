//
//  NewFlowCell.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/27/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

class NewFlowCell: UITableViewCell {
    
    @IBOutlet weak var createNewFlowLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        
        createNewFlowLabel.font = UIFont.systemFont(ofSize: 16)
        createNewFlowLabel.textColor = #colorLiteral(red: 0.2901960784, green: 0, blue: 0.8, alpha: 1)
        selectionStyle = .none
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
    }
}
