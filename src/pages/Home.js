import React from 'react';
import PostList from 'features/Post/PostList';

export default function Home() {
  return (
    <PostList category="trending" subCategory="nulscommunity" query={{ limit: 10, tag: 'nulscommunity' }} />
  );
}
