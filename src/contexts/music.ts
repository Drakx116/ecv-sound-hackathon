import React from "react";

export const defaultMusic = {
  informations: {
    author: "Gambi",
    color: "#34D399",
    title: "Macintosh",
    preview: "gambi-preview.jpg",
    video: "gambi.webm",
    loading: 0
  },
  setInformations: () => { }
};

export const MusicContext = React.createContext(defaultMusic);
