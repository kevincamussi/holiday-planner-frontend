/**
 * Simple modal placeholder. Extend as needed.
 */
interface Props {
  readonly isCardOpen: boolean;
  readonly employeeName: string;
  readonly department: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly onDelete: () => void;
}

const Card = ({
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
        <div className="p-3 bg-white rounded shadow-md my-2 hover:shadow-lg transition-all ">
          <p className="text-gray-800 font-semibold">{employeeName}</p>
          <p className="text-sm text-gray-600">{department}</p>
          <p className="text-xs text-gray-500">
            {startDate} - {endDate}
          </p>
          <button
            onClick={onDelete}
            className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white rounded py-1 text-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default Card;
