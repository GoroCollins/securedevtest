import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteShoeImage from "../components/Shoes/DeleteShoeImage";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { vi } from "vitest";

// Setup MSW server
const server = setupServer(
  // Mock DELETE request for deleting a shoe image
  http.delete("https://backend.local/api/shoeimages/:id/", () => {
    return new HttpResponse(null, { status:204}); // No Content
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("DeleteShoeImage Component", () => {
  it("calls onDeleteSuccess after successful deletion", async () => {
    const onDeleteSuccess = vi.fn();

    render(<DeleteShoeImage imageId="1" onDeleteSuccess={onDeleteSuccess} />);

    const deleteButton = screen.getByRole("button", { name: /Delete Image/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(onDeleteSuccess).toHaveBeenCalled();
    });
  });

//   it("displays error if deletion fails", async () => {
//     // Override the server handler to return an error
//     server.use(
//       http.delete("https://backend.local/api/shoeimages/:id/", () => {
//         return HttpResponse.json(
//           { status: 500,
//         error: "Failed to delete image" })
//         ;
//       })
//     );

//     const onDeleteSuccess = vi.fn();
//     const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

//     render(<DeleteShoeImage imageId="1" onDeleteSuccess={onDeleteSuccess} />);

//     const deleteButton = screen.getByRole("button", { name: /Delete Image/i });
//     fireEvent.click(deleteButton);

//     await waitFor(() => {
//       expect(consoleErrorSpy).toHaveBeenCalledWith("Error deleting shoe image:", "Failed to delete image");
//       expect(onDeleteSuccess).not.toHaveBeenCalled();
//     });

//     consoleErrorSpy.mockRestore();
//   });
});
