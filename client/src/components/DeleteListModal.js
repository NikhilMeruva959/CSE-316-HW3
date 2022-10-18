import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
function DeleteListModal() {
        let name = "";
        console.log("III2");
        const { store } = useContext(GlobalStoreContext);
        
        function handleConfirm(){
            store.confirmDeleteList();
        }
        function handleCancel(){
            store.hideDeleteListModal();
        }

        return (
            <>
            <div 
                class="modal" 
                id="delete-list-modal" 
                data-animation="slideInOutLeft">
                    <div class="modal-dialog" id='verify-delete-list-root'>
                        <div class="modal-north">
                            Delete playlist?
                        </div>
                        <div class="modal-center">
                            <div class="modal-center-content" id="modal-center-content">
                            </div>
                        </div>
                        <div class="modal-south">
                            <input type="button" 
                                id="delete-list-confirm-button" 
                                class="modal-button" 
                                onClick={handleConfirm}
                                value='Confirm' />
                            <input type="button" 
                                id="delete-list-cancel-button" 
                                class="modal-button" 
                                onClick={handleCancel}
                                value='Cancel' />
                        </div>
                    </div>
            </div>
            </>
        );
}
export default DeleteListModal;