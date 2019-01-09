import axios from 'axios';
import * as types from './types'

/**
 * check user account
 */
export const userLookup = (data) => {
  const url = 'users/lookup'

  return {
    types: [types.USER_LOOKUP_PENDING, types.USER_LOOKUP_FULFILLED, types.USER_LOOKUP_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  };
}

/**
 * User login
 */
export const userSignIn = (data) => {
  const url = 'auth/login'

  return {
    types: [types.USER_SIGNIN_PENDING, types.USER_SIGNIN_FULFILLED, types.USER_SIGNIN_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  };
}

/**
 * Get logged user's session
 */
export const getUserSession = () => {
  const url = 'users/session'

  return {
    types: [types.GET_USER_SESSION_PENDING, types.GET_USER_SESSION_FULFILLED, types.GET_USER_SESSION_REJECTED],
    promise:
      axios({
        method: 'get',
        url
      })  
  };
}

/**
 * User SignUp
 */
export const userSignUp = (data) => {
  const url = 'users'

  return {
    types: [types.USER_SIGNUP_PENDING, types.USER_SIGNUP_FULFILLED, types.USER_SIGNUP_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  };
}

/**
 * User logout
 */
export const userSignOut = () => {
  const url = 'auth/logout'

  return {
    types: [types.USER_SIGNOUT_PENDING, types.USER_SIGNOUT_FULFILLED, types.USER_SIGNOUT_REJECTED],
    promise:
      axios({
        method: 'post',
        url
      })  
  };
}

/**
 * Get user's contact list (to invite the user)
 */
export const getContactList = (userId) => {
  let url = `users/${userId}/contacts`

  return {
    types: [types.GET_CONTACT_LIST_PENDING, types.GET_CONTACT_LIST_FULFILLED, types.GET_CONTACT_LIST_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })  
  };
}

/**
 * get user image
 */
export const getImageUrl = (userId) => {
  let url = `users/${userId}/image`

  return {
    types: [types.GET_USER_IMAGE_URL_PENDING, types.GET_USER_IMAGE_URL_FULFILLED, types.GET_USER_IMAGE_URL_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })  
  };
}

/**
 * Resend confirmation email
 */
export const resendConfirmationEmail = () => {
  let url = 'users/confirmation/resend'

  return {
    types: [types.RESEND_CONFIRMATION_EMAIL_PENDING, types.RESEND_CONFIRMATION_EMAIL_FULFILLED, types.RESEND_CONFIRMATION_EMAIL_REJECTED],
    promise:
      axios({
        method: 'get',
        url: url
      })  
  };
}

/**
 * set userinfo from storage
 */
export const setUserInfo = (data) => {
  return {
    type: types.SET_USER_INFO,
    payload: data
  };
}

/**
 * Update user profile
 */
export const updateProfile = (userId, data) => {
  let url = `users/${userId}`

  return {
    types: [types.UPDATE_PROFILE_PENDING, types.UPDATE_PROFILE_FULFILLED, types.UPDATE_PROFILE_REJECTED],
    promise:
      axios({
        method: 'put',
        url,
        data
      }),
    payload: data.imageUrl
  };
}

/**
 * Update user password
 */
export const updatePassword = (userId, data) => {
  let url = `users/${userId}/password`

  return {
    types: [types.UPDATE_PASSWORD_PENDING, types.UPDATE_PASSWORD_FULFILLED, types.UPDATE_PASSWORD_REJECTED],
    promise:
      axios({
        method: 'put',
        url,
        data
      })
  };
}

/**
 * Confirm user account
 */
export const confirmAccount = (token) => {
  let url = 'users/confirmation'
  const data = {
    token
  }

  return {
    types: [types.USER_CONFIRM_ACCOUNT_PENDING, types.USER_CONFIRM_ACCOUNT_FULFILLED, types.USER_CONFIRM_ACCOUNT_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })
  };
}

/**
 * Resend reset password email
 */
export const sendResetPasswordEmail = (data) => {
  let url = 'users/reset-password'

  return {
    types: [types.SEND_RESET_PASSWORD_EMAIL_PENDING, types.SEND_RESET_PASSWORD_EMAIL_FULFILLED, types.SEND_RESET_PASSWORD_EMAIL_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  };
}
/**
 * Reset password
 */
export const resetPassword = (data) => {
  let url = 'users/reset-password'

  return {
    types: [types.RESET_PASSWORD_PENDING, types.RESET_PASSWORD_FULFILLED, types.RESET_PASSWORD_REJECTED],
    promise:
      axios({
        method: 'put',
        url,
        data
      })  
  };
}

/**
 * Validata invite token
 */
export const validateInvite = (data) => {
  let url = 'users/invite/validate'

  return {
    types: [types.VALIDATE_INVITE_PENDING, types.VALIDATE_INVITE_FULFILLED, types.VALIDATE_INVITE_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  }
}

/**
 * Complete Invite
 */
export const completeInvite = (data) => {
  let url = 'users/invite/complete'

  return {
    types: [types.COMPLETE_INVITE_PENDING, types.COMPLETE_INVITE_FULFILLED, types.COMPLETE_INVITE_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  }
}

/**
 * add device token
 */
export const addDeviceToken = (userId, data) => {
  const url = `users/${userId}/device`;
  return {
    types: [types.ADD_DEVICE_TOKEN_PENDING, types.ADD_DEVICE_TOKEN_FULFILLED, types.ADD_DEVICE_TOKEN_REJECTED],
    promise:
      axios({
        method: 'post',
        url,
        data
      })  
  };
}


/**
 * update device token
 */
export const updateDeviceToken = (userId, deviceId, data) => {
  const url = `users/${userId}/device/${deviceId}`;
  return {
    types: [types.UPDATE_DEVICE_TOKEN_PENDING, types.UPDATE_DEVICE_TOKEN_FULFILLED, types.UPDATE_DEVICE_TOKEN_REJECTED],
    promise:
      axios({
        method: 'put',
        url,
        data
      })  
  };
}

/**
 * delete profile photo
 */
export const deleteProfilePhoto = (userId) => {
  const url = `users/${userId}/image`;
  return {
    types: [types.DELETE_PROFILE_PHOTO_REQUEST, types.DELETE_PROFILE_PHOTO_FULFILLED, types.DELETE_PROFILE_PHOTO_REJECTED],
    promise:
      axios({
        method: 'delete',
        url
      })  
  };
}

/**
 * Upload a file
 */
export const uploadFileToS3 = (signedUrl, file, fileName, mimeType) => {
  const fileData = {
    uri: file,
    name: fileName,
    type: mimeType,
  };

  return {
    types: [types.UPLOAD_FILE_PENDING, types.UPLOAD_FILE_FULFILLED, types.UPLOAD_FILE_REJECTED],
    promise:
      new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // xhr.upload.onprogress = (function(e) {
        //   if (e.lengthComputable) {
        //     let percent =  (e.loaded / e.total) * 100
        //     console.log('PERCENT: ', percent)
        //   }
        // })
        xhr.open('PUT', signedUrl);
        xhr.setRequestHeader('Content-Type', fileData.type)
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve('success');
            } else {
              reject('Could not upload file.');
            }
          }
        };
        xhr.send(fileData);
      }),
      payload: file
  };
}

/**
 * app opened by user
 */
export const appOpened = (userId) => {
  const url = `users/${userId}/appOpened`;
  axios({
    method: 'post',
    url,
  });
}

export const setHomeListType = (type) => {
  return {
    type: types.SET_HOME_LIST_TYPE,
    payload: type
  };
}

export const setDetailListType = (type) => {
  return {
    type: types.SET_DETAIL_LIST_TYPE,
    payload: type
  };
}