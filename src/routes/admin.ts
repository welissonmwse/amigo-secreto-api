import { Router } from "express"
import * as auth from '../controllers/auth'
import * as events from '../controllers/events'
import * as groups from '../controllers/groups'

const router = Router()

router.get('/ping', auth.validade, (req, res) => res.json({ pong: true, admin: true }))

router.post('/login', auth.login)

router.get('/events', auth.validade, events.getAll)
router.get('/events/:id', auth.validade, events.getEvent)
router.post('/events', auth.validade, events.createEvent)
router.put('/events/:id', auth.validade, events.updateEvent)
router.delete('/events/:id', auth.validade, events.deleteEvent)

router.get('/events/:id_event/groups', auth.validade, groups.getAll)
router.get('/events/:id_event/groups/:id', auth.validade, groups.getGroup)
router.post('/events/:id_event/groups', auth.validade, groups.createGroup)
router.put('/events/:id_event/groups/:id', auth.validade, groups.updateGroup)
router.delete('/events/:id_event/groups/:id', auth.validade, groups.deleteGroup)

export default router
