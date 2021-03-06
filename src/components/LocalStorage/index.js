import React from "react";
import RNFS, {downloadFile} from 'react-native-fs';
import { Button, FlatList, ScrollView, View, Text, ViewPropTypes, AsyncStorage, NetInfo } from "react-native";
import mime from 'mime-types'
import {connect} from "react-redux";
import axios from 'axios'
import ToasterComponent from '../../components/ToasterComponent'

const makeUserDir = (id, resolve, reject) => {
    const userDir = RNFS.DocumentDirectoryPath + '/' + id
    RNFS.mkdir(userDir)
        .then((result)=>{
            //console.log('RNFS - made user dir', result)
            resolve(true)
        })
        .catch((error)=>{
            reject(error)
        })
}

const userDirMustExist = (userId) => {
    return new Promise((resolve, reject) => {
        const userDir = RNFS.DocumentDirectoryPath + '/' + userId
        RNFS.stat(userDir)
            .then((result) => {
                if(result.isDirectory()){
                    //console.log('RNFS - User dir exists at ', RNFS.DocumentDirectoryPath + '/' + userId)
                    resolve(true)
                } else {
                    RNFS.unlink(userDir)
                        .then(()=>{
                            RNFS.mkdir(RNFS.DocumentDirectoryPath + '/' + userId)
                                .then((result)=>{
                                    //console.log('RNFS - made user dir', result)
                                    resolve(true)
                                })
                                .catch((error)=>{
                                    reject(error)
                                })
                        })
                }
            })
            .catch((error) => {
                makeUserDir(userId, resolve, reject)

            })

    })
}

function checkDirectories() {
// get a list of files and directories in the main bundle
    return new Promise((resolve, reject) => {
        RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                // //console.log('RNFS - GOT RESULT', result);

                // stat the first file
                // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
                resolve(result)
            })
            .catch((err) => {
                // //console.log('RNFS - there\'s an error')
                console.log(err.message, err.code);
                reject()
            });

    });

}

function checkAndStore(file, userId) {
    // //console.log('RNFS - CAS', file, userId)
    const fileExt = '.'+mime.extension(file.contentType)
    const fileStoreLocation = RNFS.DocumentDirectoryPath + '/' + userId + '/' + file.id + fileExt
    const fileDownloadLocation = RNFS.DocumentDirectoryPath + '/' + userId + '/'
    // //console.log('RNFS - file location is ' + fileDownloadLocation)
    return new Promise((resolve, reject) => {

        if ( fileExt === null){
            reject('file match is null because it\'s ', file.accessUrl )
        }

        // await AsyncStorage.getItem('file/'+file.id)
        //     .then(result => {
        //         //console.log('RNFS - result of async get is ', result)
        //         resolve({
        //             fileStoredLocally: true,
        //             result,
        //        })
        //     })
        //     .catch(err => {
        //         //console.log('RNFS file not in store')
        //     })

        RNFS.exists(fileStoreLocation)
            .then((result) => {
                if(result) {
                    //console.log('RNFS - we stored that file already')
                    resolve({
                        fileStoredLocally: true,
                        fileDownloadLocation,
                        fileStoreLocation,
                    })
                } else {
                    //console.log('RNFS - not stored, try to store at ', fileStoreLocation, file)

                            let downloadedFileExt = ''
                            const updateFileExt = (args) => {
                                const contentType =  args.headers['Content-Type']
                                //console.log('RNFS - headers:', args.statusCode)
                                downloadedFileExt = '.'+mime.extension(contentType)
                            }

                            RNFS.downloadFile({
                                fromUrl: file.accessUrl,
                                toFile: fileStoreLocation,
                                begin: updateFileExt,
                            }).promise.then((result) => {
                                // //console.log('RNFS download: ', result, fileDownloadLocation, fileStoreLocation, file.accessUrl, ' ext=',downloadedFileExt)
                                if(downloadedFileExt !== fileExt){
                                    //console.log('RNFS - mismatch:', downloadedFileExt, ' vs ', fileExt, file, result)
                                    //TODO if 404/3 reject
                                    //TODO if there's a mismatch, move to have downloaded file ext
                                    //TODO if there's a mismatch, update file entry on DB to have correct filetype
                                }
                                if (result.statusCode === 404 || result.statusCode === 403) {
                                    reject({
                                        result,
                                        fileStoreLocation,
                                        fileStoredLocally: false,
                                    })
                                } else {
                                    const locKey = ('file/'+file.id).toString()
                                    const locString = fileStoreLocation.toString()
                                    AsyncStorage.setItem(locKey, locString)
                                    .then(aresult => {
                                        //console.log('RNFSR async - ', aresult, fileStoreLocation)
                                        resolve({
                                            result,
                                            fileStoreLocation,
                                            fileExt,
                                        })

                                    })
                                    .catch(err => {
                                        //console.log('RNFS async set error -', err)
                                    })
                                }

                            })
                                .catch((error) => {
                                    //console.log('RNFS error ', error, fileStoreLocation, file.accessUrl)
                                    // TODO handle 404s and so on here
                                    reject({
                                        fileStoredLocally: false,
                                        error,
                                    })
                                })


                }
            })
            .catch(err => {
                // //console.log('RNFS file store location does not exist ', err)
                reject(err)
            })
    })
}

class LocalStorage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            files: [],
            ideas: [],
            feeds: this.props.feedo.feedoList,
            startDelay: 0,
            storageDelay: 2000,
            storageInterval: 1000,
            lastStoredIdea: 0,
            downloadComplete: false,
            
        };
    }

    listFiles = () => {
        const { user } = this.props
        // //console.log('RNFS - listFiles called')
        const dir = RNFS.DocumentDirectoryPath + '/' + user.userInfo.id
        RNFS.readDir(dir)
            .then(result => {/*console.log('RNFS o- ', result)*/})
            .catch(error => {/*console.log('RNFS o- ',  error)*/})
    }

    flattenIdeas = () => {
            const allIdeas = []
            const { feedo, user } = this.props
            const { feedoList } = feedo
            // console.log('AS set ', (user.userInfo.id + '/flows'), ' to ', JSON.stringify(feedoList))
            AsyncStorage.setItem(user.userInfo.id + '/flows', JSON.stringify(feedoList))
            //console.log('RNFS feedoList is ', feedo, feedoList)
            let waitForAll;
            feedoList.map((feed, index) => {
                // allIdeas.push(...feed.ideas)
                //console.log('RNFS one feeds ideas are ', ...feed.ideas)
                axios({
                    method: 'get',
                    url: 'hunts/'+feed.id
                })
                    .then(response => {
                        this.saveImagesOnCurrentFeed(response.data)
                        let ideas = response.data.ideas
                        //console.log('RNFS flat - ',Object.keys(response.data))
                        //console.log('RNFS flat - ideas -', ideas)
                        allIdeas.push(...ideas)
                        //console.log('RNFS - allideas is now ', allIdeas.length, ' long')
                        // if(index === (feeds.length - 1)){
                            clearTimeout(waitForAll)
                            waitForAll = setTimeout(()=>{
                                this.setState({ideas: allIdeas})
                            }, 1000);

                        // }
                    })
            })
            //console.log('RNFS there are a total of ', allIdeas.length, ' ideas this user has access to')
            //console.log('RNFS ', allIdeas[0], allIdeas[1], allIdeas[2])

    }

    signalBackupComplete = (show = true) => {
        console.log('SBC - called change to state')
        this.setState({
            downloadComplete: show
        })
        setTimeout(()=>{
            this.setState({
                downloadComplete: false
            })
        }, 2000)

    }

    saveImagesOnCurrentFeed = (flow) => {
        const { user, feedo } = this.props
        const ideas = flow.ideas
        const feed = flow
        checkDirectories()
            .then(result => this.setState({files: result}))
        userDirMustExist(user.userInfo.id)
            .then(() => {
                //console.log('RNFS - ideas are: ', ideas.length)
                // //console.log('RNFS - first idea has: ', ideas[0].files.length)
                ideas.map((idea, ideaIndex) => {
                    idea.files && idea.files.map((file, fileIndex) => {
                        //console.log('RNFS - start of CAS')

                        checkAndStore(file, user.userInfo.id)
                            .then(result => {
                                //console.log('RNFS cas-> ', result)
                                // //console.log('RNFS, files, ', file.accessUrl, result.fileStoreLocation)
                                const localUrl = 'file:///'+result.fileStoreLocation
                                if(file.accessUrl === idea.coverImage){
                                    idea.coverImage = localUrl
                                }
                                file.accessUrl = localUrl
                                if(ideaIndex === (ideas.length - 1)){
                                    setTimeout(()=>{
                                        //console.log('RNFS saved flow will be ', feed)
                                        AsyncStorage.setItem('flow/'+flow.id, JSON.stringify(feed))
                                    }, 2000)
                                }

                            })
                            .catch(err => {/*console.log('RNFS - can not store file because ', err)*/})
                    })
                    
                    if(!idea.files && ideaIndex === (ideas.length - 1)){
                        setTimeout(()=>{
                            //console.log('RNFS saved flow will be ', feed)
                            AsyncStorage.setItem('flow/'+flow.id, JSON.stringify(feed))
                        }, 2000)
                    }
                })

            })
            .catch(err => {/*console.log('RNFS - no user dir and no resolution - ', err)*/})
    }

    adjustForConnectionType = () => {
        //console.log('RNFS try and do stuff when user is ', user )
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            // console.log('SBC connection info is ', connectionInfo);
          if(connectionInfo.type !== 'wifi'){

          }else{              
            this.setState({ 
                storageDelay: 500,
                storageInterval: 10
            })
          }
          //console.log('RNFSR - Connection is ', connectionInfo)
        })
    }

    componentDidMount(): void {
        this.adjustForConnectionType(); //will work on Android
        NetInfo.addEventListener('connectionChange', this.adjustForConnectionType); //will work on iOS
    }

    recursiveShout = null

    updateRecursiveShout(index, delay) {
        clearTimeout(this.recursiveShout)
        this.recursiveShout = setTimeout(()=>{
            this.recursiveStoreFiles(index)
        }, delay)
    }


    recursiveStoreFiles = (ideaIndex = 0) => {
        const { user } = this.props
        const { ideas, storageInterval } = this.state
        const delay = storageInterval

        if(ideas == null || ideaIndex === (ideas.length) || ideas.length === 0) {
            this.signalBackupComplete()
            return
        }

        const files = ideas[ideaIndex].files ? ideas[ideaIndex].files : false

        if(!files){
            this.updateRecursiveShout(++ideaIndex, delay)
            return
        }

        files.map((file, fileIndex) => {
            AsyncStorage.getItem('file/'+file.id)
            .then(ares => {
                if(ares !== null){
                    file.accessUrl = 'file:///'+ares
                    //console.log('RNFSR file found in store ', ares);
                    ((fileIndex + 1) === files.length) && this.updateRecursiveShout(++ideaIndex, 0)
                    
                }
                else{
                    checkAndStore(file, user.userInfo.id)
                        .then(result => {
                            //console.log('RNFSR batch, files, ', file.accessUrl, result.fileStoreLocation)
                            const localUrl = 'file:///'+result.fileStoreLocation
                            if(file.accessUrl === ideas[ideaIndex].coverImage ){
                                ideas[ideaIndex].coverImage = localUrl
                            }
                            if(file.accessUrl === ideas[ideaIndex].thumbnailUrl ){
                                ideas[ideaIndex].thumbnailUrl = localUrl
                            }
                            file.accessUrl = localUrl;
                            ((fileIndex + 1) === files.length) && this.updateRecursiveShout(++ideaIndex, delay)
    
                        })
                        .catch(err => {/*console.log('RNFSR batch - can not store file because ', err)*/})
                        ((fileIndex + 1) === files.length) && this.updateRecursiveShout(++ideaIndex, delay)
    
                }
            })
            .catch(() => {
                checkAndStore(file, user.userInfo.id)
                    .then(result => {
                        //console.log('RNFSR batch, files, ', file.accessUrl, result.fileStoreLocation)
                        const localUrl = 'file:///'+result.fileStoreLocation
                        if(file.accessUrl === ideas[ideaIndex].coverImage ){
                            ideas[ideaIndex].coverImage = localUrl
                        }
                        file.accessUrl = localUrl;
                        ((fileIndex + 1) === files.length) && this.updateRecursiveShout(++ideaIndex, delay)
    
                    })
                    .catch(err => {
                        //console.log('RNFSR batch - can not store file because ', err);
                        ((fileIndex + 1) === files.length) && this.updateRecursiveShout(++ideaIndex, delay)
                    })
    
            })

        })
    }

    storeIdeasAndFiles = () => {
        const { user } = this.props
        const { ideas, storageDelay } = this.state
        setTimeout(()=>{
            this.recursiveStoreFiles()
        }, storageDelay)
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        const { user, feedo } = this.props
        const { ideas } = this.state

        if((prevProps.feedo.feedoList === null || prevProps.feedo.feedoList.length === 0) && (feedo.feedoList && feedo.feedoList.length > 0)){
            userDirMustExist(user.userInfo.id)
            .then(()=>{
                if(user.userInfo.hasOwnProperty('plan') && user.userInfo.plan.type === 'UNFREE'){
                    //user is not on premium plan
                }else{
                    //console.log('RNFS try and do stuff')
                    this.flattenIdeas()
                }
            })
        }

        if (prevState.ideas.length < this.state.ideas.length) {
            this.storeIdeasAndFiles()
        }
    }


    render() {
        const { files, downloadComplete } =  this.state
        const { feedo } = this.props
        // const ideas = feedo.currentFeed.ideas
        return (
            <View>
                {/* {downloadComplete && (
                    <ToasterComponent
                        isVisible={this.state.downloadComplete}
                        title={'Backup Complete'}
                        onPressButton={() => {this.signalBackupComplete(false)}}
                        buttonTitle="OK"
                    />
                    )} */}
            </View>
        )
    }
}

const mapStateToProps = ({ feedo, feedoList, user }) => ({
    feedo,
    user,
})

const mapDispatchToProps = dispatch => ({})


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LocalStorage)
