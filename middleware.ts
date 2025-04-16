import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Cette fonction peut être marquée comme `async` si vous utilisez `await` à l'intérieur
export function middleware(request: NextRequest) {
  // Vérifier si la requête est pour une route API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Retourner une réponse JSON fictive
    return new NextResponse(
      JSON.stringify({
        message: "Cette API n'est pas disponible en mode statique",
        info: 'Les routes API ne fonctionnent pas avec output: "export"',
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }

  return NextResponse.next()
}

// Configurer le middleware pour s'exécuter sur les routes API
export const config = {
  matcher: "/api/:path*",
}
