export const successResponse = <T>(data: T, status = 200, message?: string) => {
  return Response.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status },
  );
};

export const errorResponse = (message: string, status = 500) => {
  return Response.json({ success: false, error: message }, { status });
};
