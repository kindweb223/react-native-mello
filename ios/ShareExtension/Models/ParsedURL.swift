//
//  ParsedURL.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/20/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import Foundation


class ParsedURL {
  let images: [URL]
  let url: URL
  let faviconURL: URL
  let description: String
  let title: String
  
  init?(json: [String: Any]) {
    guard let imageStringArray = json["images"] as? [String],
      let urlString = json["url"] as? String,
      let url = URL(string: urlString),
      let faviconURLString = json["favicon"] as? String,
      let faviconURL = URL(string: faviconURLString),
      let title = json["title"] as? String
      else {
        return nil
    }
    
    self.images = imageStringArray.compactMap({ URL(string: $0) })
    self.url = url
    self.faviconURL = faviconURL
    self.description = title
    self.title = title
  }
  
  init(url: URL) {
    
    self.url = url
    self.images = []
    self.faviconURL = url
    self.description = (url.host ?? "").replacingOccurrences(of: "www.", with: "").capitalizingFirstLetter()
    self.title = (url.host ?? "").replacingOccurrences(of: "www.", with: "").capitalizingFirstLetter()
  }
}

extension String {
  func capitalizingFirstLetter() -> String {
    return prefix(1).uppercased() + self.lowercased().dropFirst()
  }
}
