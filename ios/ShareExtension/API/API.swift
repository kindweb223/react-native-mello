//
//  API.swift
//  ShareExtension
//
//  Created by Aram Miquel Mateu on 3/20/19.
//  Copyright © 2019 Solvers. All rights reserved.
//

import UIKit
import MobileCoreServices

typealias JSON = [String: Any]
typealias ImageURLWithSize = (url: URL, size: CGSize)

class API {
  
  enum Constants: String {
    case apiErrorNotification = "ERROR_API"
    case userDefaultsGroup = "group.hunt.mobile.token"
    case userDefaultsKey = "xAuthToken"
  }
  
  static let shared: API = API()
  
  private var token: String? {
    return UserDefaults(suiteName: Constants.userDefaultsGroup.rawValue)?
      .string(forKey: Constants.userDefaultsKey.rawValue)?
      .replacingOccurrences(of: "\"", with: "")
  }
  private let parseURLEndpoint = "https://dev-lambda.melloapp.com/url/parse"
  
  private var debugMode = true
  
  #if DEBUG
  private let baseURL = "https://demos.solvers.io/hunt/api/v1/"
  #else
  private let baseURL = "https://api.melloapp.com/hunt/api/v1/"
  #endif
  
  private enum Method: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
  }
  
  private enum Path: String {
    case login = "auth/login"
    case hunts = "hunts"
    case newIdea = "ideas/shareExtension"
    case newTempIdea = "ideas"
    case newFileUploadUrl = "/hunts/{huntId}/ideas/{ideaId}/fileUpload"
    case addFile = "ideas/{ideaId}/files"
    case setCoverImage = "ideas/{ideaId}/cover-image/{fileId}"
    case updateIdea = "ideas/{ideaId}"
  }
  
  private func url(withPath path: Path, replacements: [String: String]?, query: String?) -> URL {
    var pathString = path.rawValue
    for replacement in replacements ?? [:] {
      pathString = pathString.replacingOccurrences(of: replacement.key, with: replacement.value)
    }
    return URL(string: "\(baseURL)\(pathString)\(query ?? "")")!
  }
  
  typealias AuthenticatedRequest = URLRequest
  private func authenticatedRequest(withPath path: Path,
                                    replacements: [String: String]? = nil,
                                    query: String? = nil,
                                    method: Method,
                                    body: Data? = nil) -> AuthenticatedRequest {
    
    var request = URLRequest(url: url(withPath: path, replacements: replacements, query: query))
    request.httpBody = body
    request.httpMethod = method.rawValue
    request.allHTTPHeaderFields = ["x-mobile-api": "true",
                                   "x-auth-token": token ?? "", //"a8b64fdf-0b5a-4b3b-93a1-6e7a490ce5ad"
                                   "Content-Type": "application/json",
                                   "Accept": "application/json",
                                   "Access-Control-Allow-Credentials": "true",
                                   "cache-control": "no-cache"]
    
    if self.debugMode {
      print("[API] request for: [" + request.httpMethod! + "] " + request.url!.absoluteString)
      if let body = body {
        print(String(data: body, encoding: .utf8)!)
      }
    }
    
    return request
  }
  
  private func perform(_ request: AuthenticatedRequest, completion: @escaping (_ json: JSON?, _ error: Error?) -> Void) {
    URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
      guard let data = data else {
        return
      }
      
      if let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) as? JSON {
        DispatchQueue.main.async {
          if let apiError = APIError(json: json) {
            completion(nil, apiError)
            NotificationCenter.default.post(Notification(name: Notification.Name(Constants.apiErrorNotification.rawValue), object: nil, userInfo: ["error": apiError]))
          } else {
            completion(json, nil)
          }
        }
        if self?.debugMode ?? false {
          print("[API] response for: [" + request.httpMethod! + "] " + request.url!.absoluteString)
          print(String(data: try! JSONSerialization.data(withJSONObject: json!, options: .prettyPrinted), encoding: .utf8)!)
        }
      } else if let error = error {
        if self?.debugMode ?? false {
          print("[API] failed for: [" + request.httpMethod! + "] " + request.url!.absoluteString)
          print("-> Error: \(error.localizedDescription)")
        }
        DispatchQueue.main.async {
          completion(nil, error)
        }
      } else {
        if self?.debugMode ?? false {
          print("[API] no data or error for: [" + request.httpMethod! + "] " + request.url!.absoluteString)
          print("-> Response: \(response as Any)")
        }
        // TODO: Aram get error from the API
        DispatchQueue.main.async {
          completion(nil, nil)
        }
      }
      }.resume()
  }
  
  func parseURL(_ url: URL, completion: @escaping (_ parsedURL: ParsedURL?) -> Void) {
    DispatchQueue.global(qos: .userInitiated).async {
      var request = URLRequest(url: URL(string: self.parseURLEndpoint)!)
      request.httpMethod = "POST"
      request.httpBody = try? JSONSerialization.data(withJSONObject: ["url": url.absoluteString], options: .prettyPrinted)
      URLSession.shared.dataTask(with: request) { data, response, error in
        guard let data = data,
          let jsonOptional = try? JSONSerialization.jsonObject(with: data, options: JSONSerialization.ReadingOptions.allowFragments),
          let json = jsonOptional as? [String: Any] else {
            return
        }
        
        DispatchQueue.main.async {
          completion(ParsedURL(json: json))
        }
        }.resume()
    }
  }
  
  // MARK: Auth
  func login(completion: @escaping (_ success: Bool) -> ()) {
    let username = "aramiquelmateu@gmail.com"
    let password = "gugmib-Qeckyt-xegco1"
    
    let dictBody = ["username": username, "password": password]
    let dataBody = try? JSONSerialization.data(withJSONObject: dictBody, options: .prettyPrinted)
    
    let request = authenticatedRequest(withPath: .login, method: .post, body: dataBody)
    
    URLSession.shared.dataTask(with: request) { data, response, error in
      guard let response = response as? HTTPURLResponse,
        let httpFields = response.allHeaderFields as? [String: String],
        let token = httpFields["x-auth-token"] else {
          completion(false)
          return
      }
      print(token)
      guard let data = data else {
        return
      }
      
      if let json = try? JSONSerialization.jsonObject(with: data, options: .allowFragments) {
        print(json)
      }
      
      completion(true)
      }.resume()
  }
  
  // MARK: Flow
  func getFlows(_ completion: @escaping (_ flows: [Flow]?) -> Void) {
    let request = authenticatedRequest(withPath: .hunts, query: "?archived=false&pinned=false", method: .get)
    perform(request) { json, error in
      guard let json = json,
        let flowsJSON = json["content"] as? [JSON]
        else {
          completion(nil)
          return
      }
      
      completion(flowsJSON.compactMap({ Flow(json: $0) }))
    }
  }
  
  func newFlow(_ flow: Flow, completion: @escaping (_ flowCreated: Flow?) -> Void) {
    let dictBody = ["headline": flow.name,
                    "summary": flow.description,
                    "status": "PUBLISHED"]
    let dataBody = try? JSONSerialization.data(withJSONObject: dictBody, options: .prettyPrinted)
    
    let request = authenticatedRequest(withPath: .hunts, method: .post, body: dataBody)
    
    perform(request) { json, error in
      guard let json = json,
        let flowCreated = Flow(json: json)
        else {
          completion(nil)
          return
      }
      completion(flowCreated)
    }
  }
  
  // MARK: Card
  func newCard(parsedURL: ParsedURL?,
               selectedImageUrls: [ImageURLWithSize],
               text: String,
               inFlow flow: Flow,
               completion: @escaping (_ success: Bool) -> Void) {
    
    var dictBody: JSON = ["huntId": flow.id,
                          "idea": text,
                          "status": "PUBLISHED"]
    
    if let coverImageUrl = selectedImageUrls.first {
      dictBody["coverImage"] = coverImageUrl.url.absoluteString
    }
    
    if let parsedURL = parsedURL {
      
      // Add link
      var link: JSON = ["originalUrl": parsedURL.url.absoluteString,
                        "title": parsedURL.title,
                        "description": parsedURL.description,
                        "faviconUrl": parsedURL.faviconURL.absoluteString]
      
      if let firstImage = parsedURL.images.first {
        link["imageUrl"] = firstImage.absoluteString
      }
      
      dictBody["links"] = [link]
      
      // Add images (files)
      var files: [JSON] = []
      for imageUrl in selectedImageUrls {
        let file: JSON = ["name": (imageUrl.url.absoluteString as NSString).lastPathComponent,
                          "contentType": imageUrl.url.mimeType(),
                          "objectKey": imageUrl.url.absoluteString,
                          "accessUrl": imageUrl.url.absoluteString,
                          "fileType": "MEDIA",
                          "metadata": ["width": Int(imageUrl.size.width),
                                       "height": Int(imageUrl.size.height)]
        ]
        files.append(file)
      }
      
      dictBody["files"] = files
    }
    
    let dataBody = try? JSONSerialization.data(withJSONObject: dictBody, options: .prettyPrinted)
    
    let request = authenticatedRequest(withPath: .newIdea, method: .post, body: dataBody)
    
    perform(request) { json, error in
      completion(json != nil && error == nil)
    }
  }
  
  func newTempCard(forFlow flow: Flow, completion: @escaping (_ cardId: String?) -> Void) {
    let bodyDict = ["huntId": flow.id,
                    "status": "TEMP"]
    let dataBody = try? JSONSerialization.data(withJSONObject: bodyDict, options: .prettyPrinted)
    
    let request = authenticatedRequest(withPath: .newTempIdea, method: .post, body: dataBody)
    
    perform(request) { json, error in
      guard let json = json,
        let id = json["id"] as? String else {
          completion(nil)
          return
      }
      
      completion(id)
    }
  }
  
  struct TempFileURL {
    let objectKey: URL
    let accessUrl: URL
    let uploadUrl: URL
    
    init?(json: JSON) {
      guard let objectKeyString = json["objectKey"] as? String,
        let accessUrlString = json["accessUrl"] as? String,
        let uploadUrlString = json["uploadUrl"] as? String,
        let objectKey = URL(string: objectKeyString),
        let accessUrl = URL(string: accessUrlString),
        let uploadUrl = URL(string: uploadUrlString)
        else {
          return nil
      }
      
      self.objectKey = objectKey
      self.accessUrl = accessUrl
      self.uploadUrl = uploadUrl
    }
  }
  
  // MARK: File uploading
  func getTempFileUrl(forFlow flow: Flow, cardId: String, completion: @escaping (_ : TempFileURL?) -> Void) {
    let request = authenticatedRequest(withPath: .newFileUploadUrl,
                                       replacements: ["{huntId}": flow.id, "{ideaId}": cardId],
                                       method: .get)
    
    perform(request) { json, error in
      guard let json = json, let tempFileUrl = TempFileURL(json: json) else {
        completion(nil)
        return
      }
      
      completion(tempFileUrl)
    }
  }
  
  func saveFile(_ filePath: URL, inURL url: URL, completion: @escaping () -> Void) {
    do {
      let fileData = try Data(contentsOf: filePath)
      
      var request = URLRequest(url: url)
      request.httpMethod = "PUT"
      request.httpBody = fileData
      request.setValue(filePath.mimeType(), forHTTPHeaderField: "Content-Type")
      request.setValue("\(fileData.count)", forHTTPHeaderField: "Content-Length")
      
      URLSession.shared.dataTask(with: request) { data, response, error in
        completion()
        }.resume()
      
    } catch let _ {
      //TODO: @Aram handle error
      completion()
    }
    
    
  }
  
  func saveImage(_ image: UIImage, inURL url: URL, completion: @escaping () -> Void) {
    var request = URLRequest(url: url)
    request.httpMethod = "PUT"
    
    let imageData = image.jpegData(compressionQuality: 0.9)!
    request.httpBody = imageData
    request.setValue("image/png", forHTTPHeaderField: "Content-Type")
    request.setValue("\(imageData.count)", forHTTPHeaderField: "Content-Length")
    
    URLSession.shared.dataTask(with: request) { data, response, error in
      completion()
      }.resume()
  }
  
  enum FileType: String {
    case media = "MEDIA"
    case file = "FILE"
  }
  
  func addFile(_ fileName: String, toCardId: String, mimeType: String, fileType: FileType, tempFileUrl: TempFileURL, size: CGSize?, thumbnail: UIImage?, completion: @escaping (_ fileId: String?) -> Void) {
    var bodyDict: [String: Any] = ["name": fileName,
                                   "contentType": mimeType,
                                   "objectKey": tempFileUrl.objectKey.absoluteString,
                                   "accessUrl": tempFileUrl.accessUrl.absoluteString,
                                   "fileType": fileType.rawValue]
    if let size = size {
      bodyDict["metadata"] = ["height": size.height,
                              "width": size.width]
    }
    
    if let thumbnail = thumbnail,
      let data = thumbnail.jpegData(compressionQuality: 0.9) {
      bodyDict["thumbnailUrl"] = ("'data:image/png;base64,'" + data.base64EncodedString())
    }
    
    let dataBody = try? JSONSerialization.data(withJSONObject: bodyDict, options: .prettyPrinted)
    let request = authenticatedRequest(withPath: .addFile, replacements: ["{ideaId}": toCardId], method: .post, body: dataBody)
    
    perform(request) { json, error in
      completion(json?["id"] as? String ?? nil)
    }
  }
  
  func setCoverImage(forCardId cardId: String, fileId: String, completion: @escaping () -> Void) {
    let bodyDict = ["ideaId": cardId,
                    "fileId": fileId]
    let dataBody = try? JSONSerialization.data(withJSONObject: bodyDict, options: .prettyPrinted)
    let request = authenticatedRequest(withPath: .setCoverImage, replacements: ["{ideaId}": cardId, "{fileId}": fileId], method: .put, body: dataBody)
    perform(request) { json, error in
      completion()
    }
  }
  
  func publishCard(_ cardId: String, text: String, flowId: String, completion: @escaping () -> Void) {
    let bodyDict = ["idea": text,
                    "status": "PUBLISHED",
                    "id": cardId,
                    "huntId": flowId]
    let dataBody = try? JSONSerialization.data(withJSONObject: bodyDict, options: .prettyPrinted)
    let request = authenticatedRequest(withPath: .updateIdea, replacements: ["{ideaId}": cardId], method: .put, body: dataBody)
    
    perform(request) { json, error in
      completion()
    }
  }
}

extension URL {
  func mimeType() -> String {
    let pathExtension = self.pathExtension
    
    if let uti = UTTypeCreatePreferredIdentifierForTag(kUTTagClassFilenameExtension, pathExtension as NSString, nil)?.takeRetainedValue(),
      let mimetype = UTTypeCopyPreferredTagWithClass(uti, kUTTagClassMIMEType)?.takeRetainedValue() {
      return mimetype as String
    }
    return "image/jpg"
  }
}

private extension Data {
  mutating func append(_ string: String, using encoding: String.Encoding = .utf8) {
    if let data = string.data(using: encoding) {
      append(data)
    }
  }
}
