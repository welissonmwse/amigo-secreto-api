import { RequestHandler } from "express";
import { z } from "zod";

import * as auth from '../services/auth'

export const login: RequestHandler = (req, res) => {
  const loginSchema = z.object({
    password: z.string()
  })

  const body = loginSchema.safeParse(req.body)
  if (!body.success) return res.json({ error: 'Dados invalidos' })

  const { password } = body.data
  const isValidatePassword = auth.validatePassword(password)

  if (!isValidatePassword) {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  res.json({ token: auth.createToken() })
}


export const validade: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) return res.status(403).json({ error: "Acesso Negado" })

  const token = authorization.split(' ')[1]

  if (!auth.validateToken(token)) return res.status(403).json({ error: "Acesso Negado" })

  next()
}
