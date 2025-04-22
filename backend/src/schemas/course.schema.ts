import { Type } from '@sinclair/typebox';

export const CourseSchema = {
  create: {
    body: Type.Object({
      title: Type.String(),
      description: Type.String(),
      isActive: Type.Optional(Type.Boolean()),
      thumbnail: Type.Optional(Type.Any()) // Allow file upload
    }),
    response: {
      201: Type.Object({
        id: Type.Number(),
        title: Type.String(),
        description: Type.String(),
        isActive: Type.Boolean(),
        isApproved: Type.Boolean(),
        thumbnailUrl: Type.Optional(Type.String()),
        instructor: Type.Object({
          id: Type.Number(),
          email: Type.String(),
          role: Type.String()
        })
      }),
      403: Type.Object({ message: Type.String() }),
      500: Type.Object({ message: Type.String() })
    }
  },
  addModule: {
    params: Type.Object({ id: Type.String() }),
    body: Type.Object({
      title: Type.String(),
      description: Type.String(),
      order: Type.Optional(Type.Number())
    }),
    response: {
      201: Type.Object({
        id: Type.Number(),
        title: Type.String(),
        description: Type.String(),
        order: Type.Number()
      }),
      404: Type.Object({ message: Type.String() }),
      500: Type.Object({ message: Type.String() })
    }
  },
  getById: {
    params: Type.Object({ id: Type.String() }),
    response: {
      200: Type.Object({
        id: Type.Number(),
        title: Type.String(),
        description: Type.String(),
        isActive: Type.Boolean(),
        isApproved: Type.Boolean(),
        thumbnailUrl: Type.Optional(Type.String()),
        instructor: Type.Object({
          id: Type.Number(),
          email: Type.String(),
          role: Type.String()
        }),
        modules: Type.Array(Type.Object({
          id: Type.Number(),
          title: Type.String()
        })),
        enrollments: Type.Array(Type.Object({
          id: Type.Number(),
          progress: Type.Number(),
          isCompleted: Type.Boolean()
        }))
      }),
      404: Type.Object({ message: Type.String() }),
      500: Type.Object({ message: Type.String() })
    }
  },
  update: {
    params: Type.Object({ id: Type.String() }),
    body: Type.Object({
      title: Type.Optional(Type.String()),
      description: Type.Optional(Type.String()),
      isActive: Type.Optional(Type.Boolean()),
      thumbnail: Type.Optional(Type.Any()) // Allow file upload
    }),
    response: {
      200: Type.Object({
        id: Type.Number(),
        title: Type.String(),
        description: Type.String(),
        isActive: Type.Boolean(),
        isApproved: Type.Boolean(),
        thumbnailUrl: Type.Optional(Type.String())
      }),
      404: Type.Object({ message: Type.String() }),
      500: Type.Object({ message: Type.String() })
    }
  },
  delete: {
    params: Type.Object({ id: Type.String() }),
    response: {
      204: Type.Null(),
      404: Type.Object({ message: Type.String() }),
      500: Type.Object({ message: Type.String() })
    }
  },
  getAll: {
    response: {
      200: Type.Array(Type.Object({
        id: Type.Number(),
        title: Type.String(),
        description: Type.String(),
        isActive: Type.Boolean(),
        isApproved: Type.Boolean(),
        thumbnailUrl: Type.Optional(Type.String()),
        instructor: Type.Object({
          id: Type.Number(),
          email: Type.String(),
          role: Type.String()
        })
      })),
      500: Type.Object({ message: Type.String() })
    }
  },
  approve: {
    params: Type.Object({ id: Type.String() }),
    response: {
      200: Type.Object({
        id: Type.Number(),
        title: Type.String(),
        isApproved: Type.Boolean()
      }),
      403: Type.Object({ message: Type.String() }),
      404: Type.Object({ message: Type.String() }),
      500: Type.Object({ message: Type.String() })
    }
  },
  enroll: {
    params: Type.Object({ id: Type.String() }),
    response: {
      201: Type.Object({
        id: Type.Number(),
        progress: Type.Number(),
        isCompleted: Type.Boolean()
      }),
      400: Type.Object({ message: Type.String() }),
      403: Type.Object({ message: Type.String() }),
      404: Type.Object({ message: Type.String() }),
      500: Type.Object({ message: Type.String() })
    }
  },
  updateProgress: {
    params: Type.Object({ id: Type.String() }),
    body: Type.Object({ progress: Type.Number() }),
    response: {
      200: Type.Object({
        id: Type.Number(),
        progress: Type.Number(),
        isCompleted: Type.Boolean()
      }),
      404: Type.Object({ message: Type.String() }),
      500: Type.Object({ message: Type.String() })
    }
  }
};