// Limit Dropdown interface
interface LimitDropdownProps {
    limit: number;
    setLimit: (limit: number) => void;
    setPage: (page: number) => void;
  }
  
  export default function LimitDropdown({ limit, setLimit, setPage }: LimitDropdownProps) {
    // Dropdown limits
    const limits = [5, 10, 15, 20];
  
    return (
      <div className="mb-4">
        <label htmlFor="limit" className="mr-2">Items per page:</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {limits.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>
    );
  }