import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API_ENDPOINTS from "./apiConfig";
import api from "./client";

export async function fetchConversations() {
  const res = await api.get(API_ENDPOINTS.conversations);
  return res.data;
}

export async function startConversation(participantId) {
  const res = await api.post(API_ENDPOINTS.conversations, {
    participant_id: participantId,
  });
  return res.data;
}

export async function fetchMessages(conversationId) {
  const res = await api.get(API_ENDPOINTS.messages(conversationId));
  return res.data;
}

export async function sendMessage(convId, text = "", attachments = {}) {
  const form = new FormData();
  form.append("body", text);

  if (attachments.image) {
    form.append("image", {
      uri: attachments.image.uri,
      name: attachments.image.fileName || "photo.jpg",
      type: attachments.image.type || "image/jpeg",
    });
  }
  if (attachments.video) {
    form.append("video", {
      uri: attachments.video.uri,
      name: attachments.video.fileName || "video.mp4",
      type: attachments.video.type || "video/mp4",
    });
  }
  if (attachments.audio) {
    form.append("audio", {
      uri: attachments.audio.uri,
      name: attachments.audio.name || "audio.mp3",
      type: attachments.audio.type || "audio/mpeg",
    });
  }
  if (attachments.file) {
    form.append("file", {
      uri: attachments.file.uri,
      name: attachments.file.name,
      type: attachments.file.type,
    });
  }
  if (attachments.bookLink) {
    form.append("book_link", attachments.bookLink);
  }

  const res = await api.post(API_ENDPOINTS.messages(convId), form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
