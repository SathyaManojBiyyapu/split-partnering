"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;

  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- AUTH CHECK ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setFirebaseUser(user);

        await setDoc(doc(db, "status", user.uid), {
          online: true,
          lastSeen: serverTimestamp(),
        });
      }
    });

    return () => unsub();
  }, [router]);

  /* ---------------- VERIFY ACCESS ---------------- */
  useEffect(() => {
    if (!firebaseUser || !groupId) return;

    const verifyAccess = async () => {
      const paymentsRef = collection(db, "payments");
      const qPay = query(
        paymentsRef,
        where("uid", "==", firebaseUser.uid),
        where("groupId", "==", groupId),
        where("status", "==", "paid")
      );

      const paySnap = await getDocs(qPay);
      if (paySnap.empty) {
        router.push("/dashboard");
        return;
      }

      const chatsRef = collection(db, "chats");
      const qChat = query(chatsRef, where("groupId", "==", groupId));
      const chatSnap = await getDocs(qChat);

      if (chatSnap.empty) {
        router.push("/dashboard");
        return;
      }

      const chatDoc = chatSnap.docs[0];
      setChatId(chatDoc.id);
      setLoading(false);
    };

    verifyAccess();
  }, [firebaseUser, groupId, router]);

  /* ---------------- LOAD MESSAGES ---------------- */
  useEffect(() => {
    if (!chatId || !firebaseUser) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const qMessages = query(messagesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(qMessages, async (snapshot) => {
      const msgs: any[] = [];

      snapshot.forEach((docSnap) => {
        msgs.push({ id: docSnap.id, ...docSnap.data() });
      });

      setMessages(msgs);

      for (const msg of msgs) {
        if (
          msg.senderId !== firebaseUser.uid &&
          (!msg.seenBy || !msg.seenBy.includes(firebaseUser.uid))
        ) {
          const msgRef = doc(db, "chats", chatId, "messages", msg.id);
          await updateDoc(msgRef, {
            seenBy: [...(msg.seenBy || []), firebaseUser.uid],
          });
        }
      }
    });

    return () => unsub();
  }, [chatId, firebaseUser]);

  /* ---------------- TYPING STATUS ---------------- */
  useEffect(() => {
    if (!chatId) return;

    const typingRef = collection(db, "chats", chatId, "typing");

    const unsub = onSnapshot(typingRef, (snapshot) => {
      const users: string[] = [];
      snapshot.forEach((doc) => {
        if (doc.id !== firebaseUser?.uid) users.push(doc.id);
      });
      setTypingUsers(users);
    });

    return () => unsub();
  }, [chatId, firebaseUser]);

  const handleTyping = async (value: string) => {
    setNewMessage(value);
    if (!chatId || !firebaseUser) return;

    const typingDoc = doc(db, "chats", chatId, "typing", firebaseUser.uid);

    if (value.trim()) {
      await setDoc(typingDoc, { typing: true });
    } else {
      await setDoc(typingDoc, { typing: false });
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId || !firebaseUser) return;

    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: firebaseUser.uid,
      createdAt: serverTimestamp(),
      seenBy: [firebaseUser.uid],
      deleted: false,
      deletedFor: [],
    });

    setNewMessage("");
  };

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 border-b border-gray-700 text-[#E6C972] font-bold text-xl">
        Partner Sync Chat
        <div className="text-sm text-green-400">
          {onlineUsers.length > 1 ? "Members Online" : "Offline"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMine = msg.senderId === firebaseUser.uid;

          const time = msg.createdAt?.seconds
            ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          const handleDeleteForEveryone = async () => {
            if (!chatId) return;
            const msgRef = doc(db, "chats", chatId, "messages", msg.id);

            await updateDoc(msgRef, {
              text: "This message was deleted",
              deleted: true,
            });
          };

          const handleDeleteForMe = async () => {
            if (!chatId) return;
            const msgRef = doc(db, "chats", chatId, "messages", msg.id);

            await updateDoc(msgRef, {
              deletedFor: [...(msg.deletedFor || []), firebaseUser.uid],
            });
          };

          if (msg.deletedFor?.includes(firebaseUser.uid)) return null;

          return (
            <div
              key={msg.id}
              className={`relative group p-3 rounded-xl max-w-xs ${
                isMine
                  ? "bg-[#E6C972] text-black ml-auto"
                  : "bg-gray-700"
              }`}
            >
              {msg.deleted ? (
                <div className="italic text-gray-400">
                  🚫 This message was deleted
                </div>
              ) : (
                <div>{msg.text}</div>
              )}

              <div className="text-xs mt-1 flex justify-between items-center">
                <span>{time}</span>
                {isMine && (
                  <span>
                    {msg.seenBy?.length > 1 ? "✔✔" : "✔"}
                  </span>
                )}
              </div>

              {isMine && !msg.deleted && (
                <div className="absolute top-1 right-1 hidden group-hover:flex gap-2 text-xs">
                  <button
                    onClick={handleDeleteForMe}
                    className="text-yellow-400"
                  >
                    Delete Me
                  </button>
                  <button
                    onClick={handleDeleteForEveryone}
                    className="text-red-400"
                  >
                    Delete All
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-400 italic">
            Someone is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => handleTyping(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-gray-800 text-white outline-none"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-[#E6C972] text-black rounded-lg font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}