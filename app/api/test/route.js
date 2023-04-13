export function GET(req) {
  const jwt = req.cookies.get("jwt");
  return new Response(jwt.value);
}
