import { Router } from 'express'

const publicRoutes = Router()
const privateRoutes = Router()

// Unauthenticated routes

publicRoutes.post('/register', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

// Authenticated routes

// TODO: Auth middleware

privateRoutes.get('/', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

privateRoutes.post('/identify', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

privateRoutes.get('/:mac', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

privateRoutes.delete('/:mac', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

privateRoutes.post('/:mac/boot', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

privateRoutes.post('/:mac/reboot', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

privateRoutes.post('/:mac/shutdown', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

privateRoutes.post('/:mac/restart', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

privateRoutes.post('/:mac/logout', (req, res, next) => {
  // TODO
  res.sendStatus(200)
})

export { privateRoutes, publicRoutes }
