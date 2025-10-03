/**
 * Simple modal placeholder. Extend as needed.
 */
type Props = {
  isCardOpen: boolean;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  onDelete: ()=> void;
};

const Modal = ({
  isCardOpen,
  employeeName,
  department,
  startDate,
  endDate,
  onDelete,
}: Props) => {
  return (
    <>
      {isCardOpen && (
        <div className="border my-4 rounded-2xl flex flex-col  items-center justify-center text-center gap-2 p-2">
          <p className="capitalize">{employeeName}</p>
          <p className="capitalize">{`Department: ${department}`}</p>
          <p>{`From: ${startDate}`}</p>
          <p>{`To: ${endDate}`}</p>
          <button onClick={onDelete} className="px-2 py-1 text-sm bg-red-500 hover:bg-red-300 text-white rounded cursor-pointer">Delete</button>
          {/* <div className="mt-4 flex gap-2">{children}</div> */}
        </div>
      )}
    </>
  );
};

export default Modal;
