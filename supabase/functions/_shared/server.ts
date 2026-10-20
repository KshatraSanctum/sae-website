import { createSupabaseContext } from "npm:@supabase/server@1";

export class AuthError extends Error {
  public readonly status: number;

  public constructor(message = "Authentication required", status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export class SupabaseContextError extends Error {
  public readonly status = 500;

  public constructor(message = "Supabase function context could not be created") {
    super(message);
    this.name = "SupabaseContextError";
  }
}

export const requireUser = async (request: Request) => {
  const { data: context, error } = await createSupabaseContext(request, { auth: "user" });
  // @supabase/server exposes the JWT subject as the normalized userClaims.id.
  const userId = context?.userClaims?.id;
  if (error || !userId) {
    throw new AuthError(error?.message ?? "A valid signed-in user is required");
  }

  return {
    user: {
      id: userId,
    },
    admin: context.supabaseAdmin,
  };
};

export const getPublicAdmin = async (request: Request) => {
  const { data: context, error } = await createSupabaseContext(request, { auth: "none" });
  if (error || !context) {
    throw new SupabaseContextError(error?.message);
  }

  return context.supabaseAdmin;
};
