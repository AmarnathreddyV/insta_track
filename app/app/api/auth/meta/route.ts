import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creatorId");

    if (!creatorId) {
      return NextResponse.json(
        {
          success: false,
          message: "Creator ID is required.",
        },
        { status: 400 }
      );
    }

    const appId = process.env.META_APP_ID;
    const configId = process.env.META_CONFIG_ID;
    const redirectUri = process.env.META_REDIRECT_URI;
    const graphVersion = process.env.META_GRAPH_VERSION || "v24.0";

    if (!appId || !configId || !redirectUri) {
      return NextResponse.json(
        {
          success: false,
          message: "Meta environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const state = Buffer.from(
      JSON.stringify({
        creatorId,
        timestamp: Date.now(),
      })
    ).toString("base64url");

    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      config_id: configId,
      response_type: "code",
      state,
    });

    const authUrl =
      `https://www.facebook.com/${graphVersion}/dialog/oauth?` +
      params.toString();

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Meta OAuth start error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to start Meta connection.",
      },
      { status: 500 }
    );
  }
}
