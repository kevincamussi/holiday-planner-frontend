type Props = {
  isModalOpen: boolean;
};

const Modal = ({ isModalOpen }: Props) => {
  return <div className="">{isModalOpen && <div>MODAL</div>}</div>;
};

export default Modal;
