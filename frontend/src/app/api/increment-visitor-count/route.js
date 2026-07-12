export const revalidate = 60;

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


export async function GET() {
  try {
    const { data, error } = await supabase
      .from("analytics")
      .select("total_visitors")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Supabase GET Error:", error);
      return new NextResponse("Failed to fetch count", { status: 500 });
    }

    const currentCount = data?.total_visitors || 0;
    
    return NextResponse.json({ count: currentCount }, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}