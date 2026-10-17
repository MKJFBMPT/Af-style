/**
 * AF STYLE - Elite AI Try-On Service
 * Fully Integrated via Secure Proxy for Local & Production Environment.
 */

// Replicate AI মডেল ভার্সন (yisol/idm-vton)
const MODEL_VERSION = "03b3285f8c1f9e382d6218e80556619b06f0e6932400e334f593b48227b233a0";

/**
 * কাস্টমারের ছবির ওপর পোশাক পরানোর জন্য মেইন ফাংশন
 */
export const generateVirtualTryOn = async (personImageUrl: string, garmentImageUrl: string) => {
  try {
    // ১. প্রক্সি সার্ভারের মাধ্যমে নতুন প্রেডিকশন রিকোয়েস্ট পাঠানো
    const response = await fetch("/api/try-on", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input: {
          human_img: personImageUrl,
          garm_img: garmentImageUrl,
          garment_des: "Luxury masterpiece from AF STYLE",
          is_checked: true,
          num_inference_steps: 30
        },
      }),
    });

    const prediction = await response.json();

    if (!response.ok) {
      console.error("Maison AI Error Log:", prediction);
      throw new Error(prediction.detail || prediction.error || "Maison AI is curating other pieces. Please try again.");
    }

    // ২. যদি রেজাল্ট সাথে সাথে চলে আসে (সফল হলে আউটপুট রিটার্ন করবে)
    if (prediction.status === "succeeded" && prediction.output) {
      return Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    }

    // ৩. যদি এআই সময় নেয়, তবে আমাদের তৈরি করা 'Status Proxy' দিয়ে চেক করা (Polling)
    if (prediction.id) {
       return await pollAIStatus(prediction.id);
    }

    throw new Error("AI could not generate a visual result.");

  } catch (error: any) {
    console.error("AI Service Execution Error:", error.message);
    throw new Error(error.message || "Connection to Maison AI Archives failed.");
  }
};

/**
 * এআই রেজাল্ট তৈরি হওয়া পর্যন্ত প্রতি ৩ সেকেন্ড পরপর স্ট্যাটাস চেক করার ফাংশন
 */
const pollAIStatus = async (id: string): Promise<string> => {
  let status = "starting";
  let finalResultUrl = "";

  while (status !== "succeeded" && status !== "failed") {
    // ৩ সেকেন্ড বিরতি (এআই সার্ভারকে প্রসেস করার সময় দেওয়া হচ্ছে)
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // আমাদের তৈরি করা স্ট্যাটাস প্রক্সি কল করা হচ্ছে
    const response = await fetch(`/api/status/${id}`);
    const result = await response.json();
    
    status = result.status;

    if (status === "succeeded") {
      finalResultUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    }

    if (status === "failed") {
      throw new Error("Maison AI tailoring process failed. Please use a clearer portrait.");
    }
  }

  return finalResultUrl;
};