// src/contexts/BookmarkContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState([]);

  // load saved bookmarks on start
  useEffect(() => {
    AsyncStorage.getItem("bookmarks")
      .then((data) => {
        if (data) setBookmarks(JSON.parse(data));
      })
      .catch(console.error);
  }, []);

  // helper to save
  const persist = async (newList) => {
    setBookmarks(newList);
    await AsyncStorage.setItem("bookmarks", JSON.stringify(newList));
  };

  const addBookmark = (book) => {
    if (!bookmarks.find((b) => b.id === book.id)) {
      persist([...bookmarks, book]);
    }
  };

  const removeBookmark = (bookId) => {
    persist(bookmarks.filter((b) => b.id !== bookId));
  };

  const isBookmarked = (bookId) => {
    return bookmarks.some((b) => b.id === bookId);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}
