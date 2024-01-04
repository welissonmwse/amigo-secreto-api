import { RequestHandler } from "express";
import * as people from '../services/people'
import { z } from "zod";
import { decryptMatch } from "../utils/match";

export const getAll: RequestHandler = async (req, res) => {
  const { id_event, id_group } = req.params

  const items = await people.getAll({ id_event: +id_event, id_group: +id_group })

  if (items) return res.json({ people: items })

  return res.json({ error: 'Ocorreu um erro' })

}

export const getPerson: RequestHandler = async (req, res) => {
  const { id, id_event, id_group } = req.params

  const personItem = await people.getOne({
    id: +id,
    id_event: +id_event,
    id_group: +id_group
  })

  if (personItem) return res.json({ person: personItem })

  return res.json({ error: 'Ocorreu um erro' })
}

export const createPerson: RequestHandler = async (req, res) => {
  const { id_event, id_group } = req.params

  const createPersonSchema = z.object({
    name: z.string(),
    cpf: z.string().transform(val => val.replace(/\.|-/gm, '')),
  })

  const body = createPersonSchema.safeParse(req.body)
  if (!body.success) return res.json({ error: 'Dados inválidos' })

  const newPeople = await people.create({
    ...body.data,
    id_event: +id_event,
    id_group: +id_group
  })
  console.log(newPeople);

  if (newPeople) return res.status(201).json({ people: newPeople })

  return res.json({ error: 'Ocorreu um erro' })
}

export const updatePerson: RequestHandler = async (req, res) => {
  const { id, id_event, id_group } = req.params

  const updatePersonSchema = z.object({
    name: z.string().optional(),
    cpf: z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
    metched: z.string().optional(),
  })

  const body = updatePersonSchema.safeParse(req.body)

  if (!body.success) return res.json({ error: "Dados inválidos" })

  const updatePerson = await people.update({
    id: +id,
    id_event: +id_event,
    id_group: +id_group
  }, body.data)

  if (updatePerson) {
    const personItem = await people.getOne({
      id: +id,
      id_event: +id_event
    })

    return res.json({ person: personItem })
  }

  return res.json({ error: 'Ocorreu um error' })
}

export const deletetePerson: RequestHandler = async (req, res) => {
  const { id, id_event, id_group } = req.params

  const deletedPerson = await people.remove({
    id: +id,
    id_event: +id_event,
    id_group: +id_group
  })

  if (deletedPerson) return res.json({ person: deletedPerson })

  return res.json({ error: 'Ocorreu um error' })
}


export const searchPerson: RequestHandler = async (req, res) => {
  const { id_event } = req.params
  const searchPersonSchema = z.object({
    cpf: z.string().transform(val => val.replace(/\.|-/gm, '')),
  })

  const query = searchPersonSchema.safeParse(req.query)

  if (!query.success) return res.json({ error: 'Dados inválidos' })

  const personItem = await people.getOne({
    id_event: +id_event,
    cpf: query.data.cpf
  })

  if (personItem && personItem.matched) {
    const matchId = decryptMatch(personItem.matched)

    const persorMatched = await people.getOne({
      id_event: +id_event,
      id: matchId
    })

    if (persorMatched) {
      return res.json({
        person: {
          id: personItem.id,
          name: personItem.name
        },
        personMatched: {
          id: persorMatched.id,
          name: persorMatched.name
        }
      })
    }
  }

  return res.json({ error: 'Ocorreu um error' })
}
