//
//  APIError.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 4/2/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

import Foundation

class APIError: Error {
  let code: String
  let message: String
  
  init?(json: JSON?) {
    guard let code = json?["code"] as? String,
        let message = json?["message"] as? String else {
        return nil
    }
    
    self.code = code
    self.message = message
  }
}
