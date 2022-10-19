import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    function handleDeleteSong(){
        let _id = store.currentList._id;
        // console.log("(99993939393");
        // console.log(song.title);
        // console.log(store.currentList.song.title);
        // console.log(_id);
        // console.log(index);
        store.deleteSongStart(_id, index, song.title);  
        // store.deleteSong(_id, index);
    }
    function handleEditSong(){
        let _id = store.currentList._id;

        store.editSongStart(_id, index, song.title, song.artist, song.youTubeId);  
    }
    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDoubleClick={handleEditSong}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleDeleteSong}
            />
        </div>
    );
}

export default SongCard;