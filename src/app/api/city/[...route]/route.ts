import { NextRequest, NextResponse } from "next/server";
import { getCity } from "@@/utils/api/externe";
import { handleApiError, CustomError } from "@/lib/utils/ssrUtils";

async function fetchCity(request: NextRequest): Promise<NextResponse> {
  
  const { city } = await request.json();
  if (!city) {
  }
  
  const cityData = await getCity(city);
  // console.log("fetchcityinterne: ",cityData)
  return NextResponse.json({ cityData }, { status: 200 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  const { route } = await params;
  try {
    const routePath = route.join("/");
    throw new CustomError(
      `GET: Méthode non autorisée sur /api/city/${routePath}`,
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
      `PUT: Méthode non autorisée sur /api/city/${routePath}`,
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

    if (routePath === "fetchcity") {
      return await fetchCity(request);
    } else {
      throw new CustomError(
        `POST: Sous-route de la ville non trouvée ou méthode non autorisée: /api/city/${routePath}`,
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
      `DELETE: Méthode non autorisée sur /api/city/${routePath}`,
      405
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
