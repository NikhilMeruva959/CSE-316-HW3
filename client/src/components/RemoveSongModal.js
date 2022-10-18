import React, { Component } from 'react';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'

function RemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);
    function handleConfirm(){
        store.confirmDeleteSong();
    }
    function handleCancel(){
        store.hideDeleteSongModal();
    }
        return (
            <div class="modal" id="remove-song-modal" data-animation="slideInOutLeft">
            <div class="modal-dialog" id='verify-remove-song-root'>
                <div class="modal-north">
                    Remove song?
                </div>                            
                <div class="modal-center">
                    <div class="modal-center-content">
                        Are you sure you wish to permanently remove <span id="remove-song-span"></span> from the playlist?
                    </div>
                </div>
                <div class="modal-south">
                    <input type="button" onClick={handleConfirm} id="remove-song-confirm-button" class="modal-button" value='Confirm' />
                    <input type="button" onClick={handleCancel} id="remove-song-cancel-button" class="modal-button" value='Cancel' />
                </div>
            </div>
        </div>
    
        );
}
export default RemoveSongModal;