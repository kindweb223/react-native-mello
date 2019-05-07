//
//  AssetLoader.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/20/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit

protocol AssetLoaderDelegate: class {
  func assetLoader(_ assetLoader: AssetLoader, didFinishLoadingWithIndex index: Int)
}

func ==(lhs: AssetLoader.State, rhs: AssetLoader.State) -> Bool {
  switch (lhs, rhs) {
  case (.nothing, .nothing):
    return true
  case (.loading, .loading):
    return true
  case (.image, .image):
    return true
  case (.gif, .gif):
    return true
  case (.error, .error):
    return true
  default:
    return false
  }
}

class AssetLoader {
  enum State {
    case nothing, loading, image(image: UIImage), gif(gif: FLAnimatedImage), error
  }
  
  let url: URL
  let index: Int
  var state: State = .nothing
  
  weak var delegate: AssetLoaderDelegate?
  
  var size: CGSize {
    switch state {
    case .gif(let gif):
      return gif.size
    case .image(let image):
      return image.size
    default: return .zero
    }
  }
  
  init(url: URL, index: Int) {
    self.url = url
    self.index = index
  }
  
  func loadIfNeeded() {
    guard self.state == State.nothing else { return }
    state = .loading
    DispatchQueue.global().async {
      let fileExtension = self.url.pathExtension
      if fileExtension.lowercased() == "gif" {
        self.loadGIF()
      } else if fileExtension.lowercased() == "webp" {
        self.loadWebP()
      } else {
        self.loadImage()
      }
      
      DispatchQueue.main.async {
        self.delegate?.assetLoader(self, didFinishLoadingWithIndex: self.index)
      }
    }
  }
  
  func loadImage() {
    do {
      let data = try Data(contentsOf: self.url)
      if let image = UIImage(data: data) {
        self.state = .image(image: image)
      } else {
        self.state = .error
      }
    } catch {
      self.state = .error
    }
  }
  
  func loadWebP() {
    do {
      let data = try Data(contentsOf: self.url)
      let image = UIImage(webpWithData: data as NSData)
      self.state = .image(image: image)
    } catch {
      self.state = .error
    }
  }
  
  func loadGIF() {
    do {
      let data = try Data(contentsOf: self.url)
      
      if let image = FLAnimatedImage(gifData: data) {
        self.state = .gif(gif: image)
      } else {
        self.state = .error
      }
    } catch {
      self.state = .error
    }
  }
}
