import {
  subscribeOwned,
  addOwned,
  updateOwned,
  removeOwned,
} from "./firestoreService";

const COLLECTION = "leads";

export function subscribeLeads(ownerId, callback) {
  return subscribeOwned(COLLECTION, ownerId, "createdAt", callback);
}

export function addLead(ownerId, lead) {
  return addOwned(COLLECTION, ownerId, lead);
}

export function updateLead(id, lead) {
  return updateOwned(COLLECTION, id, lead);
}

export function deleteLead(id) {
  return removeOwned(COLLECTION, id);
}
