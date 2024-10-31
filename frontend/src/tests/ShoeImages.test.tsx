import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShoeImages from "../components/Shoes/ShoeImages";
import { BrowserRouter } from "react-router-dom";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { vi } from "vitest";
import { SWRConfig } from "swr";

// Mock useParams to provide a shoeId
vi.mock("react-router-dom", async () => {
  const original = await vi.importActual("react-router-dom");
  return {
    ...original,
    useParams: () => ({ id: "123" }),  // Mock shoeId as "123"
  };
});

const server = setupServer(
  // Mock GET request for shoe images
  http.get("https://backend.local/api/shoeimages", (req) => {
    const shoeId = new URL(req.request.url).searchParams.get("shoe");
    if (shoeId === "123") {
      return HttpResponse.json([
          { id: "1", image: "image1.jpg", image_url: "http://localhost/image1.jpg" },
          { id: "2", image: "image2.jpg", image_url: "http://localhost/image2.jpg" },
        ])
      ;
    }
    return HttpResponse.json([]); // Return empty for unmatched shoeIds
  }),

  // Mock POST request to add an image
  http.post("https://backend.local/api/shoeimages", () => {
    return new HttpResponse(null, {status:201}); // Created
  }),

  // Mock DELETE request to delete an image
  http.delete("https://backend.local/api/shoeimages/:id", () => {
    return new HttpResponse(null, {status:204}); // No Content
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ShoeImages Component", () => {
  it("displays loading message and then shoe images", async () => {
    render(
      <BrowserRouter>
        <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
          <ShoeImages />
        </SWRConfig>
      </BrowserRouter>
    );

    expect(screen.getByText("Loading images...")).toBeInTheDocument();

    // Wait for images to be displayed
    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });
  });

  // it("allows adding a new image", async () => {
  //   render(
  //     <BrowserRouter>
  //       <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
  //         <ShoeImages />
  //       </SWRConfig>
  //     </BrowserRouter>
  //   );

  //   const file = new File(["new image"], "new-image.jpg", { type: "image/jpeg" });
  //   const fileInput = screen.getByLabelText("Upload a new image");
  //   fireEvent.change(fileInput, { target: { files: [file] } });

  //   const addButton = screen.getByRole("button", { name: /Add Image/i });
  //   fireEvent.click(addButton);

  //   await waitFor(() => {
  //     expect(screen.queryByText("Uploading...")).not.toBeInTheDocument();
  //   });
  // });

  // it("allows deleting an image", async () => {
  //   render(
  //     <BrowserRouter>
  //       <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
  //         <ShoeImages />
  //       </SWRConfig>
  //     </BrowserRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getAllByRole("img")).toHaveLength(2);
  //   });

  //   const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });
  //   fireEvent.click(deleteButtons[0]);

  //   await waitFor(() => {
  //     expect(screen.getAllByRole("img")).toHaveLength(1);
  //   });
  // });
});
