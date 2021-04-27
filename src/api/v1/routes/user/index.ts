/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import auth from './handlers/auth'
import login from './handlers/login'
import logout from './handlers/logout'

const router = Router()

router.post('/login', login)
router.post('/auth', auth)
router.post('/logout', logout)

export default router
