import React, { useState, useEffect, useRef } from "react";
import "../../styles/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const SongList = () => {
  // Estado para almacenar la lista de canciones
  const [songs, setSongs] = useState([]);

  // Estado para mantener el índice de la canción actual
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Estado para controlar si la canción está reproduciéndose o no
  const [isPlaying, setIsPlaying] = useState(false);

  // Ref para acceder al elemento de audio HTML
  const audioRef = useRef(null);

  // Cargar las canciones al montar el componente
  useEffect(() => {
    fetch("https://playground.4geeks.com/apis/fake/sound/fx")
      .then((response) => response.json())
      .then((data) => {
        setSongs(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Gestionar la reproducción y cambio de canciones
  useEffect(() => {
    // Verificar si el índice de la canción actual es válido 0 a la cantidad de canciones.
    if (currentSongIndex >= 0 && currentSongIndex < songs.length) {
      const songUrl = songs[currentSongIndex].url; //se accede a la propiedad URL de songs
      if (audioRef.current) {
        // Actualizar la URL del elemento de audio (Concateno)
        audioRef.current.src =
          "https://assets.breatheco.de/apis/sound/" + songUrl;

        // Reproducir o pausar la canción según el estado de reproducción
        if (isPlaying) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [currentSongIndex, songs, isPlaying]);

  // Manejar evento clic en una canción
  const handleSongClick = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  // Función para reproducir o pausar la canción actual
  const playPauseSong = () => {
    setIsPlaying(!isPlaying);
  };

  // Función para pasar a la siguiente canción
  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
    setIsPlaying(true); //función que actualiza el estado de reproducción de la canción
    // y controla si se debe reproducir o pausar el audio.
  };

  // Función para volver a la canción anterior
  const previousSong = () => {
    setCurrentSongIndex(
      (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
    );
    setIsPlaying(true);
  };

  return (
    <div>
      <div>
        {/* Mapear las canciones y mostrarlas */}
        {songs.map((song, index) => (
          <div
            className={`list ${currentSongIndex === index ? "selected" : ""}`}
            key={song.id}
            onClick={() => handleSongClick(index)}
          >
            <span className="song-number">{index + 1}&nbsp;&nbsp;&nbsp;</span>
            <span className="song-name">{song.name}</span>
          </div>
        ))}
      </div>

      <div className="controls">
        {/* Elemento de audio para reproducir la canción */}
        {currentSongIndex >= 0 && (
          <audio ref={audioRef} autoPlay className="hidden">
            <source type="audio/mpeg" />
          </audio>
        )}

        {/* Botones para controlar la reproducción */}
        <button onClick={previousSong}>
          <FontAwesomeIcon icon={faCaretLeft} />
        </button>
        <button onClick={playPauseSong}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button onClick={nextSong}>
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>
    </div>
  );
};

export default SongList;
