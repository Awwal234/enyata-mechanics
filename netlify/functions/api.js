const FUNCTION_PREFIX = "/.netlify/functions/api";

function buildTargetUrl(event) {
  const backendBaseUrl = process.env.BACKEND_BASE_URL;

  if (!backendBaseUrl) {
    throw new Error("Missing BACKEND_BASE_URL environment variable.");
  }

  const requestPath = event.path.startsWith(FUNCTION_PREFIX)
    ? event.path.slice(FUNCTION_PREFIX.length)
    : event.path;

  const normalizedPath = requestPath.startsWith("/") ? requestPath : `/${requestPath}`;
  const target = new URL(normalizedPath, backendBaseUrl.endsWith("/") ? backendBaseUrl : `${backendBaseUrl}/`);

  if (event.rawQuery) {
    target.search = event.rawQuery;
  }

  return target.toString();
}

export async function handler(event) {
  try {
    const targetUrl = buildTargetUrl(event);
    const headers = { ...event.headers };

    delete headers.host;
    delete headers["content-length"];

    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers,
      body: ["GET", "HEAD"].includes(event.httpMethod) ? undefined : event.body,
    });

    const responseBody = await response.text();

    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "API proxy error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
