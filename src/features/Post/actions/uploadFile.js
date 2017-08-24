import { call, put, select, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

/*--------- CONSTANTS ---------*/
const UPLOAD_FILE_BEGIN = 'UPLOAD_FILE_BEGIN';
const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
const UPLOAD_FILE_FAILURE = 'UPLOAD_FILE_FAILURE';

/*--------- ACTIONS ---------*/
export function uploadFileBegin(promise, file) {
  return { type: UPLOAD_FILE_BEGIN, promise, file };
}

export function uploadFileSuccess() {
  return { type: UPLOAD_FILE_SUCCESS };
}

export function uploadFileFailure(message) {
  return { type: UPLOAD_FILE_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function uploadFileReducer(state, action) {
  switch (action.type) {
    case UPLOAD_FILE_SUCCESS:
      return state
        .set('success', true);
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* uploadFile({ promise, file }) {
  try {
    let data = new FormData();
    data.append('image', file);
    const res = yield call(request, 'https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 8d26ccd12712fca'
      },
      body: data,
    });

    promise.resolve(res);
  } catch(e) {
    promise.reject(e);
  }
}

export default function* uploadFileManager() {
  yield takeLatest(UPLOAD_FILE_BEGIN, uploadFile);
}
