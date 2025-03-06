import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
// import globalErrorHandler from './app/middlewares/globalErrorHandler'
// import routes from './app/routes'
import cookieParser from 'cookie-parser'
// import notFound from './app/middlewares/notFound'
import config from './app/config'
import bodyParser from 'body-parser'
import router from './app/routes'
import notFound from './app/middlewares/notFound'
import globalErrorHandler from './app/middlewares/globalErrorhandler'


const app: Application = express()


// app.use((req, res, next) => {
//   const tenantId = req.headers['tenant-id'] || 'default'; // Use a header to identify tenant
//   req.tenantId = tenantId;
//   next();
// });

app.use(
  cors({
    origin: [config.client_url as string],
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json());


// Parser
// app.use(express.urlencoded({ extended: true }))

// app.use('/api/v1', express.json(), routes)
app.use('/api/v1', router)

// Testing route
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to the econintellicence API',
  })
})

// Global error handler
app.use(globalErrorHandler)

// Handle unmatched routes (404)
app.use('*', notFound)

export default app