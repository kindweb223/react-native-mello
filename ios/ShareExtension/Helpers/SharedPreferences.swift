//
//  SharedPreferences.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 4/10/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class SharedPreferences {
  private let userDefaults = UserDefaults(suiteName: "group.hunt.mobile.last.feedo")
  private let recentFlowKey = "CARD_SAVED_LAST_FEEDO_INFO"
  
  func getRecentFlow() -> Flow? {
    if let stringJSON = userDefaults?.string(forKey: recentFlowKey),
      let data = stringJSON.data(using: .utf8),
      let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? JSON,
      let flowJson = json?["currentFeed"] as? JSON,
      let flow = Flow(json: flowJson) {
      return flow
    }
    
    return nil
  }
  
  func setRecentFlow(flow: Flow) {
    let formatter = DateFormatter()
    formatter.dateFormat = "EEEE, MMM d, yyyy hh:mm a"
    let time = formatter.string(from: Date())
    
    let dict: JSON = ["time": time,
                      "feedoId": flow.id,
                      "currentFeed": flow.originalJSON]
    
    let data = try? JSONSerialization.data(withJSONObject: dict, options: [])
    if let data = data,
      let string = String(data: data, encoding: .utf8) {
    
      userDefaults?.set(string, forKey: recentFlowKey)
      userDefaults?.synchronize()
    }
  }
}
