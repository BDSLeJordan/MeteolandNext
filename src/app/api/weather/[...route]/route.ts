import { NextRequest, NextResponse } from "next/server";
import { getForecast } from "@@/utils/api/externe";
import { handleApiError, CustomError } from "@/lib/utils/ssrUtils";

async function getWeather(request: NextRequest): Promise<NextResponse> {
  const { city } = await request.json();

  if (!city) {
    throw new CustomError("Nom de la ville requis", 400);
  }

  const weatherData = await getForecast(city);

  return NextResponse.json({ weatherData }, { status: 200 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");
    throw new CustomError(
      `GET: Méthode non autorisée sur /api/weather/${routePath}`,
      405
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");
    throw new CustomError(
      `PUT: Méthode non autorisée sur /api/weather/${routePath}`,
      405
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");

    if (routePath === "forecast") {
      return await getWeather(request);
    } else {
      throw new CustomError(
        `POST: Sous-route de la météo non trouvée ou méthode non autorisée: /api/weather/${routePath}`,
        404
      );
    }
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");
    throw new CustomError(
      `DELETE: Méthode non autorisée sur /api/weather/${routePath}`,
      405
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
