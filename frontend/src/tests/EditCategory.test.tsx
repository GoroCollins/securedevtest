import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import EditCategory from "../components/Categories/EditCategory";
import { categoriesURL } from "../components/Common/Endpoints";

const server = setupServer(
  http.get(`${categoriesURL}:id`, (req) => {
    const { id } = req.params;
    if (id === "CAT001") {
      return HttpResponse.json(
        { code: "CAT001", description: "Category 1 Description" },
        { status: 200 }
      );
    }
    return new HttpResponse(null, { status: 404 });
  }),
  http.put(`${categoriesURL}:id`, async (req) => {
    const requestBody = await req.request.arrayBuffer();
    const { description } = JSON.parse(new TextDecoder().decode(requestBody)) as { description: string };

    if (!description) {
      return HttpResponse.json({ message: "Description is required", status: 400 });
    }
    return HttpResponse.json({ message: "Category updated successfully", status: 200 });
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup(); // Clears rendered components between tests
});
afterAll(() => server.close());

describe("EditCategory Component", () => {
  const renderComponent = (id: string) =>
    render(
      <BrowserRouter>
          <Routes>
            <Route
              path="/edit-category/:id"
              element={
                  <EditCategory />
              }
            />
            <Route path="*" element={<Navigate to={`/edit-category/${id}`} />} />
            <Route path="/categories" element={<p>Available categories</p>} />
          </Routes>
      </BrowserRouter>
    );

  test("renders and displays fetched category data", async () => {
    renderComponent("CAT001"); // Pass true for authenticated user
    
    expect(screen.getByText("Edit Category")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByDisplayValue("CAT001")).toBeInTheDocument());
    expect(screen.getByDisplayValue("Category 1 Description")).toBeInTheDocument();
  });
      

  test("displays error message on failed category fetch", async () => {
    server.use(
      http.get(`${categoriesURL}:id`, () =>
        HttpResponse.json(null, { status: 500 })
      )
    );

    renderComponent("CAT001");

    await waitFor(() =>
      expect(screen.getByText("Failed to fetch category details.")).toBeInTheDocument()
    );
  });

  test("displays error message on failed category update", async () => {
    server.use(
      http.put(`${categoriesURL}:id`, () =>
        HttpResponse.json({ message: "Failed to update category" }, { status: 500 })
      )
    );

    renderComponent("CAT001"); // Ensure user is authenticated

    await waitFor(() => screen.getByDisplayValue("CAT001"));

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: "Failed update description" } });

    fireEvent.click(screen.getByText("Update Category"));

    await waitFor(() =>
      expect(screen.getByText("Failed to update category.")).toBeInTheDocument()
    );
  });

  test("displays validation error if description is empty", async () => {
    renderComponent("CAT001"); // Ensure user is authenticated

    await waitFor(() => screen.getByDisplayValue("CAT001"));

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("Update Category"));

    await waitFor(() =>
      expect(screen.getByText("This is required")).toBeInTheDocument()
    );
  });

  test("navigates to categories list on successful update", async () => {
    renderComponent("CAT001");

    await waitFor(() => screen.getByDisplayValue("CAT001"));

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: "Updated category description" } });

    fireEvent.click(screen.getByText("Update Category"));

    // Check for navigation to categories list
    await waitFor(() => expect(screen.getByText("Available categories")).toBeInTheDocument());
  });
});
