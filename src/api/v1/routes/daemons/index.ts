import { Router } from 'express'
import { header, body, param } from 'express-validator'
import register from './handlers/register'
import identify from './handlers/identify'
import getAll from './handlers/getAll'
import getByMAC from './handlers/mac/getByMAC'
import deregister from './handlers/mac/deregister'
import boot from './handlers/mac/boot'
import reboot from './handlers/mac/reboot'
import shutdown from './handlers/mac/shutdown'
import restart from './handlers/mac/restart'
import logout from './handlers/mac/logout'

const router = Router()

// Registration routes with special authentication

router.post(
  '/register',
  header('X-Secret').notEmpty().withMessage('X-Secret header must be present'),
  register
)

router.post(
  '/identify',
  header('Authorization').notEmpty().withMessage('Authorization header must be present'),
  body('mac').isMACAddress().withMessage('Must be a MAC address'),
  body('ip').isIP().withMessage('Must be an IP address'),
  body('user').notEmpty().withMessage('Must be present'),
  body('hostname').notEmpty().withMessage('Must be present'),
  identify
)

// Authenticated routes

// TODO: Auth middleware

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', getAll)

router.get(
  '/:mac',
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  getByMAC
)

router.delete(
  '/:mac',
  header('Authorization').notEmpty().withMessage('Authorization header must be present'),
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  deregister
)

router.post(
  '/:mac/boot',
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  boot
)

router.post(
  '/:mac/reboot',
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  reboot
)

router.post(
  '/:mac/shutdown',
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  shutdown
)

router.post(
  '/:mac/restart',
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  restart
)

router.post(
  '/:mac/logout',
  param('mac').isMACAddress().withMessage('Must be a MAC address'),
  logout
)

export default router
