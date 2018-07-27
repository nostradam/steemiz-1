import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import steem from 'steem';
import update from 'immutability-helper';

import { selectAccounts } from '../selectors';
import { GET_ACCOUNTS_SUCCESS, getAccountsBegin } from './getAccounts';

/*--------- CONSTANTS ---------*/
const GET_FOLLOWINGS_BEGIN = 'GET_FOLLOWINGS_BEGIN';
const GET_FOLLOWINGS_SUCCESS = 'GET_FOLLOWINGS_SUCCESS';
const GET_FOLLOWINGS_FAILURE = 'GET_FOLLOWINGS_FAILURE';
const GET_FOLLOWINGS_END = 'GET_FOLLOWINGS_END';

/*--------- ACTIONS ---------*/
export function getFollowingsBegin(accountName, query = {}, fetchProfiles = false, limit = 0) {
  return { type: GET_FOLLOWINGS_BEGIN, accountName, query, fetchProfiles, limit };
}

export function getFollowingsSuccess(accountName, followings) {
  return { type: GET_FOLLOWINGS_SUCCESS, accountName, followings };
}

export function getFollowingsFailure(message) {
  return { type: GET_FOLLOWINGS_FAILURE, message };
}

export function getFollowingsEnd(accountName) {
  return { type: GET_FOLLOWINGS_END, accountName };
}

/*--------- REDUCER ---------*/
export function getFollowingsReducer(state, action) {
  switch (action.type) {
    case GET_FOLLOWINGS_BEGIN: {
      const { accountName } = action;
      return update(state, {
        followings: {
          [accountName]: {$auto: {
            list: {$autoArray: {}},
            isLoading: {$set: true},
            hasMore: {$set: true},
          }},
        },
      });
    }
    case GET_FOLLOWINGS_SUCCESS: {
      const { accountName, followings } = action;
      return update(state, {
        followings: {
          [accountName]: {
            list: {$apply: list => {
              // FILTER RESULTS FOR ACCOUNTS ALREADY IN FOLLOWINGS
              const filteredFollowings = followings.filter(following => !list.find(followingState => followingState.following === following.following));
              return [
                ...list,
                ...filteredFollowings,
              ]
            }},
            isLoading: {$set: false},
          },
        },
      });
    }
    case GET_FOLLOWINGS_END: {
      const { accountName } = action;
      return update(state, {
        followings: {
          [accountName]: {
            hasMore: {$set: false},
          },
        },
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getFollowings(props) {
  const { accountName, query, fetchProfiles } = props;
  let { limit } = props;
  let endList = false;
  try {
    let startFollowing = '';

    // limit = 0, get all followings
    if (limit === 0) {
      limit = 90;
    }
    if (query.addMore) {
      startFollowing = query.lastFollowing;
      limit = limit + 1;
    }

    let followings = yield call(() => new Promise(resolve => {
      return steem.api.getFollowing(accountName, startFollowing, 'blog', limit, (err, results) => resolve(results));
    }));
    if (followings.length < limit) {
      yield put(getFollowingsEnd(accountName));
      endList = true;
    }

    if (query.addMore) {
      followings = followings.slice(1);
    }

    // Get followings accounts
    if (fetchProfiles) {
      const accounts = yield select(selectAccounts());
      const arrayAccounts = Object.keys(accounts);

      const accountNames = followings
        .map(account => account.following)
        // Removes accounts already in state.accounts
        .filter(accountName => !arrayAccounts.includes(accountName));
      if (accountNames.length > 0) {
        yield put(getAccountsBegin(accountNames));
        yield take(GET_ACCOUNTS_SUCCESS);
      }
    }
    yield put(getFollowingsSuccess(accountName, followings));

    if ((limit === 90 || limit === 91) && endList === false) {
      yield put(getFollowingsBegin(accountName, { addMore: true }, false, 0));
    }
  } catch(e) {
    yield put(getFollowingsFailure(e.message));
  }
}

export default function* getFollowingsManager() {
  yield takeEvery(GET_FOLLOWINGS_BEGIN, getFollowings);
}
