import Head from 'next/head';
import { useState } from 'react';

const Home = () => {
  const [latestAddedPost, setLatestAddedPost] = useState([]);

  const addPost = async () => {
    const res = await fetch('/api/services/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: Date.now(),
        body: 'test post',
      }),
    });
    const data = await res.json();
    setLatestAddedPost(data);
  };

  const [latestAddedComment, setLatestAddedComment] = useState([]);

  const addComment = async ({ backendProp }) => {
    const res = await fetch('/api/services/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: Date.now(),
        body: 'test comment',
      }),
    });
    const data = await res.json();
    setLatestAddedComment(data);
  };


  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className="description">
          <button onClick={addPost}>Add post</button>
        </p>

        <code>{JSON.stringify(latestAddedPost)}</code>

        <p className="description">
          <button onClick={addComment}>Add comment</button>
        </p>

        <code>{JSON.stringify(latestAddedComment)}</code>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};


export async function getServerSideProps(ctx) {
  return {
    props: {
      backendProp: true,
    }
  }
}

export default Home;
