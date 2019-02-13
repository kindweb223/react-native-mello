//
//  ShareExtensionTip.swift
//

import UIKit

class ShareExtensionTip: UIView {
  
  let numbersize = 22
  let fontsize = CGFloat(14)
  let textcolor = UIColor(red:0.4, green:0.41, blue:0.45, alpha:1)
  let backgroundcolor = UIColor(red:0.97, green:0.97, blue:0.97, alpha:1)
  let numberBackgroundColor = UIColor(red:0.64, green:0.65, blue:0.68, alpha:1)

  let tipView: UIView = UIView()
  
  override init(frame: CGRect) {
    super.init(frame: frame)

    // Define UIActivityViewController
    let items = ["https://melloapp.com"]
    let ac = UIActivityViewController(activityItems: items, applicationActivities: nil)
    ac.view.backgroundColor = backgroundcolor
    ac.view.tintColor = backgroundcolor
    
    ac.completionWithItemsHandler = {
      (activity, success, items, error) in
      self.tipView.removeFromSuperview()
    };
    ac.excludedActivityTypes = [ UIActivity.ActivityType.airDrop ]
    
    // View for instuctions
    var offset = CGFloat(482)
    
    if ac.view.frame.maxY > 736 {
      offset = CGFloat(508)
    }
    
    let view1: UIView = UIView()
    view1.frame=CGRect(x: 8, y:ac.view.frame.maxY - offset, width:ac.view.frame.width - 16, height: 138)
    view1.backgroundColor = backgroundcolor
    view1.layer.cornerRadius = 14
    
    // First instuction
    let labelNum1: UILabel = UILabel()
    let labelTxt1: UILabel = UILabel()
    let image1 = UIImage(named: "dot3.png")
    let imageView1 = UIImageView(image: image1!)
    labelNum1.frame = CGRect(x: 16, y:21, width:numbersize, height:numbersize)
    labelNum1.text = "1"
    labelNum1.font = labelNum1.font.withSize(fontsize)
    labelNum1.backgroundColor = numberBackgroundColor
    labelNum1.textColor = UIColor.white
    labelNum1.textAlignment = .center
    labelNum1.layer.masksToBounds = true
    labelNum1.layer.cornerRadius = CGFloat(numbersize/2)
    labelTxt1.frame=CGRect(x: 50, y:22, width:260, height:20)
    labelTxt1.text = "Swipe the top row and tap More"
    labelTxt1.font = labelTxt1.font.withSize(fontsize)
    labelTxt1.textColor = textcolor
    imageView1.frame = CGRect(x: ac.view.frame.width - 64, y:15, width:32, height:32)
    view1.addSubview(labelNum1)
    view1.addSubview(labelTxt1)
    view1.addSubview(imageView1)

    // Second instuction
    let labelNum2: UILabel = UILabel()
    let labelTxt2: UILabel = UILabel()
    let image2 = UIImage(named: "switch.png")
    let imageView2 = UIImageView(image: image2!)
    labelNum2.frame = CGRect(x: 16, y:60, width:numbersize, height:numbersize)
    labelNum2.text = "2"
    labelNum2.font = labelNum2.font.withSize(fontsize)
    labelNum2.backgroundColor = numberBackgroundColor
    labelNum2.textColor = UIColor.white
    labelNum2.textAlignment = .center
    labelNum2.layer.masksToBounds = true
    labelNum2.layer.cornerRadius = CGFloat(numbersize/2)
    labelTxt2.frame=CGRect(x: 50, y:61, width:260, height:20)
    labelTxt2.text = "Enable Mello and drag it to the top"
    labelTxt2.font = labelTxt1.font.withSize(fontsize)
    labelTxt2.textColor = textcolor
    imageView2.frame = CGRect(x: ac.view.frame.width - 64, y:58, width:37, height:32)
    view1.addSubview(labelNum2)
    view1.addSubview(labelTxt2)
    view1.addSubview(imageView2)

    // Third instuction
    let labelNum3: UILabel = UILabel()
    let labelTxt3: UILabel = UILabel()
    let image3 = UIImage(named: "melloicon.png")
    let imageView3 = UIImageView(image: image3!)
    labelNum3.frame = CGRect(x: 16, y:95, width:numbersize, height:numbersize)
    labelNum3.text = "3"
    labelNum3.font = labelNum3.font.withSize(fontsize)
    labelNum3.backgroundColor = numberBackgroundColor
    labelNum3.textColor = UIColor.white
    labelNum3.textAlignment = .center
    labelNum3.layer.masksToBounds = true
    labelNum3.layer.cornerRadius = CGFloat(numbersize/2)
    labelTxt3.frame=CGRect(x: 50, y:96, width:260, height:20)
    labelTxt3.text = "Tap cancel when you are done"
    labelTxt3.font = labelTxt3.font.withSize(fontsize)
    labelTxt3.textColor = textcolor
    imageView3.frame = CGRect(x: ac.view.frame.width - 64, y:90, width:32, height:32)
    view1.addSubview(labelNum3)
    view1.addSubview(labelTxt3)
    view1.addSubview(imageView3)

    tipView.addSubview(view1)

    // Add tip view as subview so appears above background / backdrop
    UIApplication.shared.keyWindow?.addSubview(tipView)
    
    var rootViewController = UIApplication.shared.keyWindow?.rootViewController
    if let navigationController = rootViewController as? UINavigationController {
      rootViewController = navigationController.viewControllers.first
    }
    if let tabBarController = rootViewController as? UITabBarController {
      rootViewController = tabBarController.selectedViewController
    }
    rootViewController?.present(ac, animated: true, completion: nil)

  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
    
}
