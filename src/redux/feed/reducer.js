import { filter } from 'lodash'
import * as types from './types'

const initialState = {
  status: null,
  error: null,
  feed: {
    "allUsersAreInvited": false,
    "anonymousIdeaId": "d1689905-eafb-4b85-b5dc-4bf4ba0aa3c7",
    "comments": null,
    "completedDate": null,
    "dateCreated": "2018-07-24T07:11:25.503Z",
    "deciders": [],
    "decisionDetails": null,
    "decisionDueDate": null,
    "evaluationCriteria": [],
    "files": [
      {
        "accessUrl": "https://solvers-hunt.s3.amazonaws.com/solvers-dev/hunts/77a8f23c-4395-483c-912a-fa36f6056f6f/29664503-5948-459f-94d2-4f3e096475ed?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20180724T072544Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Credential=AKIAJWOLNJ6JUTX6P2CQ%2F20180724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=95eb8574b899913ba90bd28e4479ab619ab7a07828adfcaf3337f08b09f98e6c",
        "contentType": "image/jpeg",
        "fileType": "MEDIA",
        "id": "be710532-d5aa-4d65-a5e5-eae6c7e95f38",
        "name": "451FB506-6380-4761-B9D5-FBDA2DB0B139.jpg",
        "objectKey": "solvers-dev/hunts/77a8f23c-4395-483c-912a-fa36f6056f6f/29664503-5948-459f-94d2-4f3e096475ed",
      },
      {
        "accessUrl": "https://solvers-hunt.s3.amazonaws.com/solvers-dev/hunts/77a8f23c-4395-483c-912a-fa36f6056f6f/1e5d7b4f-9fac-48c3-94a5-203b1e73d3e4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20180724T082217Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Credential=AKIAJWOLNJ6JUTX6P2CQ%2F20180724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=3b4908565478a2c5c6493cce15861cd9591c28a75ca046f0b5d72fcc1805343a",
        "contentType": "image/jpeg",
        "fileType": "MEDIA",
        "id": "ac3b8ade-a68d-4f7e-a1aa-809f531b03f1",
        "name": "5AEF2CB7-C5C6-4324-BFB7-79EDEA08032E.jpg",
        "objectKey": "solvers-dev/hunts/77a8f23c-4395-483c-912a-fa36f6056f6f/1e5d7b4f-9fac-48c3-94a5-203b1e73d3e4",
      },
    ],
    "headline": null,
    "id": "77a8f23c-4395-483c-912a-fa36f6056f6f",
    "ideas": [],
    "ideasDueDate": null,
    "invitees": [],
    "metadata": {
      "ideasSubmitted": 0,
      "invitees": 0,
      "myIdeas": 0,
      "newIdeas": 0,
      "newInvitees": 0,
      "votesSubmitted": 0,
    },
    "owner": {
      "email": "seed-data@solvers.io",
      "firstName": "Seed",
      "id": "d05d0dc1-cf4c-45f3-a557-6c2027e12f69",
      "imageUrl": null,
      "jobTitle": "Seed Data Specialist",
      "lastName": "Data",
    },
    "pinned": null,
    "publishedDate": null,
    "question": null,
    "remindersSent": null,
    "sharingPreferences": {
      "level": "INVITEES_ONLY",
    },
    "stage": "IDEA",
    "status": "DRAFT",
    "summary": null,
    "tags": [],
    "template": "DEFAULT",
    "votes": [],
    "votesDueDate": null,
  },
  fileUploadUrl: {},
};

export default function feed(state = initialState, action = {}) {
  switch (action.type) {

    // create a feed
    case types.CREATE_FEED_PENDING:
      return {
        ...state,
        status: types.CREATE_FEED_PENDING,
        feed: {},
        error: null,
      }
    case types.CREATE_FEED_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.CREATE_FEED_FULFILLED,
        feed: data,
      }
    }
    case types.CREATE_FEED_REJECTED: {
      console.log('CREATE_FEED_REJECTED : ', JSON.stringify(action.error));
      const { data } = action.error.response
      return {
        ...state,
        status: types.CREATE_FEED_REJECTED,
        error: data,
      }
    }

    // update a feed
    case types.UPDATE_FEED_PENDING:
      return {
        ...state,
        status: types.UPDATE_FEED_PENDING,
        error: null,
      }
    case types.UPDATE_FEED_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.UPDATE_FEED_FULFILLED,
        feed: data,
      }
    }
    case types.UPDATE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.UPDATE_FEED_REJECTED,
        error: data,
      }
    }

    // delete a feed
    case types.DELETE_FEED_PENDING:
      return {
        ...state,
        status: types.DELETE_FEED_PENDING,
        error: null,
      }
    case types.DELETE_FEED_FULFILLED: {
      return {
        ...state,
        status: types.DELETE_FEED_FULFILLED,
        feed: {},
      }
    }
    case types.DELETE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.DELETE_FEED_REJECTED,
        error: data,
      }
    }

    // get a file upload url
    case types.GET_FILE_UPLOAD_URL_PENDING:
      return {
        ...state,
        status: types.GET_FILE_UPLOAD_URL_PENDING,
        fileUploadUrl: {},
        error: null,
      }
    case types.GET_FILE_UPLOAD_URL_FULFILLED: {
      const { data } = action.result
      return {
        ...state,
        status: types.GET_FILE_UPLOAD_URL_FULFILLED,
        fileUploadUrl: data
      }
    }
    case types.DELETE_FEED_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.DELETE_FEED_REJECTED,
        error: data,
      }
    }

    // upload a file
    case types.UPLOAD_FILE_PENDING:
      return {
        ...state,
        status: types.UPLOAD_FILE_PENDING,
        error: null,
      }
    case types.UPLOAD_FILE_FULFILLED: {
      return {
        ...state,
        status: types.UPLOAD_FILE_FULFILLED,
      }
    }
    case types.UPLOAD_FILE_REJECTED: {
      return {
        ...state,
        status: types.UPLOAD_FILE_REJECTED,
        error: action.error,
      }
    }

    // add a file
    case types.ADD_FILE_PENDING:
      return {
        ...state,
        status: types.ADD_FILE_PENDING,
        error: null,
      }
    case types.ADD_FILE_FULFILLED: {
      const { data } = action.result
      let files = [];
      if (state.feed.files) {
        files = state.feed.files;
      }
      files.unshift(data);
      return {
        ...state,
        status: types.ADD_FILE_FULFILLED,
        feed: {
          ...state.feed,
          files,
        }
      }
    }
    case types.ADD_FILE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.ADD_FILE_REJECTED,
        error: data,
      }
    }
  
    // delete a file
    case types.DELETE_FILE_PENDING:
      return {
        ...state,
        status: types.DELETE_FILE_PENDING,
        error: null,
      }
    case types.DELETE_FILE_FULFILLED: {
      const fileId = action.payload;
      const files = filter(state.feed.files, file => file.id !== fileId);
      return {
        ...state,
        status: types.DELETE_FILE_FULFILLED,
        feed: {
          ...state.feed,
          files,
        }
      }
    }
    case types.DELETE_FILE_REJECTED: {
      const { data } = action.error.response
      return {
        ...state,
        status: types.DELETE_FILE_REJECTED,
        error: data,
      }
    }

    default:
      return state;
  }
}
