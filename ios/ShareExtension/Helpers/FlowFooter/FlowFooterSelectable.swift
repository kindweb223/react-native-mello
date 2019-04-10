//
//  FlowFooterSelectable.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/27/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol FlowFooterSelectable: class {
  var footerContainerView: UIView! { get }
  func setupFooterView()
  func updateFooterView(selectedFlow: Flow?)
  func selectedFlow() -> Flow?
  
  func flowSelectorDidReceiveTap(_ selector: FlowSelectorFooter?)
}

extension FlowFooterSelectable {
  var footerView: FlowSelectorFooter {
    return footerContainerView.subviews.first as! FlowSelectorFooter
  }
  
  func setupFooterView() {
    footerContainerView.subviews.forEach({ $0.removeFromSuperview() })
    
    let footerView = FlowSelectorFooter.loadFromNib()
    footerView.translatesAutoresizingMaskIntoConstraints = false
    
    footerContainerView.addSubview(footerView)
    footerContainerView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": footerView]))
    footerContainerView.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|-0-[view]-0-|", options: [], metrics: nil, views: ["view": footerView]))
    
    footerContainerView.layoutIfNeeded()
    
    
    footerView.flowSelectorPressHandler = { [weak self] selectedFlow in
      self?.flowSelectorDidReceiveTap(self?.footerView)
    }
    
    updateFooterView(selectedFlow: SharedPreferences().getRecentFlow())
  }
  
  func updateFooterView(selectedFlow: Flow?) {
    footerView.update(.loading)
    AllFlows.shared.get { [weak self] flows in
      if let selectedFlow = selectedFlow,
        flows.contains(where: { selectedFlow.name == $0.name }) {
        self?.footerView.update(.selectedFlow(selected: selectedFlow, allFlows: flows))
      } else {
        self?.footerView.update(.new(allFlows: flows))
      }
    }
  }
  
  func selectedFlow() -> Flow? {
    if let selectedFlow = footerView.selectedFlow {
      if selectedFlow.id != "" {
        return selectedFlow
      } else {
        // This is in case we have just created a flow, the ID might be updated async
        return AllFlows.shared.flows?.filter({ $0.name == selectedFlow.name }).first
      }
    }
    
    return nil
  }
}
