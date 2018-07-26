import { put, select, takeEvery } from 'redux-saga/effects';
import update from 'immutability-helper';
import format from '../utils/format';
import getPostKey from '../utils/postKey';
import { getDiscussionsFromAPI } from 'utils/helpers/apiHelpers';
import { selectPosts } from '../selectors';

/*--------- CONSTANTS ---------*/
const GET_POSTS_BY_BEGIN = 'GET_POSTS_BY_BEGIN';
const GET_POSTS_BY_SUCCESS = 'GET_POSTS_BY_SUCCESS';
const GET_POSTS_BY_FAILURE = 'GET_POSTS_BY_FAILURE';
const NO_MORE_POSTS = 'NO_MORE_POSTS';

/*--------- ACTIONS ---------*/
export function getPostsByBegin(category, query) {
  return { type: GET_POSTS_BY_BEGIN, category, query };
}

export function getPostsBySuccess(category, tag, posts, statePosts) {
  return { type: GET_POSTS_BY_SUCCESS, category, tag, posts, statePosts };
}

export function getPostsByFailure(message) {
  return { type: GET_POSTS_BY_FAILURE, message };
}

export function setNoMore(category, tag) {
  return { type: NO_MORE_POSTS, category, tag };
}

/*--------- REDUCER ---------*/
export function getPostsByReducer(state, action) {
  switch (action.type) {
    case GET_POSTS_BY_BEGIN: {
      const { category, query } = action;
      const tag = query.tag || 'all';
      // Initializing category structure
      return update(state, {
        categories: {
          [category]: {$auto: {
            [tag]: {$auto: {
              list: {$autoArray: {}},
              hasMore: {$apply: hasMore => hasMore !== false},
              isLoading: {$apply: isLoading => isLoading !== false},
            }},
          }},
        },
      });
    }
    case GET_POSTS_BY_SUCCESS: {
      const { category, tag, posts, statePosts } = action;

      // Filtering posts already in state
      const newPosts = {};
      posts
        .filter(post => !statePosts[getPostKey(post)])
        .forEach(post => {
          newPosts[getPostKey(post)] = post;
        });

      // Appending new post ids to list
      const oldList = state.categories[category][tag].list;
      const listToPush = posts
        .filter(post => !oldList.find(postId => postId === getPostKey(post)))
        .map(post => getPostKey(post));

      return update(state, {
        posts: { $merge: newPosts },
        categories: {
          [category]: {
            [tag]: {
              list: {$push: listToPush},
              isLoading: {$set: false},
            },
          },
        },
      });
    }
    case NO_MORE_POSTS: {
      const { category, tag } = action;
      return update(state, {
        categories: {
          [category]: {
            [tag]: {
              hasMore: {$set: false},
            }
          }
        }
      });
    }
    default:
      return state;
  }
}

/*--------- SAGAS ---------*/
function* getPostsBy({ category, query }) {
  try {
    const statePosts = yield select(selectPosts());
    const posts = yield getDiscussionsFromAPI(category, query);
    const tag = query.tag || 'all';
    if (posts.length === 1) {
      yield put(setNoMore(category, tag, true));
    }
    const formattedPosts = posts.map(post => format(post));

    // LOOK FOR NULSCOMMUNITY TAG
    const nulsPosts = [];
    formattedPosts.forEach(post => {
      const isNulsCommunity = post.json_metadata.tags.indexOf('nulscommunity');
      if (isNulsCommunity !== -1) {
        nulsPosts.push(post);
      }
    });

    yield put(getPostsBySuccess(category, tag, nulsPosts, statePosts));
  } catch(e) {
    yield put(getPostsByFailure(e.message));
  }
}

export default function* getPostsByManager() {
  yield takeEvery(GET_POSTS_BY_BEGIN, getPostsBy);
}
