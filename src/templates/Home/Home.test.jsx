import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { Home } from '.';
import userEvent from '@testing-library/user-event';

const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts', async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          userId: 1,
          id: 1,
          title: 'Title 1',
          body: 'Body 1',
        },
        {
          userId: 2,
          id: 2,
          title: 'Title 2',
          body: 'Body 2',
        },
        {
          userId: 3,
          id: 3,
          title: 'Title 3',
          body: 'Body 3',
        },
      ]),
    );
  }),
  rest.get('https://jsonplaceholder.typicode.com/photos', async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          url: 'img1.jpg',
        },
        {
          url: 'img2.jpg',
        },
        {
          url: 'img3.jpg',
        },
      ]),
    );
  }),
];
const server = setupServer(...handlers);

describe('<Home/>', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it('should render search, posts and load more', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts');

    expect.assertions(3);
    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText('type your search');
    expect(search).toBeInTheDocument();

    const images = screen.getAllByRole('img', { name: /title/i });
    expect(images).toHaveLength(2);

    const button = screen.getByRole('button', { name: /load more posts/i });
    expect(button).toBeInTheDocument();
  });

  it('should search for posts', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts');

    expect.assertions(10);
    await waitForElementToBeRemoved(noMorePosts);

    const search = screen.getByPlaceholderText('type your search');
    expect(search).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Title 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Title 2' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Title 3' })).not.toBeInTheDocument();

    userEvent.type(search, 'title 1');
    expect(screen.getByRole('heading', { name: 'Title 1' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Title 2' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Title 3' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Search value: title 1' })).toBeInTheDocument;

    userEvent.clear(search);
    expect(screen.getByRole('heading', { name: 'Title 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Title 2' })).toBeInTheDocument();

    userEvent.type(search, 'post does not exist');
    expect(screen.getByText('Não existem posts')).toBeInTheDocument();
  });

  it('should load more posts when "load more" button clicked', async () => {
    render(<Home />);
    const noMorePosts = screen.getByText('Não existem posts');

    await waitForElementToBeRemoved(noMorePosts);

    const button = screen.getByRole('button', { name: /load more posts/i });
    expect(screen.queryByRole('heading', { name: 'Title 3' })).not.toBeInTheDocument();

    userEvent.click(button);
    expect(screen.getByRole('heading', { name: 'Title 3' })).toBeInTheDocument();
  });
});
