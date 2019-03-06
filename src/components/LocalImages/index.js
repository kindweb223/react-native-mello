import React from "react";
import RNFS, {downloadFile} from 'react-native-fs';
import { FlatList, ScrollView, View, Text, ViewPropTypes } from "react-native";

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

                        reject(error)

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
    const regex = /([A-Za-z0-9\-_]+)(\.[a-z]{3,4})($|\?)/
    const fileExt  = file.accessUrl.match(regex)
    const fileStoreLocation = RNFS.DocumentDirectoryPath + '/' + userId + '/' + file.id + fileExt[2]
    const fileDownloadLocation = RNFS.DocumentDirectoryPath + '/' + userId + '/'
    console.log('RNFS - file location is ' + fileDownloadLocation)
    return new Promise((resolve, reject) => {
        RNFS.exists(fileStoreLocation)
            .then((result) => {
                if(result) {
                    console.log('RNFS - we stored that file already')
                    resolve({
                        fileStoredLocally: true,
                        fileDownloadLocation,
                    })
                } else {
                    console.log('RNFS - not stored, let us try to store it at ', fileDownloadLocation)

                            RNFS.downloadFile({
                                fromUrl: file.accessUrl,
                                toFile: fileDownloadLocation + file.id + fileExt[2]
                            }).promise.then((result) => {
                                console.log('RNFS download: ', result, fileDownloadLocation, fileStoreLocation, file.accessUrl)


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

    componentDidMount(): void {
        const { user, ideas } = this.props
        checkDirectories()
            .then(result => this.setState({files: result}))
        userDirMustExist(user.id)
            .then(() => {
                console.log('RNFS - ideas are: ', ideas)
                ideas.map((idea) => {
                    idea.files.map((file) => {
                        checkAndStore(file, user.id)
                            .then(result => console.log('RNFS ', result))
                    })
                })
                const dir = RNFS.DocumentDirectoryPath + '/' + user.id
                console.log('RNFS dir is ' + dir)
                RNFS.readDir(dir)
                    .then(result => console.log('RNFS o- ', result))
                    .catch(error => console.log('RNFS o- ',  error))

            })


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
            <Text>Blah and {ideas.length} vs {files.length}</Text>
        )
    }
}

export default  LocalImages
