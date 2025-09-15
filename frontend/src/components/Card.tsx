/**
 * Simple modal placeholder. Extend as needed.
 */
type Props = {
  isCardOpen: boolean;
  employeeName: string;
  startDate: string;
  endDate: string;
  children?: React.ReactNode;
};

const Modal = ({
  isCardOpen,
  employeeName,
  startDate,
  endDate,
  children,
}: Props) => {
  return (
    <>
      {isCardOpen && (
        <div>
          <p>{employeeName}</p>
          <p>{startDate}</p>
          <p>{endDate}</p>
          <div className="mt-4 flex gap-2">{children}</div>
        </div>
      )}
    </>
  );
};

export default Modal;
