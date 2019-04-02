//
//  FlowCell.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/27/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

class FlowCell: UITableViewCell {

    @IBOutlet weak var flowNameLabel: UILabel!
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        flowNameLabel.font = UIFont.systemFont(ofSize: 16)
        selectionStyle = .none
    }
    
    func update(flow: Flow, filteredBy: String) {
        self.flowNameLabel.text = flow.name
    }
}
