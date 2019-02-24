const express = require('express')
const routes = express.Router()
const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)

const SessionController = require('./app/controllers/SessionController')
const UserController = require('./app/controllers/UserController')

const authMiddleware = require('./app/middlewares/auth')
const guestMiddleware = require('./app/middlewares/guest')
const Dashboard = require('./app/controllers/DashboardController')
const FileController = require('./app/controllers/FileController')
const AppointmentsController = require('./app/controllers/AppointmentsController')
const AvailableController = require('./app/controllers/AvailableController')

routes.use((req, res, next) => {
  res.locals.flashSucces = req.flash('sucess')
  res.locals.flashError = req.flash('error')

  return next()
})

routes.get('/', guestMiddleware, SessionController.create)
routes.post('/signin', SessionController.store)

routes.get('/signup', UserController.create)
routes.post(
  '/signup',
  guestMiddleware,
  upload.single('avatar'),
  UserController.store
)

routes.use('/app', authMiddleware)
routes.use('/app/logout', SessionController.destroy)

routes.get('/app/dashboard', Dashboard.index)

routes.get('/files/:file', FileController.show)

routes.get('/app/appointments/new/:provider', AppointmentsController.create)
routes.post('/app/appointments/new/:provider', AppointmentsController.store)

routes.get('/app/available/:provider', AvailableController.index)

module.exports = routes
