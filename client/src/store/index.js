import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",  
    EDIT_LIST_NAME: "EDIT_LIST_NAME",  
    DELETE_LIST: "DELETE_LIST",
    EDIT_SONG: "EDIT_SONG",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();
let deleteListId2 = null;
let deleteSongId2 = null;
let deleteSongIndex = null;
let listDeleteName = "";
let songDeleteName = "";
let editSongIdX = null;
let editSongIndex = null;
let editSongTitle = "";
let editSongArtist = "";
let  editSongY = "";

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false
                })
            }
            // DELETE A LIST
            case GlobalStoreActionType.DELETE_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                })
            }
            // EDIT SONG
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                })
            }
              // EDIT SONG
              case GlobalStoreActionType.EDIT_LIST_NAME: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES ADDING A NEW LIST 
    store.createNewList = async function () {
        console.log("CRenant new list");
        let body = {
            name: "Untitled",
            songs: [],
        };
        let response = await api.createPlaylist(body);
        console.log(response);
        console.log(this.idNamePairs);

        if(response.data.success){
            let playlist = response.data.playlist;
            let newId = response.data.id;
            console.log("Peep");
            console.log(playlist);
            console.log("Peep2");
            let newObj = {
                _id: newId, 
                name: "Untitled" 
            }
            let idNamePairs2 = this.idNamePairs.push(newObj);
            console.log(idNamePairs2);

            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: {
                    idNamePairs: idNamePairs2,
                    playlist: playlist,
                }
            });
        }
    }

    // THIS FUNCTION PROCESSES DELETE A  LIST 
    store.deleteList = async function (id) {
        // console.log("DELETEEE");
        // console.log(id);
        // console.log(this.idNamePairs);

        let response = await api.deleteList(id);
        // console.log(response);
        if(response.data.success){
            let newId = this.idNamePairs;
            let playlist = response.data.playlist;
            // console.log("Nuts");
            // console.log(playlist);
            // console.log(this.idNamePairs);
            function removeObjectWithId(arr, id) {
                const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
                arr.splice(objWithIdIndex, 1);
                return arr;
              }
              storeReducer({
                type: GlobalStoreActionType.DELETE_LIST,
                payload: {
                    idNamePairs: newId,
                    playlist: playlist,
                    currentList: null,
                }
            });
              removeObjectWithId(newId, id);
              console.log(newId);
              store.history.push("");
        }
    }
    async function asyncShowDeleteListModal(id, name){
        let modal = document.getElementById("delete-list-modal");
        // console.log(modal);
        // console.log("LLL");
        modal.classList.add("is-visible");
        deleteListId2 = id;
        listDeleteName = name + "";
        var number = document.getElementById("modal-center-content");  
        number.innerHTML = 'Are you sure you wish to permanently delete the '.concat(" ", listDeleteName).concat(" ", "playlist?");
    } 
    store.deleteListStart = (id, name) => {
        // console.log("LLL1");   
        // console.log(name);
        asyncShowDeleteListModal(id, name);

    }
    store.confirmDeleteList = async function(){
        // console.log("LLLggkkk");
        // console.log(deleteListId2);
        store.deleteList(deleteListId2);
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }
    store.hideDeleteListModal = async function(){
        deleteListId2 = null;
        let modal = document.getElementById("delete-list-modal");
        // console.log(modal);
        modal.classList.remove("is-visible");
    }

    store.addNewSong = async function (id) {
        // console.log("Add Song");
   
        let song = {  
            title: "Untitled",
            artist: "Unknown",
            youTubeId: "dQw4w9WgXcQ"
        };
        // console.log(this.currentList);
        // console.log(this.currentList.songs);

        // // this.currentList.songs.push(song);
        // console.log("Aff");
        // console.log(this.currentList);
        // console.log(this.currentList.songs);

        // console.log(id);
        // console.log(this);
        const newPlaylist = Object.assign({}, this.currentList);
        newPlaylist.songs.push(song);
        // console.log("jyjyfvuvv");
        console.log(newPlaylist);
        let response = await api.editSong(id, newPlaylist);
        console.log(response);
        if(response.data.success){
            let playlist = response.data.playlist;
            // console.log("Peepster");
            // console.log(playlist);

            storeReducer({
                type: GlobalStoreActionType.EDIT_SONG,
                payload: {
                    playlist: playlist,
                }
            });
        }
        // store.loadIdNamePairs();
    }

    store.deleteSong = async function (id, index) {
        console.log("dd Song");
     
        console.log(this.currentList);
        console.log(this.currentList.songs);

        // this.currentList.songs.push(song);
        console.log("Aff");
        console.log(this.currentList.songs[index]);
        this.currentList.songs.splice(index, 1);
        console.log(this.currentList.songs);
        console.log(id);

        let response = await api.editSong(id, this.currentList);
        console.log(response);
        if(response.data.success){
            let playlist = response.data.playlist;
            console.log("Peepster Part 2");
            console.log(playlist);

            storeReducer({
                type: GlobalStoreActionType.EDIT_SONG,
                payload: {
                    playlist: playlist,
                }
            });
        }
    }

    async function asyncShowDeleteSongModal(id, name){
        let modal = document.getElementById("remove-song-modal");
        console.log(modal);
        console.log("LLL");
        modal.classList.add("is-visible");
        deleteSongId2 = id;
        songDeleteName = name + "";
        console.log(typeof songDeleteName);
        var spanner = document.getElementById("remove-song-span"); 
        spanner.innerHTML =  songDeleteName; 
        // number.innerHTML = 'Are you sure you wish to permanently delete the '.concat(" ", songDeleteName).concat(" ", "from the playlist?");
    } 
    store.deleteSongStart = (_id, index, title) => {
        // console.log("LLL1");   
        // deleteSongId2 = _id;
        deleteSongIndex = index;
        console.log(title);
        asyncShowDeleteSongModal(_id, title);

    }
    store.confirmDeleteSong = async function(){
        // console.log("LLLggkkk");
        // console.log(deleteListId2);
        store.deleteSong(deleteSongId2, deleteSongIndex);
        let modal = document.getElementById("remove-song-modal");
        modal.classList.remove("is-visible");
    }

    store.hideDeleteSongModal = async function(){
        deleteSongId2 = null;
        let modal = document.getElementById("remove-song-modal");
        // console.log(modal);
        modal.classList.remove("is-visible");
    }


    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }


    //--------------------------------------------------------------
    store.editSongHelper = async function (id, index, newTitle, newArtist, newY) {
        console.log("Edit Song");
     
        console.log(this.currentList);
        console.log(this.currentList.songs);

        let newSongUpdate = {  
            title: newTitle,
            artist: newArtist,
            youTubeId: newY,
        };
        // this.currentList.songs.push(song);
        console.log("Aff");
        console.log(this.currentList.songs[index]);
        this.currentList.songs.splice(index, 1);
        this.currentList.songs.splice(index, 0, newSongUpdate);

        console.log(this.currentList.songs);
        console.log(id);

        let response = await api.editSong(id, this.currentList);
        console.log(response);
        if(response.data.success){
            let playlist = response.data.playlist;
            console.log("Peepster Part 2");
            console.log(playlist);

            storeReducer({
                type: GlobalStoreActionType.EDIT_SONG,
                payload: {
                    playlist: playlist,
                }
            });
        }
    }

    async function asyncShowEditSongModal(id, index, title, artist, youTubeId){
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        editSongIdX = id;
        editSongIndex = index;
        editSongTitle = title + "";
        editSongArtist = artist + "";
        editSongY = youTubeId + "";
        console.log("99999");
        console.log(editSongTitle);
        console.log(editSongArtist);
        console.log(editSongY);
        var number1 = document.getElementById("edit-song-modal-title-textfield");  
        var number2 = document.getElementById("edit-song-modal-artist-textfield");  
        var number3 = document.getElementById("edit-song-modal-youTubeId-textfield");  
        number1.value = editSongTitle;
        number2.value = editSongArtist;
        number3.value = editSongY;

    } 
    store.editSongStart = (id, index, title, artist, youTubeId) => {
        asyncShowEditSongModal(id, index, title, artist, youTubeId);
    }
    store.confirmEditSong = async function(newTitle, newArtist, newY){
        // console.log("LLLggkkk");
        // console.log(deleteListId2);
        // store.deleteList(deleteListId2);
        store.editSongHelper(editSongIdX, editSongIndex, newTitle, newArtist, newY);
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }
    store.hideEditSong = async function(){
        editSongIdX = null;
        editSongIndex = null;
        let modal = document.getElementById("edit-song-modal");
        // console.log(modal);
        modal.classList.remove("is-visible");
    }
    //--------------------------------------------------------------


    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }
    store.setIsListNameEditActive = function (id) {
        async function asyncSetIsListNameEditActive (){
            let response = await api.getPlaylistById(id);
        storeReducer({
            type: GlobalStoreActionType.CHANGE_LIST_NAME,
            payload: { idNamePairs: store.idNamePairs,}
        });
    }
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}