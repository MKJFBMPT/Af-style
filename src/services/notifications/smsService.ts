/**
 * AF STYLE - Premium SMS Service
 * Integration with BulkSMSBD.com
 */

const API_KEY = import.meta.env.VITE_BULKSMS_API_KEY;
const SENDER_ID = import.meta.env.VITE_BULKSMS_SENDER_ID;

interface SMSResponse {
  type: string;
  msg: string;
  status?: string;
}

/**
 * কাস্টমারকে অর্ডারের পর অটোমেটিক এসএমএস পাঠানোর ফাংশন
 * @param phoneNumber কাস্টমারের ফোন নম্বর (যেমন: 01700000000)
 * @param orderId অর্ডারের ইউনিক আইডি
 * @param customerName কাস্টমারের নাম
 */
export const sendOrderConfirmationSMS = async (
  phoneNumber: string,
  orderId: string,
  customerName: string
): Promise<SMSResponse> => {
  try {
    // ফোন নম্বর ফরম্যাট ঠিক করা (নিশ্চিত করা যেন শুরুতে ৮৮ থাকে)
    let formattedNumber = phoneNumber.trim();
    if (!formattedNumber.startsWith('88')) {
      formattedNumber = '88' + (formattedNumber.startsWith('0') ? formattedNumber : '0' + formattedNumber);
    }

    // আপনার কাঙ্ক্ষিত মেসেজ ফরম্যাট (এখানে আপনি আপনার পছন্দমতো টেক্সট বদলাতে পারেন)
    const message = `AF STYLE: Excellence Secured! Dear ${customerName}, thank you for your order. Your Order ID is #${orderId.slice(0, 8).toUpperCase()}. We are preparing your piece with care.`;

    // BulkSMSBD API URL তৈরি করা
    const url = `https://bulksmsbd.net/api/smsapi?api_key=${API_KEY}&type=text&number=${formattedNumber}&senderid=${SENDER_ID}&message=${encodeURIComponent(message)}`;

    const response = await fetch(url, {
      method: 'GET', // BulkSMSBD GET এবং POST উভয়ই সাপোর্ট করে
    });

    const data = await response.json();
    console.log("SMS API Response:", data);
    return data;
  } catch (error) {
    console.error("SMS Service Error:", error);
    throw new Error("Failed to send SMS notification.");
  }
};