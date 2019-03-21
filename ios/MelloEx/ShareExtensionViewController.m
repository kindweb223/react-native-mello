#import "ShareExtensionViewController.h"
#import "React/RCTRootView.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <React/RCTLog.h>
#import <MobileCoreServices/MobileCoreServices.h>
// #import <Firebase.h>

#define URL_IDENTIFIER @"public.url"
#define IMAGE_IDENTIFIER @"public.image"
#define TEXT_IDENTIFIER (NSString *)kUTTypePlainText

NSExtensionContext* extensionContext;

@implementation ShareExtensionViewController {
    NSTimer *autoTimer;
    NSString* type;
    NSString* value;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

RCT_EXPORT_MODULE();

- (void)viewDidLoad {
    [super viewDidLoad];
    //object variable for extension doesn't work for react-native. It must be assign to gloabl
    //variable extensionContext. in this way, both exported method can touch extensionContext
    extensionContext = self.extensionContext;

    NSURL *jsCodeLocation;

    // [FIRApp configure];
  
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.share" fallbackResource:nil];
  
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                        moduleName:@"MelloEx"
                                                 initialProperties:nil
                                                     launchOptions:nil];
    rootView.backgroundColor = [[UIColor alloc] initWithRed:1 green:1 blue:1 alpha:0.1];
    self.view = rootView;
}


RCT_EXPORT_METHOD(close) {
    [extensionContext completeRequestReturningItems:nil
                                  completionHandler:nil];
    exit(0);
}



RCT_REMAP_METHOD(data,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    [self extractDataFromContext: extensionContext withCallback:^(NSString* val, NSString* contentType, NSException* err) {
        if (err) {
            reject(@"error", err.description, nil);
        } else {
            resolve(@{
                      @"type": contentType,
                      @"value": val
                      });
        }
    }];
}

- (void)extractDataFromContext:(NSExtensionContext *)context withCallback:(void(^)(NSString *value, NSString* contentType, NSException *exception))callback {
    @try {
        NSExtensionItem *item = [context.inputItems firstObject];
        NSArray *attachments = item.attachments;
        __block NSItemProvider *urlProvider = nil;
        __block NSItemProvider *textProvider = nil;
//        __block NSItemProvider *imageProvider = nil;
        NSMutableArray *imageProviders = [NSMutableArray array];

        [attachments enumerateObjectsUsingBlock:^(NSItemProvider *provider, NSUInteger idx, BOOL *stop) {
            if ([provider hasItemConformingToTypeIdentifier:URL_IDENTIFIER]) {
                urlProvider = provider;
                *stop = YES;
            } else if ([provider hasItemConformingToTypeIdentifier:TEXT_IDENTIFIER]){
                textProvider = provider;
                //*stop = YES;
            } else if ([provider hasItemConformingToTypeIdentifier:IMAGE_IDENTIFIER]){
//                imageProvider = provider;
//              if (imageProviders.count == 0)
                [imageProviders addObject:provider];
                //*stop = YES;
            }
        }];

        if (urlProvider) {
            [urlProvider loadItemForTypeIdentifier:URL_IDENTIFIER options:nil completionHandler:^(id<NSSecureCoding> item, NSError *error) {
                NSURL *url = (NSURL *)item;

                if (callback) {
                    callback([url absoluteString], @"url", nil);
                }
            }];
        } else if (imageProviders.count > 0) {
          NSMutableArray *imageUrls = [NSMutableArray array];
          for (__block NSItemProvider *imageProvider in imageProviders) {
            
            [imageProvider loadItemForTypeIdentifier:IMAGE_IDENTIFIER options:nil completionHandler:^(id<NSSecureCoding> item, NSError *error){
              
              if ([(NSObject *)item isKindOfClass:[NSURL class]]) {
                NSURL *url = (NSURL *)item;
                [imageUrls addObject:[url absoluteString]];
                if (imageUrls.count >= imageProviders.count) {
                  if (callback) {
                    NSString * value = [imageUrls componentsJoinedByString:@" , "];
                    
                    callback(value, @"images", nil);
                  }
                }

              }
              else
              {
                // for screenshot
                // Cast the item to a UIImage and save into a temporary directory so pass a URL back to React Native
                UIImage *sharedImage = (UIImage *)item;
                NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
                NSString *filePath = [[paths objectAtIndex:0] stringByAppendingPathComponent:@"MELLO_TEMP_IMG.png"];
                [UIImagePNGRepresentation(sharedImage) writeToFile: filePath atomically: YES];
                
                if(callback){
                  callback(filePath, @"images", nil);
                }
              }
            }];
          }
        } else if (textProvider) {
            [textProvider loadItemForTypeIdentifier:TEXT_IDENTIFIER options:nil completionHandler:^(id<NSSecureCoding> item, NSError *error) {
                NSString *text = (NSString *)item;

                if (callback) {
                    callback(text, @"url", nil);
                }
            }];
        } else {
            if (callback) {
                callback(nil, nil, [NSException exceptionWithName:@"Error" reason:@"couldn't find provider" userInfo:nil]);
            }
        }
    }
    @catch (NSException *exception) {
        if (callback) {
            callback(nil, nil, exception);
        }
    }
}

RCT_EXPORT_METHOD(goToMainApp:(NSString*)mainAppURL) {
  NSURL * url = [ NSURL URLWithString: mainAppURL ];
  NSString *className = @"UIApplication";
  if (NSClassFromString(className)) {
    id object = [ NSClassFromString(className) performSelector: @selector(sharedApplication)];
    [object performSelector: @selector(openURL:) withObject:url];
  }
}

@end
