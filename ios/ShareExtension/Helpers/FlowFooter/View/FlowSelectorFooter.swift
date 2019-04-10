//
//  FlowSelectorFooter.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/22/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

class FlowSelectorFooter: UIView {
    
    @IBOutlet weak var createInLabel: UILabel!
    @IBOutlet weak var flowNameContainerView: UIView!
    @IBOutlet weak var flowNameIcon: UIImageView!
    @IBOutlet weak var flowNameLabel: UILabel!
    @IBOutlet weak var flowNameActivityIndicator: UIActivityIndicatorView!
    @IBOutlet weak var separator: UIView!
    
    var flowSelectorPressHandler: ((_ selectedFlow: Flow?) -> Void)?
    var state: State = .loading
    var selectedFlow: Flow? = nil
    
    enum State {
        case loading, new(allFlows: [Flow]), selectedFlow(selected: Flow, allFlows: [Flow])
    }
    
    class func loadFromNib() -> FlowSelectorFooter {
        return Bundle.main.loadNibNamed(String(describing: FlowSelectorFooter.self),
                                        owner: self,
                                        options: nil)!.first as! FlowSelectorFooter
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        isUserInteractionEnabled = true
        addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(didReceiveTap(_:))))
        
        flowNameLabel.font = UIFont.systemFont(ofSize: 14)
        flowNameLabel.textColor = #colorLiteral(red: 0.2901960784, green: 0, blue: 0.8, alpha: 1)
        
        flowNameContainerView.backgroundColor = #colorLiteral(red: 0.9254901961, green: 0.9254901961, blue: 0.9254901961, alpha: 1)
        flowNameContainerView.layer.cornerRadius = 5
        
        createInLabel.text = "Create card in:"
        createInLabel.font = UIFont.systemFont(ofSize: 14)
        
        separator.backgroundColor = #colorLiteral(red: 0.9254901961, green: 0.9254901961, blue: 0.9254901961, alpha: 1)

        flowNameIcon.image = UIImage(cgImage: #imageLiteral(resourceName: "button_back").cgImage!, scale: 0.5, orientation: .upMirrored)
    }
    
    func update(_ state: State) {
        self.state = state
        switch state {
        case .loading:
            self.selectedFlow = nil
            flowNameActivityIndicator.startAnimating()
            flowNameIcon.alpha = 0.5
            flowNameLabel.alpha = 0.5
            flowNameLabel.text = "New Flow"
        case .new:
            self.selectedFlow = nil
            flowNameLabel.text = "New flow"
            flowNameLabel.alpha = 1
            flowNameIcon.alpha = 1
            flowNameActivityIndicator.stopAnimating()
        case .selectedFlow(let selectedFlow, _):
            self.selectedFlow = selectedFlow
            flowNameLabel.text = "\(selectedFlow.name)"
            flowNameLabel.alpha = 1
            flowNameIcon.alpha = 1
            flowNameActivityIndicator.stopAnimating()
        }
    }
    
    @objc func didReceiveTap(_ sender: UITapGestureRecognizer) {
        switch state {
        case .loading:
            return
        case .new, .selectedFlow:
            flowSelectorPressHandler?(selectedFlow)
        }
    }
    
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesBegan(touches, with: event)
        
        switch state {
        case .loading:
            
            return
        case .new, .selectedFlow:
            self.flowNameContainerView.alpha = 0.5
        }
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesEnded(touches, with: event)
        
        switch state {
        case .loading:
            
            return
        case .new, .selectedFlow:
            self.flowNameContainerView.alpha = 1
        }
    }
    
    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesCancelled(touches, with: event)
        
        switch state {
        case .loading:
            
            return
        case .new, .selectedFlow:
            self.flowNameContainerView.alpha = 1
        }
    }
}
