import { RequestHandler } from "express";
import { z } from "zod";

import * as events from '../services/events'
import * as people from '../services/people'

export const getAll: RequestHandler = async (req, res) => {
  const items = await events.getAll()
  if (items) return res.json({ events: items })

  return res.json({ error: "Ocorreu um erro" })
}

export const getEvent: RequestHandler = async (req, res) => {
  const { id } = req.params
  const eventItem = await events.getEvent(+id)

  if (eventItem) return res.json({ event: eventItem })

  return res.json({ error: "Ocorreu um erro" })
}

export const createEvent: RequestHandler = async (req, res) => {
  const createEventSchema = z.object({
    title: z.string(),
    description: z.string(),
    grouped: z.boolean()
  })

  const body = createEventSchema.safeParse(req.body)

  if (!body.success) return res.json({ error: 'Dados inválidos' })

  const newEvent = await events.add(body.data)

  if (newEvent) return res.status(201).json({ event: newEvent })

  return res.json({ error: 'Ocorreu um erro' })

}

export const updateEvent: RequestHandler = async (req, res) => {
  const { id } = req.params

  const updateEventSchema = z.object({
    status: z.boolean().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    grouped: z.boolean().optional(),
  })

  const body = updateEventSchema.safeParse(req.body)
  if (!body.success) return res.json({ error: 'Dados inválidos' })

  const updateEvent = await events.update(+id, body.data)

  if (updateEvent) {
    if (updateEvent.status) {
      const result = await events.doMatches(+id)
      if (!result) return res.json({ error: ' Grupo impossíveis de sortear' })
    } else {
      await people.update({ id_event: +id }, { matched: '' })
    }

    return res.json({ event: updateEvent })
  }

  res.json({ error: 'Ocorreu um erro' })
}


export const deleteEvent: RequestHandler = async (req, res) => {
  const { id } = req.params

  const deletedEvent = await events.remove(+id)

  if (deletedEvent) return res.json({ event: deletedEvent })

  return res.json({ error: 'Ocorreu um erro' })
}
