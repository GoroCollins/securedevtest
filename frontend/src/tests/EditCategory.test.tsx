import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import EditCategory from "../components/Categories/EditCategory";
import { categoriesURL } from "../components/Common/Endpoints";
import { ProtectedRoute } from "../components/Common/ProtectedRoutes"; 
import { AuthProvider } from "../components/Common/Auth.Service"; 

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
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("EditCategory Component", () => {
  const renderComponent = (id: string, isAuthenticated: boolean = true) =>
    render(
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/edit-category/:id"
              element={
                <ProtectedRoute>
                  <EditCategory />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={`/edit-category/${id}`} />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );

  test("renders and displays fetched category data", async () => {
    renderComponent("CAT001", true); // Pass true for authenticated user
    
    expect(screen.getByText("Edit Category")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByDisplayValue("CAT001")).toBeInTheDocument());
    expect(screen.getByDisplayValue("Category 1 Description")).toBeInTheDocument();
  });

  test("redirects to login when not authenticated", async () => {
    renderComponent("CAT001", false); // Pass false for unauthenticated user

    await waitFor(() => {
      expect(screen.queryByText("Edit Category")).not.toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument(); // Adjust according to your login page component
    });
  });
      
  test("displays success message on successful update", async () => {
    renderComponent("CAT001", true); // Ensure user is authenticated

    await waitFor(() => screen.getByDisplayValue("CAT001"));

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: "Updated category description" } });

    fireEvent.click(screen.getByText("Update Category"));

    await waitFor(() =>
      expect(screen.getByText("Category updated successfully.")).toBeInTheDocument()
    );
  });

  test("displays error message on failed category fetch", async () => {
    server.use(
      http.get(`${categoriesURL}:id`, () =>
        HttpResponse.json(null, { status: 500 })
      )
    );

    renderComponent("CAT001", true); // Ensure user is authenticated

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

    renderComponent("CAT001", true); // Ensure user is authenticated

    await waitFor(() => screen.getByDisplayValue("CAT001"));

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: "Failed update description" } });

    fireEvent.click(screen.getByText("Update Category"));

    await waitFor(() =>
      expect(screen.getByText("Failed to update category.")).toBeInTheDocument()
    );
  });

  test("displays validation error if description is empty", async () => {
    renderComponent("CAT001", true); // Ensure user is authenticated

    await waitFor(() => screen.getByDisplayValue("CAT001"));

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: "" } });

    fireEvent.click(screen.getByText("Update Category"));

    await waitFor(() =>
      expect(screen.getByText("This is required")).toBeInTheDocument()
    );
  });
});
