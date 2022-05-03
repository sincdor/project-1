import './styles.css';

import { useEffect, useState, useCallback } from 'react';

import { Posts } from '../../components/Posts';
import { loadPosts } from '../../utils/load-posts';
import Button from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export function Home() {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  //Comment

  const handleLoadPosts = useCallback(async (page, postsPerPage) => {
    const postsAndPhotos = await loadPosts();
    setPosts(postsAndPhotos.slice(page, postsPerPage));
    setAllPosts(postsAndPhotos);
  }, []);

  useEffect(() => {
    handleLoadPosts(0, postsPerPage);
  }, [handleLoadPosts, postsPerPage]);

  const loadMorePosts = () => {
    const nextPage = page + postsPerPage;

    const nextPosts = allPosts.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    setPosts(posts);
    setPage(nextPage);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  const noMorePosts = page + postsPerPage >= allPosts.length;
  const filteredPosts = filterPosts(searchValue, allPosts, posts);

  return (
    <section className='container'>
      <div className='search-container'>
        {searchValue && <h1>Search value: {searchValue}</h1>}
        {<TextInput onChange={handleChange} value={searchValue} />}
      </div>

      {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}
      {filteredPosts.length === 0 && <p>Não existem posts</p>}
      <div className='button-container'>
        <Button
          text='Load more posts'
          onClick={loadMorePosts}
          disabled={noMorePosts}
        />
      </div>
    </section>
  );
}

function filterPosts(searchValue, allPosts, defaultPosts) {
  return searchValue
    ? allPosts.filter((post) =>
        post.title.toLowerCase().includes(searchValue.toLowerCase())
      )
    : defaultPosts;
}
