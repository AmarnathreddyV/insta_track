import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1,
});

const GRAPH_VERSION =
  process.env.META_GRAPH_VERSION || "v24.0";

const GRAPH_BASE =
  `https://graph.facebook.com/${GRAPH_VERSION}`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const metaError = searchParams.get("error");

    if (metaError) {
      return NextResponse.redirect(
        new URL(
          `/?meta=error&message=${encodeURIComponent(metaError)}`,
          request.url
        )
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL(
          "/?meta=error&message=Missing+Meta+authorization+data",
          request.url
        )
      );
    }

    let creatorId: string;

    try {
      const decodedState = JSON.parse(
        Buffer.from(state, "base64url").toString("utf-8")
      );

      creatorId = decodedState.creatorId;

      if (!creatorId) {
        throw new Error("Creator ID missing from state");
      }
    } catch {
      return NextResponse.redirect(
        new URL(
          "/?meta=error&message=Invalid+OAuth+state",
          request.url
        )
      );
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI;

    if (!appId || !appSecret || !redirectUri) {
      throw new Error(
        "Meta environment variables are missing"
      );
    }

    const tokenParams = new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    });

    const tokenResponse = await fetch(
      `${GRAPH_BASE}/oauth/access_token?${tokenParams.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error(
        "Meta token exchange failed:",
        tokenData
      );

      throw new Error(
        "Failed to obtain Meta access token"
      );
    }

    const accessToken = tokenData.access_token;

    const pagesParams = new URLSearchParams({
      fields:
        "id,name,access_token,instagram_business_account",
      access_token: accessToken,
    });

    const pagesResponse = await fetch(
      `${GRAPH_BASE}/me/accounts?${pagesParams.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const pagesData = await pagesResponse.json();

    if (!pagesResponse.ok) {
      console.error(
        "Meta pages request failed:",
        pagesData
      );

      throw new Error(
        "Unable to retrieve Facebook Pages"
      );
    }

    const pages = pagesData.data || [];

    const pageWithInstagram = pages.find(
      (page: any) =>
        page.instagram_business_account?.id
    );

    if (!pageWithInstagram) {
      throw new Error(
        "No Instagram Professional account was found through the connected Facebook Page"
      );
    }

    const instagramId =
      pageWithInstagram.instagram_business_account.id;

    const pageAccessToken =
      pageWithInstagram.access_token ||
      accessToken;

    const profileParams = new URLSearchParams({
      fields:
        "id,username,followers_count,follows_count,media_count",
      access_token: pageAccessToken,
    });

    const profileResponse = await fetch(
      `${GRAPH_BASE}/${instagramId}?${profileParams.toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const profileData =
      await profileResponse.json();

    if (!profileResponse.ok) {
      console.error(
        "Instagram profile request failed:",
        profileData
      );

      throw new Error(
        "Unable to retrieve Instagram profile"
      );
    }

    const username =
      profileData.username || "";

    const followers = Number(
      profileData.followers_count || 0
    );

    const following = Number(
      profileData.follows_count || 0
    );

    const mediaCount = Number(
      profileData.media_count || 0
    );

    await pool.query(
      `
      INSERT INTO social_accounts (
        influencer_id,
        platform,
        platform_user_id,
        username,
        account_type,
        access_token_encrypted,
        status,
        connected_at,
        last_synced
      )
      VALUES (
        $1,
        'instagram',
        $2,
        $3,
        $4,
        $5,
        'active',
        NOW(),
        NOW()
      )
      ON CONFLICT (platform, platform_user_id)
      DO UPDATE SET
        influencer_id = EXCLUDED.influencer_id,
        username = EXCLUDED.username,
        account_type = EXCLUDED.account_type,
        access_token_encrypted =
          EXCLUDED.access_token_encrypted,
        status = 'active',
        last_synced = NOW()
      `,
      [
        Number(creatorId),
        instagramId,
        username,
        "Instagram Professional",
        pageAccessToken,
      ]
    );

    await pool.query(
      `
      UPDATE influencers
      SET
        status = 'active',
        instagram_username = $1
      WHERE id = $2
      `,
      [
        username,
        Number(creatorId),
      ]
    );

    await pool.query(
      `
      INSERT INTO follower_snapshots (
        influencer_id,
        snapshot_date,
        followers,
        following,
        media_count
      )
      VALUES (
        $1,
        CURRENT_DATE,
        $2,
        $3,
        $4
      )
      ON CONFLICT (influencer_id, snapshot_date)
      DO UPDATE SET
        followers = EXCLUDED.followers,
        following = EXCLUDED.following,
        media_count = EXCLUDED.media_count
      `,
      [
        Number(creatorId),
        followers,
        following,
        mediaCount,
      ]
    );

    return NextResponse.redirect(
      new URL(
        `/?meta=success&creatorId=${encodeURIComponent(
          creatorId
        )}`,
        request.url
      )
    );
  } catch (error) {
    console.error(
      "Meta callback error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Meta connection failed";

    return NextResponse.redirect(
      new URL(
        `/?meta=error&message=${encodeURIComponent(
          message
        )}`,
        request.url
      )
    );
  }
}
