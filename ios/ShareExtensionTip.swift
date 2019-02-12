//
//  ShareExtensionTip.swift
//

import UIKit

class ShareExtensionTip: UIView {
  
  let numbersize = 18
  let fontsize = CGFloat(14)
  let textcolor = UIColor.gray 
  let backgroundcolor = UIColor(red: 0.9, green: 0.9, blue: 0.9, alpha: 1.00)
  
  let tipView: UIView = UIView()
  
  override init(frame: CGRect) {
    super.init(frame: frame)

    let view1: UIView = UIView()
    view1.frame=CGRect(x: 9, y:190, width:357, height:130)
    view1.backgroundColor = backgroundcolor
    view1.layer.cornerRadius = 12
    
    let labelNum1: UILabel = UILabel()
    let labelTxt1: UILabel = UILabel()
    let image1 = UIImage(named: "dot3.png")
    let imageView1 = UIImageView(image: image1!)
    labelNum1.frame = CGRect(x: 10, y:21, width:numbersize, height:numbersize)
    labelNum1.text = "1"
    labelNum1.font = labelNum1.font.withSize(fontsize)
    labelNum1.backgroundColor = UIColor.lightGray
    labelNum1.textColor = UIColor.white
    labelNum1.textAlignment = .center
    labelNum1.layer.masksToBounds = true
    labelNum1.layer.cornerRadius = CGFloat(numbersize/2)
    labelTxt1.frame=CGRect(x: 40, y:19, width:260, height:20)
    labelTxt1.text = "Swipe the top row and tap More"
    labelTxt1.font = labelTxt1.font.withSize(fontsize)
    labelTxt1.textColor = textcolor
    imageView1.frame = CGRect(x: 320, y:14, width:30, height:30)
    view1.addSubview(labelNum1)
    view1.addSubview(labelTxt1)
    view1.addSubview(imageView1)

    let labelNum2: UILabel = UILabel()
    let labelTxt2: UILabel = UILabel()
    let image2 = UIImage(named: "switch.png")
    let imageView2 = UIImageView(image: image2!)
    labelNum2.frame = CGRect(x: 10, y:56, width:numbersize, height:numbersize)
    labelNum2.text = "2"
    labelNum2.font = labelNum2.font.withSize(fontsize)
    labelNum2.backgroundColor = UIColor.lightGray
    labelNum2.textColor = UIColor.white
    labelNum2.textAlignment = .center
    labelNum2.layer.masksToBounds = true
    labelNum2.layer.cornerRadius = CGFloat(numbersize/2)
    labelTxt2.frame=CGRect(x: 40, y:54, width:260, height:20)
    labelTxt2.text = "Enable Mello and drag it to the top"
    labelTxt2.font = labelTxt1.font.withSize(fontsize)
    labelTxt2.textColor = textcolor
    imageView2.frame = CGRect(x: 320, y:52, width:35, height:30)
    view1.addSubview(labelNum2)
    view1.addSubview(labelTxt2)
    view1.addSubview(imageView2)

    
    let labelNum3: UILabel = UILabel()
    let labelTxt3: UILabel = UILabel()
    let image3 = UIImage(named: "melloicon.png")
    let imageView3 = UIImageView(image: image3!)
    labelNum3.frame = CGRect(x: 10, y:91, width:numbersize, height:numbersize)
    labelNum3.text = "3"
    labelNum3.font = labelNum3.font.withSize(fontsize)
    labelNum3.backgroundColor = UIColor.lightGray
    labelNum3.textColor = UIColor.white
    labelNum3.textAlignment = .center
    labelNum3.layer.masksToBounds = true
    labelNum3.layer.cornerRadius = CGFloat(numbersize/2)
    labelTxt3.frame=CGRect(x: 40, y:89, width:260, height:20)
    labelTxt3.text = "Tap Mello in the share panel"
    labelTxt3.font = labelTxt3.font.withSize(fontsize)
    labelTxt3.textColor = textcolor
    imageView3.frame = CGRect(x: 320, y:84, width:30, height:30)
    view1.addSubview(labelNum3)
    view1.addSubview(labelTxt3)
    view1.addSubview(imageView3)

//    tipView.isUserInteractionEnabled = true
//    let gesture = UITapGestureRecognizer(
//      target: self,
//      action: #selector(singleTap(_:))
//    )
//    UIApplication.shared.keyWindow?.addGestureRecognizer(gesture)
//
//    let longPress = UILongPressGestureRecognizer(
//      target: self,
//      action: #selector(longPress(_:))
//    )
//    UIApplication.shared.keyWindow?.addGestureRecognizer(longPress)

    tipView.addSubview(view1)

    UIApplication.shared.keyWindow?.addSubview(tipView)
    
    let items = ["Mello"]
    let ac = UIActivityViewController(activityItems: items, applicationActivities: nil)
    ac.view.backgroundColor = backgroundcolor
    ac.view.tintColor = backgroundcolor
    
    ac.completionWithItemsHandler = {
      (activity, success, items, error) in
      self.tipView.removeFromSuperview()
    };
    ac.excludedActivityTypes = [ UIActivity.ActivityType.airDrop ]
    
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
  
  @objc func singleTap(_ sender:UITapGestureRecognizer){
    // do other task
//    print("UITapGestureRecognizer");
//    tipView.removeFromSuperview()
  }
  
  @objc func longPress(_ gesture: UILongPressGestureRecognizer) {
//    if gesture.state == .began {
//      print("UILongPressGestureRecognizer");
//      tipView.removeFromSuperview()
//    }
  }

  
}
