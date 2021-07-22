import { createProxyMiddleware } from 'http-proxy-middleware';

// const apisByPath = {
//   '/api/services/posts': {
//     baseUrl: 'https://jsonplaceholder.typicode.com/posts',
//     newPath: '',
//     scopes: [],
//   },
//   '/api/services/comments': {
//     baseUrl: 'https://jsonplaceholder.typicode.com/comments',
//     newPath: '',
//     scopes: [],
//   },
// };

// const runMiddleware = (req, res, fn) => {
//   return new Promise((resolve, reject) => {
//     fn(req, res, (result) => {
//       if (result instanceof Error) {
//         return reject(result);
//       }

//       return resolve(result);
//     });
//   });
// };

// const pathToApiProp = (prop) =>
//   Object.entries(apisByPath).reduce((acc, [index, value]) => {
//     return {
//       ...acc,
//       [index]: value[prop],
//     };
//   }, {});

// const router = pathToApiProp('baseUrl');
// const pathRewrite = pathToApiProp('newPath');

// const proxy = createProxyMiddleware({
//   logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
//   target: 'https://jsonplaceholder.typicode.com',
//   // router,
//   // pathRewrite,
//   pathRewrite: { '^/api/services': '' },
//   changeOrigin: true,
//   // followRedirects: true,
//   // secure: false,
//   onProxyReq: (proxyReq) => {
//     proxyReq.socket.pause();
//     proxyReq.setHeader('x-random-header', 'random-value');
//     proxyReq.socket.resume();
//   },
// });

// const handler = async (req, res) => {
//   try {
//     return runMiddleware(req, res, proxy);
//   } catch (error) {
//     res.status(error.status || 500).json({
//       code: error.code,
//       error: error.message,
//     });
//   }
// };

// export const config = {
//   api: {
//     externalResolver: true,
//     bodyParser: false,
//   },
// };

// export default handler;

const proxyConfig = {
  logLevel: process.env.NODE_ENV === 'production' ? 'silent' : 'warn',
  target: 'https://jsonplaceholder.typicode.com',
  pathRewrite: { '^/api/services': '' },
  changeOrigin: true,
  ws: true,
  onError(err, req, res) {
    res.writeHead(302, {
      Location: `https://google.fr/exception?message=${err.message}`,
    });
    res.end();
  },
  onProxyReq(proxyReq, req, res) {
    /**
     * manually overwrite origin for CORS (changeOrigin might not work)
     */
    proxyReq.setHeader('x-random-header', 'random-value');

    // const requestId = greq.headers[HEADER_REQUEST_ID]; // passed from fetch (Browser) to keep request id in browser too
    // const endpoint = req.url;
    // const method = req.method;

    // logger.info(
    //   `[${PlatformUtil.getLoggerTag()}] (${requestId}) REQ ${endpoint} ${method}`
    // );
  },
};

const proxied = createProxyMiddleware(proxyConfig);

export const config = {
  api: {
    // - https://nextjs.org/docs/api-routes/api-middlewares#custom-config
    externalResolver: true,
    bodyParser: false, // not to use url encoded form like streaming POST request
  },
};

export default proxied;
