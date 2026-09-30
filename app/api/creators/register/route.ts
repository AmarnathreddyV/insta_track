import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, city, country, niche, instagramUsername, bio } = body;

    if (!fullName || !email || !phone || !city || !country || !niche || !instagramUsername) {
      return NextResponse.json({ success: false, message: "Please fill in all required fields." }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO influencers (name,email,phone,city,country,niche,instagram_username,bio,status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id,name,email,instagram_username,status,created_at`,
      [fullName, email, phone, city, country, niche, instagramUsername, bio || null, "pending"]
    );

    return NextResponse.json({ success: true, message: "Creator registered successfully.", creator: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Creator registration error:", error);
    return NextResponse.json({ success: false, message: "Failed to register creator." }, { status: 500 });
  }
}
