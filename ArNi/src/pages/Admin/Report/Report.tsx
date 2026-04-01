import React, {
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from "react";
import ActionButton from "../../../components/ActionButton/ActionButton";
import { useAppSelector, useAppDispatch } from "../../../store/injections";
import { fetchRegions_ } from "../../../components/Tables/regionThunk";
import DataTable, { TableColumn } from "react-data-table-component";
import { User } from '../../../store';
import { Region } from "../../../intl";

type ReportProps = {
  name1: string;
  user: User | null; // FIXED: Added user to props definition
};

interface State {
  count: number;
}

type Action = 
  | { type: "INC" } 
  | { type: "DEC" };

const initialState: State = { count: 0 };

/** --- 2. Reducer Function --- **/

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INC":
      return { count: state.count + 1 };
    case "DEC":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

/** --- 3. Main Component --- **/

const Report: React.FC<ReportProps> = ({ name1, user }) => {
  const dispatch_ = useAppDispatch();
  const { data, loading_ } = useAppSelector((state) => state.region);

  const [count, setCount] = useState(0);
  const [count1, setCount1] = useState(0);
  const [name, setName] = useState("N/A");
  const [isChecked, setCheck] = useState(false);
  const [formData, setForm] = useState({ name: "N/A", age: "N/A" });

  const id = useId();
  const nameRef = useRef<HTMLInputElement | null>(null);
  const ageRef = useRef<HTMLInputElement | null>(null);

  const [state, dispatch] = useReducer(reducer, initialState);

  // Data Fetching
  useEffect(() => {
    dispatch_(fetchRegions_({ page: 1, size: 10 }));
  }, [dispatch_]);

  // Sync Doc Title
  useEffect(() => {
    document.title = count.toString();
  }, [count]);

  /** --- 4. Handlers --- **/

  const increaseCount = () => setCount((prev) => prev + 1);
  const decreaseCount = () => setCount((prev) => prev - 1);
  const resetCount = () => setCount(0);
  const updateCount = (value: number) => setCount1((prev) => prev + value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("name:", nameRef.current?.value);
    console.log("age:", ageRef.current?.value);
  };

  /** --- 5. Column Definitions --- **/

  const columns: TableColumn<Region>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.country?.name || "N/A",
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
    },
    {
      name: "Zone",
      selector: (row) => row.zone,
    },
  ];

  if (loading_) return <p className="p-10 text-center">Loading regions...</p>;

  return (
    <div className="p-3 lg:ml-64 z-10 static mt-14">
      {/* User Info Section */}
      <section className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h2 className="text-lg font-bold text-blue-800 uppercase">Report Session</h2>
        <p className="text-sm text-blue-600 font-medium">Assigned to: {name1}</p>
        {user && (
          <p className="text-xs text-blue-500 italic">Logged in as: {user.email}</p>
        )}
      </section>

      {/* Counter Section */}
      <div className="flex items-center gap-4 mb-8">
        <ActionButton onClick={increaseCount}> + </ActionButton>
        <ActionButton onClick={decreaseCount}> - </ActionButton>
        <ActionButton onClick={resetCount}> Reset </ActionButton>
        <span className="font-bold text-xl">{count}</span>
      </div>

      {/* Reducer Section */}
      <section className="mb-8 p-4 bg-gray-50 rounded border">
        <h3 className="font-bold mb-2">Reducer Counter</h3>
        <div className="flex gap-2 items-center">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => dispatch({ type: "INC" })}>+</button>
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => dispatch({ type: "DEC" })}>-</button>
          <span className="ml-4 font-mono">{state.count}</span>
        </div>
      </section>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block text-sm font-bold">Ref Name</label>
          <input 
            ref={nameRef} 
            className="border p-2 rounded w-full max-w-xs" 
            placeholder="Type name..." 
          />
        </div>
        <div>
          <label className="block text-sm font-bold">Ref Age</label>
          <input 
            ref={ageRef} 
            className="border p-2 rounded w-full max-w-xs" 
            placeholder="Type age..." 
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Log Ref Values</button>
      </form>

      {/* Data Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <DataTable
          title="Region Report Data"
          columns={columns}
          data={data}
          progressPending={loading_}
          pagination
          highlightOnHover
          striped
        />
      </div>
    </div>
  );
};

export default Report;