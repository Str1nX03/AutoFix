import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; 

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { error } = await supabase.rpc("increment_visitor_count");

    if (error) {
      console.error("Supabase RPC Error:", error);
      return new NextResponse("Failed to update count", { status: 500 });
    }

    return new NextResponse("Counted successfully", { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}