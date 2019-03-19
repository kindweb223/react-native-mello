import React from "react";
import RNFS, {downloadFile} from 'react-native-fs';
import { Button, FlatList, ScrollView, View, Text, ViewPropTypes } from "react-native";
import mime from 'mime-types'

const makeUserDir = (id, resolve, reject) => {
    const userDir = RNFS.DocumentDirectoryPath + '/' + id
    RNFS.mkdir(userDir)
        .then((result)=>{
            console.log('RNFS - made user dir', result)
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
                    console.log('RNFS - User dir exists at ', RNFS.DocumentDirectoryPath + '/' + userId)
                    resolve(true)
                } else {
                    RNFS.unlink(userDir)
                        .then(()=>{
                            RNFS.mkdir(RNFS.DocumentDirectoryPath + '/' + userId)
                                .then((result)=>{
                                    console.log('RNFS - made user dir', result)
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
                console.log('RNFS - GOT RESULT', result);

                // stat the first file
                // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
                resolve(result)
            })
            .catch((err) => {
                console.log('RNFS - there\'s an error')
                console.log(err.message, err.code);
                reject()
            });

    });

}

function checkAndStore(file, userId) {
    console.log('RNFS - CAS', file, userId)
    // const regex = /([A-Za-z0-9\-_]+)(\.[a-z]{3,4})($|\?)/
    // const fileExt  = file.accessUrl.match(regex)
    // console.log('RNFS - file ext - ', fileExt, ' - ', typeof fileExt)
    // console.log('RNFS - file ext 2 - ', fileExt[2])
    const fileExt = '.'+mime.extension(file.contentType)
    const fileStoreLocation = RNFS.DocumentDirectoryPath + '/' + userId + '/' + file.id + fileExt
    const fileDownloadLocation = RNFS.DocumentDirectoryPath + '/' + userId + '/'
    console.log('RNFS - file location is ' + fileDownloadLocation)
    return new Promise((resolve, reject) => {

        // if ( fileExt === null){
        //     reject('file match is null because it\'s ', file.accessUrl )
        // }

        RNFS.exists(fileStoreLocation)
            .then((result) => {
                if(result) {
                    console.log('RNFS - we stored that file already')
                    resolve({
                        fileStoredLocally: true,
                        fileDownloadLocation,
                        fileStoreLocation,
                    })
                } else {
                    console.log('RNFS - not stored, let us try to store it at ', fileDownloadLocation)

                            let downloadedFileExt = ''
                            const updateFileExt = (args) => {
                                const contentType =  args.headers['Content-Type']
                                console.log('RNFS - headers:',args.headers['Content-Type'])
                                downloadedFileExt = '.'+mime.extension(contentType)
                            }

                            RNFS.downloadFile({
                                fromUrl: file.accessUrl,
                                toFile: fileStoreLocation,
                                begin: updateFileExt,
                            }).promise.then((result) => {
                                console.log('RNFS download: ', result, fileDownloadLocation, fileStoreLocation, file.accessUrl, ' ext=',downloadedFileExt)
                                if(downloadedFileExt !== fileExt){
                                    console.log('RNFS - mismatch:', downloadedFileExt, ' vs ', fileExt)
                                }
                                resolve({
                                    result,
                                    fileStoreLocation,
                                    fileExt,
                                })

                            })
                                .catch((error) => {
                                    console.log('RNFS error ', error)
                                    reject({
                                        fileStoredLocally: false,
                                        error,
                                    })
                                })


                }
            })
            .catch(err => {
                console.log('RNFS file store location does not exist ', err)
                reject(err)
            })
    })
}

class LocalImages extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            files: [],
            ideas: [],
        };
    }

    listFiles = () => {
        const { user } = this.props
        console.log('RNFS - listFiles called')
        const dir = RNFS.DocumentDirectoryPath + '/' + user.id
        RNFS.readDir(dir)
            .then(result => console.log('RNFS o- ', result))
            .catch(error => console.log('RNFS o- ',  error))
    }

    componentDidMount(): void {
        const { user, ideas, replaceFeedIdeas } = this.props
        checkDirectories()
            .then(result => this.setState({files: result}))
        userDirMustExist(user.id)
            .then(() => {
                console.log('RNFS - ideas are: ', ideas.length)
                // console.log('RNFS - first idea has: ', ideas[0].files.length)
                ideas.map((idea, ideaIndex) => {
                    idea.files && idea.files.map((file, fileIndex) => {
                        console.log('RNFS - start of CAS')
                        checkAndStore(file, user.id)
                            .then(result => {
                                console.log('RNFS cas-> ', result)
                                console.log('RNFS, files, ', file.accessUrl, result.fileStoreLocation)
                                const localUrl = 'file:///'+result.fileStoreLocation
                                if(file.accessUrl === idea.coverImage){
                                    idea.coverImage = localUrl
                                }
                                file.accessUrl = localUrl

                            })
                            .catch(err => console.log('RNFS - can not store file because ', err))
                    })
                })

            })
            .catch(err => console.log('RNFS - no user dir and no resolution - ', err))


    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(prevProps.feed.id !== this.props.feed.id){
            console.log('RNFS - feed changed to ', this.props.feed)
        }
    }

    render() {
        const { files } =  this.state
        const { ideas } = this.props
        return (
            <View>
                <Button title="List Files" onPress={this.listFiles}>List Files</Button>
                <Text>Blah and {ideas.length} vs {files.length}</Text>
            </View>
        )
    }
}

export default  LocalImages
