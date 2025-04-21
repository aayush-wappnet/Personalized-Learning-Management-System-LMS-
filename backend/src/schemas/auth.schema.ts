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
      user: Type.Object({
        id: Type.String(),
        firstName: Type.String(),
        lastName: Type.String(),
        email: Type.String(),
        role: Type.String(),
        isActive: Type.Boolean(),
        createdAt: Type.String(),
        updatedAt: Type.String()
      }),
      token: Type.String()
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
      user: Type.Object({
        id: Type.String(),
        firstName: Type.String(),
        lastName: Type.String(),
        email: Type.String(),
        role: Type.String(),
        isActive: Type.Boolean(),
        createdAt: Type.String(),
        updatedAt: Type.String()
      }),
      token: Type.String()
    })
  }
}; 