import { createProxyMiddleware } from 'http-proxy-middleware';

const apisByPath = {
  '/api/services/posts': {
    baseUrl: 'https://jsonplaceholder.typicode.com/posts',
    newPath: '',
    scopes: [],
  },
  '/api/services/comments': {
    baseUrl: 'https://jsonplaceholder.typicode.com/comments',
    newPath: '',
    scopes: [],
  },
};

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

const pathToApiProp = (prop) =>
  Object.entries(apisByPath).reduce((acc, [index, value]) => {
    return {
      ...acc,
      [index]: value[prop],
    };
  }, {});

const router = pathToApiProp('baseUrl');
const pathRewrite = pathToApiProp('newPath');

const proxy = () =>
  createProxyMiddleware(['/api/services/'], {
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    target: 'https://jsonplaceholder.typicode.com',
    // router,
    // pathRewrite,
    pathRewrite: { '^/api/proxy': '' },
    changeOrigin: true,
    // followRedirects: true,
    // secure: false,
    onProxyReq: (proxyReq) => {
      proxyReq.socket.pause();
      proxyReq.setHeader('x-random-header', 'random-value');
      proxyReq.socket.resume();
    },
  });

const handler = async (req, res) => {
  try {
    return runMiddleware(req, res, proxy());
  } catch (error) {
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message,
    });
  }
};

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

export default handler;
