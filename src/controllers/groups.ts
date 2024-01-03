import { RequestHandler } from "express";
import * as groups from '../services/groups'
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => {
  const { id_event } = req.params

  const items = await groups.getAll(+id_event)
  if (items) return res.json({ groups: items })

  res.json({ error: 'Ocorreu um erro' })
}

export const getGroup: RequestHandler = async (req, res) => {
  const { id, id_event } = req.params

  const groupItem = await groups.getOne(+id, +id_event)
  if (groupItem) return res.json({ groups: groupItem })

  res.json({ error: 'Ocorreu um erro' })
}


export const createGroup: RequestHandler = async (req, res) => {
  const { id_event } = req.params
  const CreateGroupSchema = z.object({
    name: z.string(),
  })

  const body = CreateGroupSchema.safeParse(req.body)
  if (!body.success) return res.json({ error: 'Dados inválidos' })

  const newGroup = await groups.create({
    ...body.data,
    id_event: +id_event
  })

  if (newGroup) return res.status(201).json({ group: newGroup })

  return res.json({ error: 'Ocorreu um erro' })
}

export const updateGroup: RequestHandler = async (req, res) => {
  const { id, id_event } = req.params

  const CreateGroupSchema = z.object({
    name: z.string().optional(),
  })

  const body = CreateGroupSchema.safeParse(req.body)
  if (!body.success) return res.json({ error: 'Dados inválidos' })

  const updatedGroup = await groups.update({ id: +id, id_event: +id_event }, body.data)

  if (updatedGroup) return res.status(201).json({ group: updatedGroup })

  return res.json({ error: 'Ocorreu um erro' })
}

export const deleteGroup: RequestHandler = async (req, res) => {
  const { id, id_event } = req.params

  const deletedGroup = await groups.remove({ id: +id, id_event: +id_event })

  if (deletedGroup) return res.json({ group: deletedGroup })

  return res.json({ error: 'Ocorreu um erro' })
}


