import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// Verilen koleksiyonda, giriş yapan kullanıcıya (ownerId) ait belgeleri
// gerçek zamanlı dinler. Yeni kayıt eklendiğinde/değiştiğinde callback
// otomatik tekrar çağrılır.
export function subscribeOwned(collectionName, ownerId, orderField, callback) {
  const q = query(
    collection(db, collectionName),
    where("ownerId", "==", ownerId),
    orderBy(orderField, "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function addOwned(collectionName, ownerId, data) {
  return addDoc(collection(db, collectionName), {
    ...data,
    ownerId,
    createdAt: serverTimestamp(),
  });
}

export function updateOwned(collectionName, id, data) {
  return updateDoc(doc(db, collectionName, id), data);
}

export function removeOwned(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}
