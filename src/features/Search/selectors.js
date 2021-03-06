import { createSelector } from 'reselect';

export const selectSearchDomain = () => state => state.search;

/**
 * Other specific selectors
 */
export const selectPostSearch = () => createSelector(
  selectSearchDomain(),
  state => state.post,
);

export const selectPostSuggestions = () => createSelector(
  selectPostSearch(),
  state => state.suggestions,
);

export const selectUserSearch = () => createSelector(
  selectSearchDomain(),
  state => state.user,
);

export const selectPostRelated = () => createSelector(
  selectSearchDomain(),
  state => state.postRelated,
);

export const selectPostRelatedFromPost = (author, permlink) => createSelector(
  selectPostRelated(),
  state => state[`${author}/${permlink}`],
);