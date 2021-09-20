import { useContext } from "react";
import { MusicContext } from "../../contexts/music";
import useMusics from "../../hooks/useMusics";

function Bubbles() {
  const musics = useMusics();
  console.log(musics);
  const currentMusic = useContext(MusicContext);
  return (
    <>
      {musics.map((music) => {
        <div
          className="h-28 w-28 bg-red-400"
          style={{ backgroundColor: music.color }}
        ></div>;
      })}
    </>
  );

  return <><div className="h-48 w-48 bg-red-500"></div></>;
}

export default Bubbles;
