import { render, screen, fireEvent } from "@testing-library/react";
import LimitDropdown from "@/components/LimitDropdown";
import "@testing-library/jest-dom";

describe("LimitDropdown", () => {
  const setLimit = jest.fn();
  const setPage = jest.fn();

  it("renders limit options and handles change", () => {
    render(<LimitDropdown limit={10} setLimit={setLimit} setPage={setPage} />);
    
    const select = screen.getByLabelText("Items per page:");
    expect(select).toHaveValue("10");
    
    fireEvent.change(select, { target: { value: "15" } });
    expect(setLimit).toHaveBeenCalledWith(15);
    expect(setPage).toHaveBeenCalledWith(1);
  });
});