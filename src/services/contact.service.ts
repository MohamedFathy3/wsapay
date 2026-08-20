// src/services/contact.service.ts
import api from "@/lib/api";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class ContactService {
  /**
   * إرسال رسالة تواصل
   * POST /api/contact
   */
  async sendMessage(data: ContactFormData): Promise<ContactFormData> {
    try {
      const response = await api.post("/contact", data);
      return response.data;
    } catch (error) {
      console.error("Error sending contact message:", error);
      throw error;
    }
  }
}

export const contactService = new ContactService();
