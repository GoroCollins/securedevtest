import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditShoe from "../components/Shoes/EditShoe";
import { shoesURL, categoriesURL, shoeimagesURL } from "../components/Common/Endpoints";
import { AuthProvider } from "../components/Common/Auth.Service";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock data
const mockCategories = [
  { code: "sneakers", description: "Sneakers" },
  { code: "boots", description: "Boots" },
];
const mockShoe = {
  id: "1",
  category: "sneakers",
  name: "Sample Shoe",
  description: "A sample description",
  price: 100,
  quantity: 5,
  images: [{ id: "1", url: "image_url_1.jpg" }],
};
const mockNewImage = new File(["dummy content"], "test_image.jpg", { type: "image/jpg" });

// Set up MSW server
const server = setupServer(
  http.get(categoriesURL, () => HttpResponse.json(mockCategories)),
  http.get(`${shoesURL}1`, () => HttpResponse.json(mockShoe)),
  http.get(shoeimagesURL, (req) => {

    const shoeId = new URL(req.request.url).searchParams.get("shoe");
    if (shoeId === "1") {
      return HttpResponse.json(mockShoe.images);
    }
    return HttpResponse.json([]);
  }),
  http.put(`${shoesURL}1/`, () => HttpResponse.json({ status:200, message: "Update successful" })),
  http.post(shoeimagesURL, () => HttpResponse.json({ status: 201, id: "new_image_id", url: "new_image_url.jpg" }))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderComponent = () =>
    render(
        <AuthProvider>
          <MemoryRouter initialEntries={["/edit-shoe/1"]}>
            <Routes>
              <Route path="/edit-shoe/:id" element={<EditShoe />} />
              <Route path="/" element={<div>Home Page</div>} /> {/* Added Route to handle redirect */}
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );

describe("EditShoe Component", () => {
  it("renders loading state initially", async () => {
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders form fields with fetched data", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Sample Shoe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("100")).toBeInTheDocument();
      expect(screen.getByText(/sneakers/i)).toBeInTheDocument();
    });
  });

//   it("updates shoe successfully", async () => {
//     renderComponent();

//     await waitFor(() => screen.getByDisplayValue("Sample Shoe"));

//     fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Updated Shoe" } });
//     fireEvent.change(screen.getByLabelText(/price/i), { target: { value: "150" } });
//     fireEvent.submit(screen.getByRole("button", { name: /update shoe/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/shoe update is successful/i)).toBeInTheDocument();
//     });
//   });

//   it("uploads new images", async () => {
//     renderComponent();

//     await waitFor(() => screen.getByDisplayValue("Sample Shoe"));

//     const fileInput = screen.getByLabelText(/new images/i);
//     fireEvent.change(fileInput, { target: { files: [mockNewImage] } });
//     fireEvent.submit(screen.getByRole("button", { name: /update shoe/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/shoe update is successful/i)).toBeInTheDocument();
//     });
//   });

//   it("displays error message if update fails", async () => {
//     server.use(
//       http.put(`${shoesURL}1/`, () => HttpResponse.json({ status: 500,  message: "Update failed" }))
//     );

//     renderComponent();

//     await waitFor(() => screen.getByDisplayValue("Sample Shoe"));

//     fireEvent.submit(screen.getByRole("button", { name: /update shoe/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/update failed/i)).toBeInTheDocument();
//     });
//   });

  it("shows categories in dropdown", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Sneakers")).toBeInTheDocument();
      expect(screen.getByText("Boots")).toBeInTheDocument();
    });
  });
});
