import {
  subscribeOwned,
  addOwned,
  updateOwned,
  removeOwned,
} from "./supabaseService";

const COLLECTION = "contacts";

export function subscribeContacts(ownerId, callback) {
  return subscribeOwned(COLLECTION, ownerId, "createdAt", callback);
}

export function addContact(ownerId, contact) {
  return addOwned(COLLECTION, ownerId, contact);
}

export function updateContact(id, contact) {
  return updateOwned(COLLECTION, id, contact);
}

export function deleteContact(id) {
  return removeOwned(COLLECTION, id);
}
