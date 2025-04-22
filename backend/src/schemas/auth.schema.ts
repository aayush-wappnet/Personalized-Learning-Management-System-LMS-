import { Type } from '@sinclair/typebox';

export const registerSchema = {
  body: Type.Object({
    firstName: Type.String(),
    lastName: Type.String(),
    email: Type.String({ format: 'email' }),
    password: Type.String({ minLength: 6 }),
    role: Type.Optional(Type.Union([
      Type.Literal('admin'),
      Type.Literal('instructor'),
      Type.Literal('student')
    ])),
  }),
  response: {
    201: Type.Object({
      token: Type.String()
    }),
    400: Type.Object({
      message: Type.String()
    })
  }
};

export const loginSchema = {
  body: Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String()
  }),
  response: {
    200: Type.Object({
      token: Type.String()
    }),
    401: Type.Object({
      message: Type.String()
    })
  }
};