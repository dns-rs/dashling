import styles from './Modal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
   content: React.ReactNode;
   label: string;
   onClose: () => void;
 }

const Modal: React.FC<ModalProps> = ({ label, content, onClose }) => {
   return(
      <div className={styles['modal-wrapper']}>
         <div className={styles['modal']}>
            <div className={styles['header']}>
               <div>
               <FontAwesomeIcon icon={faCloudArrowUp} />
               <span className={styles['label']}>{label}</span>
               </div>
               <button onClick={onClose}>×</button>
            </div>
            <div className={styles['content']}>
               {content}
            </div>
         </div>
      </div>
   )
}
export default Modal;