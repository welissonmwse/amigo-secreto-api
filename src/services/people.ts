import { Prisma, PrismaClient } from "@prisma/client";
import * as groups from './groups'

const prisma = new PrismaClient()

type GetAllFilters = { id_event: number, id_group?: number }

export const getAll = async (filters: GetAllFilters) => {
  try {
    return await prisma.eventPeople.findMany({ where: filters })

  } catch (error) {
    return false
  }
}

type GetOneFilters = { id?: number, id_event: number, id_group?: number, cpf?: string }

export const getOne = async (filters: GetOneFilters) => {
  try {
    if (!filters.id && !filters.cpf) return false

    return await prisma.eventPeople.findFirst({ where: filters })

  } catch (error) {
    return false
  }
}

type CreatePeopleData = Prisma.Args<typeof prisma.eventPeople, 'create'>['data']

export const create = async (data: CreatePeopleData) => {
  try {
    if (!data.id_group) return false

    const group = await groups.getOne(
      data.id_group,
      data.id_event
    )

    if (!group) return false

    return await prisma.eventPeople.create({ data })

  } catch (error) {
    return false
  }
}

type UpdatePeopleData = Prisma.Args<typeof prisma.eventPeople, 'update'>['data']
type UpdateFilters = { id?: number, id_event: number, id_group?: number }

export const update = async (filters: UpdateFilters, data: UpdatePeopleData) => {
  try {
    return await prisma.eventPeople.updateMany({ where: filters, data })
  } catch (error) {
    return false
  }
}

type RemoveFilters = { id: number, id_event?: number, id_group?: number }

export const remove = async (filters: RemoveFilters) => {
  try {
    return await prisma.eventPeople.delete({ where: filters })
  } catch (error) {
    return false
  }
}
