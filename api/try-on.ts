/**
 * AF STYLE - Secure AI Proxy Engine
 * This server-side function handles Replicate API calls to prevent CORS errors.
 */

export const config = {
  runtime: 'edge', // দ্রুত পারফরম্যান্সের জন্য এজ রানটাইম ব্যবহার করা হয়েছে
};

export default async function handler(req: Request) {
  // ১. শুধুমাত্র POST রিকোয়েস্ট গ্রহণ করা হবে
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { personImage, garmentImage } = await req.json();

    if (!personImage || !garmentImage) {
      return new Response(JSON.stringify({ error: 'Images are required' }), { status: 400 });
    }

    const REPLICATE_TOKEN = process.env.VITE_REPLICATE_API_TOKEN;

    if (!REPLICATE_TOKEN) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // ২. Replicate API কে কল করা
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_TOKEN}`,
        "Content-Type": "application/json",
        "Prefer": "wait" // রেজাল্ট না আসা পর্যন্ত অপেক্ষা করবে
      },
      body: JSON.stringify({
        version: "03b3285f8c1f9e382d6218e80556619b06f0e6932400e334f593b48227b233a0",
        input: {
          human_img: personImage,
          garm_img: garmentImage,
          garment_des: "Luxury garment from AF STYLE",
          is_checked: true,
          num_inference_steps: 30
        },
      }),
    });

    const result = await response.json();

    // ৩. ফলাফল ফ্রন্টএন্ডে পাঠানো
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // সব জায়গা থেকে এক্সেস এলাউ করা হলো
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}