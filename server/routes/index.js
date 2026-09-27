import { Router } from 'express'
import { login, me, register } from '../controllers/authController.js'
import { addComment, createDesign, deleteDesign, getDesign, likeDesign, listComments, listDesigns, saveDesign, updateDesign, viewDesign } from '../controllers/designController.js'
import { createBrief, createJob, createMessage, createService, listBriefs, listJobs, listMessages, listServices, search } from '../controllers/extraController.js'
import { followUser, getUser, listUsers, updateUser } from '../controllers/userController.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/auth/register', register)
router.post('/auth/login', login)
router.get('/auth/me', requireAuth, me)

router.get('/designs', listDesigns)
router.get('/designs/:id', getDesign)
router.post('/designs', requireAuth, createDesign)
router.put('/designs/:id', requireAuth, updateDesign)
router.delete('/designs/:id', requireAuth, deleteDesign)
router.post('/designs/:id/like', requireAuth, likeDesign)
router.post('/designs/:id/save', requireAuth, saveDesign)
router.post('/designs/:id/view', viewDesign)
router.get('/designs/:id/comments', listComments)
router.post('/designs/:id/comments', requireAuth, addComment)
router.get('/comments', listComments)

router.get('/users', listUsers)
router.get('/users/:id', getUser)
router.put('/users/:id', requireAuth, updateUser)
router.post('/users/follow', requireAuth, followUser)

router.get('/search', search)
router.get('/briefs', listBriefs)
router.post('/briefs', requireAuth, createBrief)
router.get('/services', listServices)
router.post('/services', requireAuth, createService)
router.get('/jobs', listJobs)
router.post('/jobs', requireAuth, createJob)
router.get('/messages', requireAuth, listMessages)
router.post('/messages', requireAuth, createMessage)

export default router
