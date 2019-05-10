//
//  UIImage+WebPDecoder.swift
//  webp-swift
//
//  Created by Visoom on 06/10/2016.
//  Copyright © 2016 Visoom. All rights reserved.
//
//  Author: Visoom (m.falgari@gmail.com)


import UIKit

//Let's free some memory
private func freeWebPData(info: UnsafeMutableRawPointer?, data: UnsafeRawPointer, size: Int) -> Void {
    free(UnsafeMutableRawPointer(mutating: data))
}

extension UIImage {
    
    //MARK: Inits
    convenience init?(webpWithPath path: String) {
      guard let data = NSData(contentsOfFile: path),
      let image = UIImage.webPDataToCGImage(data: data) else {
        return nil
      }
      
      self.init(cgImage: image)
    }
    
    convenience init?(webpWithPath path: String, andOptions options: [String:Int32]) {
      guard let data = NSData(contentsOfFile: path),
      let image = UIImage.webPDataToCGImage(data: data, withOptions: options) else {
        return nil
      }
      
      self.init(cgImage: image)
    }
    
    convenience init?(webpWithURL url: URL) {
      guard let data = NSData(contentsOf: url),
        let image = UIImage.webPDataToCGImage(data: data) else {
          return nil
      }
      
      self.init(cgImage: image)
    }
    
    convenience init?(webpWithURL url: URL, andOptions options: [String:Int32]) {
      guard let data = NSData(contentsOf: url),
        let image = UIImage.webPDataToCGImage(data: data, withOptions: options) else {
          return nil
      }
      
      self.init(cgImage: image)
    }
    
    convenience init?(webpWithData data: NSData) {
      guard let image = UIImage.webPDataToCGImage(data: data) else {
        return nil
      }
      
      self.init(cgImage: image)
    }
    
    convenience init?(webpWithData data: NSData, andOptions options: [String:Int32]) {
      guard let image = UIImage.webPDataToCGImage(data: data, withOptions: options) else {
        return nil
      }
      
      self.init(cgImage: image)
    }
      
    
    //MARK: WebP Decoder
    //Let's the magic begin
    class private func webPDataToCGImage(data: NSData) -> CGImage? {
        
        var w: CInt = 0
        var h: CInt = 0
        
        //Get image dimensions
        if (!UIImage.webPInfo(data: data, width: &w, height: &h)){
            print("ERROR",w,h)
            return nil
        }
        
        //Data Provider
        var provider: CGDataProvider
        
        //RGBA by default
        let rawData = WebPDecodeRGBA(data.bytes.assumingMemoryBound(to: UInt8.self), data.length, &w, &h)
        
        provider = CGDataProvider(dataInfo: nil, data: rawData!, size: (Int(w)*Int(h)*4), releaseData: freeWebPData)!
        
        return UIImage.webPProviderToCGImage(provider: provider, width: w, height: h)
    }
    
    class private func webPDataToCGImage(data: NSData, withOptions options: [String:Int32]) -> CGImage? {
        
        var w: CInt = 0
        var h: CInt = 0
        
        //Get image dimensions
        if (!UIImage.webPInfo(data: data, width: &w, height: &h)){
            return nil
        }
      
        //Get configs
        var config = UIImage.webPConfig(options: options)
        
        //RGBA by default
        WebPDecode(data.bytes.assumingMemoryBound(to: UInt8.self), data.length, &config)
        
        guard let provider = CGDataProvider(dataInfo: &config, data: config.output.u.RGBA.rgba, size: (Int(w)*Int(h)*4), releaseData: freeWebPData) else {
          return nil
        }
        
        return UIImage.webPProviderToCGImage(provider: provider, width: w, height: h)
    }
    
    //Generate CGImage from decoded data
    class private func webPProviderToCGImage(provider: CGDataProvider, width w: CInt, height h: CInt) -> CGImage? {
        
        let bitmapWithAlpha = CGBitmapInfo(rawValue: CGImageAlphaInfo.last.rawValue)
        
        if let image = CGImage(
            width: Int(w),
            height: Int(h),
            bitsPerComponent: 8,
            bitsPerPixel: 32,
            bytesPerRow: Int(w)*4,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: bitmapWithAlpha,
            provider: provider,
            decode: nil,
            shouldInterpolate: false,
            intent: CGColorRenderingIntent.defaultIntent
            ) {
            return image
        } else {
            return nil
        }
        
    }
    
    //MARK: UTILS
    //Get WebP image info (width and height)
    static private func webPInfo(data: NSData, width: inout CInt, height: inout CInt) -> Bool {
        let statusOk = Int32(1)
        if (WebPGetInfo(data.bytes.assumingMemoryBound(to: UInt8.self), data.length, &width, &height) == statusOk){
            return true
        }
        return false
    }
    
    //Transform swift array into WebPDecoderConfig
    static private func webPConfig(options: [String:Int32]) -> WebPDecoderConfig {
        var config = WebPDecoderConfig()
        
        if let noFancyUpsampling = options["no_fancy_upsampling"] {
            config.options.no_fancy_upsampling = noFancyUpsampling
        } else {
            config.options.no_fancy_upsampling = 1
        }
        
        if let bypassFiltering = options["bypass_filtering"] {
            config.options.bypass_filtering = bypassFiltering
        } else {
            config.options.bypass_filtering = 1
        }
        
        if let useThreads = options["use_threads"] {
            config.options.use_threads = useThreads
        } else {
            config.options.use_threads = 1
        }
        
        if let colorSpace = options["color_space"] {
            config.output.colorspace = WEBP_CSP_MODE(rawValue: UInt32(colorSpace))
        } else {
            config.output.colorspace = MODE_RGBA
        }
        
        return config
    }
}
