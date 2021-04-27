/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express'
import logout from '../daemons/handlers/mac/logout'
import auth from './handlers/auth'
import login from './handlers/login'

const router = Router()

router.post('/login', login)
router.post('/auth', auth)
router.post('/logout', logout)

export default router
