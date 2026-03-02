export const successResponse = <T>(data: T, status = 200) => {
  return Response.json({ success: true, data }, { status });
};

export const errorResponse = (message: string, status = 500) => {
  return Response.json({ success: false, error: message }, { status });
};
