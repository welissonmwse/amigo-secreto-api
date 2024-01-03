import { Prisma, PrismaClient } from "@prisma/client";
import * as events from './events'

const prisma = new PrismaClient()

export const getAll = async (id_event: number) => {
  try {
    return await prisma.eventGroup.findMany({ where: { id_event } })
  } catch (error) {
    return false
  }
}

export const getOne = async (id: number, id_event?: number) => {
  try {
    return await prisma.eventGroup.findFirst({ where: { id, id_event } })
  } catch (error) {
    return false
  }
}

type GroupCreateData = Prisma.Args<typeof prisma.eventGroup, 'create'>['data']

export const create = async (data: GroupCreateData) => {
  try {
    if (!data.id_event) return false

    const eventItem = await events.getEvent(data.id_event)
    if (eventItem) return await prisma.eventGroup.create({ data })

  } catch (error) {
    return false
  }
}
type GroupUpdateData = Prisma.Args<typeof prisma.eventGroup, 'update'>['data']
type UpdateFilters = {
  id: number, id_event?: number
}

export const update = async (filters: UpdateFilters, data: GroupUpdateData) => {
  try {
    return await prisma.eventGroup.update({ where: filters, data })

  } catch (error) {
    return false
  }
}

type deleteFilters = {
  id: number, id_event?: number
}

export const remove = async (filters: deleteFilters) => {
  try {
    return await prisma.eventGroup.delete({ where: filters })

  } catch (error) {
    return false
  }
}
