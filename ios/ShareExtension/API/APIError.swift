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
    if let code = json?["code"] as? String,
        let message = json?["message"] as? String {
      self.code = code
      self.message = message
    } else if let code = json?["status"] as? String,
      code == "INTERNAL_SERVER_ERROR" {
      self.code = code
      self.message = (json?["errors"] as? [String])?.first ?? ""
    } else {
      return nil
    }
  }
}
