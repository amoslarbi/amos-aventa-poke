import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/Pagination";
import "@testing-library/jest-dom";

describe("Pagination", () => {
  const setPage = jest.fn();
  
  it("renders pagination controls and handles clicks", () => {
    render(<Pagination page={2} setPage={setPage} limit={10} total={30} />);
    
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    expect(screen.getByText("Previous")).not.toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();

    fireEvent.click(screen.getByText("Previous"));
    expect(setPage).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText("Next"));
    expect(setPage).toHaveBeenCalledWith(3);
  });

  it("disables Previous button on first page", () => {
    render(<Pagination page={1} setPage={setPage} limit={10} total={30} />);
    expect(screen.getByText("Previous")).toBeDisabled();
  });
});