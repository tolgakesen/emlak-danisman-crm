import {
  subscribeOwned,
  addOwned,
  removeOwned,
} from "./firestoreService";

const COLLECTION = "calls";

export function subscribeCalls(ownerId, callback) {
  return subscribeOwned(COLLECTION, ownerId, "callDate", callback);
}

export function addCall(ownerId, call) {
  return addOwned(COLLECTION, ownerId, call);
}

export function deleteCall(id) {
  return removeOwned(COLLECTION, id);
}
