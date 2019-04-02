//
//  FlowSelectorViewController.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/27/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol FlowSelectorViewControllerDelegate: class {
    func flowSelectorViewControllerDidTapBack(_ vc: FlowSelectorViewController)
    func flowSelectorViewController(_ vc: FlowSelectorViewController, didSelectFlow selectedFlow: Flow)
    func flowSelectorViewController(_ vc: FlowSelectorViewController, didTapNewFlowWithSearchText searchText: String?)
}

class FlowSelectorViewController: UIViewController {
    
    @IBOutlet weak var navigationBarContainerView: UIView!
    @IBOutlet weak var searchBar: UISearchBar!
    @IBOutlet weak var tableView: UITableView!
    
    weak var delegate: FlowSelectorViewControllerDelegate?
    
    private var flows: [Flow]
    private var filteredFlows: [Flow]
    
    enum Section: Int {
        case newFlow, flows
    }
    
    init(flows: [Flow]) {
        self.flows = flows
        self.filteredFlows = flows
        
        super.init(nibName: String(describing: FlowSelectorViewController.self), bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()

        setupNavigationBar(backButton: true, title: "Choose flow", rightButton: nil)
        
        tableView.register(UINib(nibName: String(describing: NewFlowCell.self), bundle: nil), forCellReuseIdentifier: String(describing: NewFlowCell.self))
        tableView.register(UINib(nibName: String(describing: FlowCell.self), bundle: nil), forCellReuseIdentifier: String(describing: FlowCell.self))
        
        tableView.delegate = self
        tableView.dataSource = self
        searchBar.delegate = self
        tableView.reloadData()
    }
}

extension FlowSelectorViewController: UISearchBarDelegate {
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        if searchText == "" {
            filteredFlows = flows
        } else {
            filteredFlows = flows.filter({ $0.name.lowercased().contains(searchText.lowercased()) })
        }
        tableView.reloadData()
    }
}

extension FlowSelectorViewController: UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 2
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        switch Section(rawValue: section)! {
        case .newFlow:
            return 1
        case .flows:
            return filteredFlows.count
        }
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        switch Section(rawValue: indexPath.section)! {
        case .newFlow:
            let cell = tableView.dequeueReusableCell(withIdentifier: String(describing: NewFlowCell.self)) as! NewFlowCell
            
            return cell
        case .flows:
            let cell = tableView.dequeueReusableCell(withIdentifier: String(describing: FlowCell.self)) as! FlowCell
            cell.update(flow: filteredFlows[indexPath.item], filteredBy: "")
            return cell
        }
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        switch Section(rawValue: indexPath.section)! {
        case .newFlow:
            return 52
        case .flows:
            return 48
        }
    }
}

extension FlowSelectorViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        searchBar.resignFirstResponder()
        switch Section(rawValue: indexPath.section)! {
        case .newFlow:
            delegate?.flowSelectorViewController(self, didTapNewFlowWithSearchText: searchBar.text)
        case .flows:
            delegate?.flowSelectorViewController(self, didSelectFlow: filteredFlows[indexPath.item])
        }
    }
}

extension FlowSelectorViewController: ShareNavigationable {
    func navigationDidTapBack() {
        searchBar.resignFirstResponder()
        delegate?.flowSelectorViewControllerDidTapBack(self)
    }
    
    func navigationDidTapCancel() {
        
    }
    
    func navigationDidTapRightButton() {
        
    }
}
