//
//  Flow.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/27/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import Foundation

class AllFlows {
  static var shared: AllFlows = AllFlows()
  var flows: [Flow]? = nil
  
  func get(completion:  @escaping (_ flows: [Flow]) -> Void) {
    if let flows = self.flows {
      completion(flows)
      return
    } else {
      API.shared.getFlows { flows in
        DispatchQueue.main.async {
          self.flows = flows
          completion(flows ?? [])
          return
        }
      }
    }
  }
  
  func clean() {
    self.flows = nil
  }
}

class Flow {
  var name: String
  var description: String
  var id: String
  var originalJSON: JSON // Used to set the default Flow
  
  init?(json: JSON) {
    guard let name = json["headline"] as? String,
      let id = json["id"] as? String else {
        return nil
    }
    
    self.name = name
    self.id = id
    self.description = ""
    self.originalJSON = json
  }
  
  init(name: String, description: String) {
    self.name = name
    self.description = description
    self.id = ""
    self.originalJSON = [:]
  }
  
  func createNewJSON() -> JSON {
    return ["headline": name,
            "summary": description,
            "status": "PUBLISHED"]
  }
}
