import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/dom";
import PersonForm from "../PersonForm";
import mockAxios from "axios";

// Mock out all top level functions, such as get, put, delete and post:
describe("PersonForm", () => {
  test("should render form with all elements visible", async () => {
    render(<PersonForm />);
    const textInputElementLabels = [
      /first name/i,
      /surname/i,
      /birth date/i,
      /email/i,
    ];
    const checkboxInputElements = screen.getAllByRole("checkbox");
    const submitButtonElement = screen.getByRole("button", { type: "submit" });

    textInputElementLabels.forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
      expect(screen.getByLabelText(label)).toBeVisible();
    });

    expect(checkboxInputElements).toHaveLength(3);
    checkboxInputElements.forEach((element) => {
      expect(element).toBeVisible();
    });

    expect(submitButtonElement).toBeInTheDocument();
    expect(submitButtonElement).toBeVisible();
  });
  describe("firstName Field", () => {
    test("should be able to type in input", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/first name/i);
      userEvent.type(inputElement, "John");
      await waitFor(() => {
        expect(inputElement.value).toBe("John");
      });
    });
    test("should show error on input click when input is empty", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/first name/i);
      userEvent.click(inputElement);
      await waitFor(() => {
        const errorElement = screen.getByTestId("firstNameError");
        expect(errorElement).not.toBe(null);
        expect(errorElement).toHaveTextContent("Required");
        expect(errorElement).toBeVisible();
      });
    });
    test("should show error when input text is shorter than 3 characters", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/first name/i);
      userEvent.type(inputElement, "Jo");
      await waitFor(() => {
        const errorElement = screen.getByTestId("firstNameError");
        expect(errorElement).not.toBe(null);
        expect(errorElement).toHaveTextContent(
          "First Name must have more than 2 characters"
        );
        expect(errorElement).toBeVisible();
      });
    });
    test("should not show error when input text is longer than 2 characters", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/first name/i);
      userEvent.type(inputElement, "Joh");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("firstNameError");
        expect(errorElement).toBe(null);
      });
    });
    test("should have 'success' className when input is valid", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/first name/i);
      userEvent.type(inputElement, "John");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("firstNameError");
        expect(errorElement).toBe(null);
        expect(inputElement).toHaveClass("success");
      });
    });
    test("should have 'error' className when input is not valid", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/first name/i);
      userEvent.type(inputElement, "Jo");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("firstNameError");
        expect(errorElement).not.toBe(null);
        expect(inputElement).toHaveClass("error");
      });
    });
    test("should not show error when input is empty and it was not focused after initial render", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/first name/i);
      await waitFor(() => {
        const errorElement = screen.queryByTestId("firstNameError");
        expect(inputElement).toBeInTheDocument();
        expect(errorElement).toBe(null);
      });
    });
  });
  describe("surname Field", () => {
    test("should be able to type in input", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/surname/i);
      userEvent.type(inputElement, "Smith");
      await waitFor(() => {
        expect(inputElement.value).toBe("Smith");
      });
    });
    test("should show error when input text is longer than 10 characters", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/surname/i);
      userEvent.type(inputElement, "Prettylongsurname");
      await waitFor(() => {
        const errorElement = screen.getByTestId("surnameError");
        expect(errorElement).not.toBe(null);
        expect(errorElement).toHaveTextContent(
          "Surname must have less than 11 characters"
        );
        expect(errorElement).toBeVisible();
      });
    });
    test("should not show error when input text is shorter than 11 characters", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/surname/i);
      userEvent.type(inputElement, "Smith");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("surnameError");
        expect(errorElement).toBe(null);
      });
    });
    test("should have 'success' className when input is valid", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/surname/i);
      userEvent.type(inputElement, "Smith");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("surnameError");
        expect(errorElement).toBe(null);
        expect(inputElement).toHaveClass("success");
      });
    });
    test("should have 'error' className when input is not valid", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/surname/i);
      userEvent.type(inputElement, "Prettylongsurname");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("surnameError");
        expect(errorElement).not.toBe(null);
        expect(inputElement).toHaveClass("error");
      });
    });
  });
  describe("birthDate Field", () => {
    test("should be able to type in input", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/birth date/i);
      userEvent.type(inputElement, "01/02/2000");
      await waitFor(() => {
        expect(inputElement.value).toBe("01/02/2000");
      });
    });
    test("should show error when focusing out of an empty input", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/birth date/i);
      fireEvent.focus(inputElement);
      fireEvent.focusOut(inputElement);
      await waitFor(() => {
        const errorElement = screen.getByTestId("birthDateError");
        expect(errorElement).not.toBe(null);
        expect(errorElement).toHaveTextContent("Required");
        expect(errorElement).toBeVisible();
      });
    });
    test("should have 'success' className when input is valid", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/birth date/i);
      fireEvent.focus(inputElement);
      fireEvent.change(inputElement, { target: { value: "01/02/1992" } });
      fireEvent.focusOut(inputElement);
      await waitFor(() => {
        const errorElement = screen.queryByTestId("birthDateError");
        expect(errorElement).toBe(null);
        expect(inputElement).toHaveClass("success");
      });
    });
    test("should have 'error' className when input is not valid", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/birth date/i);
      fireEvent.focus(inputElement);
      fireEvent.focusOut(inputElement);
      await waitFor(() => {
        const errorElement = screen.queryByTestId("birthDateError");
        expect(errorElement).not.toBe(null);
        expect(inputElement).toHaveClass("error");
      });
    });
    test("should not show error when input is empty and it was not focused after initial render", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/birth date/i);
      await waitFor(() => {
        const errorElement = screen.queryByTestId("birthDateError");
        expect(inputElement).toBeInTheDocument();
        expect(errorElement).toBe(null);
      });
    });
  });
  describe("gender Field", () => {
    test("should be able to check and uncheck every checkbox", async () => {
      render(<PersonForm />);
      const checkboxElements = screen.getAllByRole("checkbox");
      checkboxElements.forEach((element) => {
        expect(element.checked).toEqual(false);
        userEvent.click(element);
      });
      await waitFor(() => {
        checkboxElements.forEach((element) => {
          expect(element.checked).toEqual(true);
        });
      });
      checkboxElements.forEach((element) => {
        userEvent.click(element);
      });
      await waitFor(() => {
        checkboxElements.forEach((element) => {
          expect(element.checked).toEqual(false);
        });
      });
    });
  });
  describe("email Field", () => {
    test("should show error on input click when input is empty", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/email/i);
      userEvent.click(inputElement);
      await waitFor(() => {
        const errorElement = screen.getByTestId("emailError");
        expect(errorElement).not.toBe(null);
        expect(errorElement).toHaveTextContent("Required");
        expect(errorElement).toBeVisible();
      });
    });
    test("should show error on invalid email", async () => {
      jest.spyOn(mockAxios, "get").mockResolvedValue({
        data: {
          validation_status: false,
          status: 200,
        },
      });
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/email/i);
      userEvent.type(inputElement, "john");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("emailError");
        expect(errorElement).not.toBe(null);
        expect(errorElement).toHaveTextContent("Email not valid");
        expect(errorElement).toBeVisible();
      });
    });
    test("should not show error on valid email", async () => {
      jest.spyOn(mockAxios, "get").mockResolvedValue({
        data: {
          validation_status: true,
          status: 200,
        },
      });
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/email/i);
      userEvent.type(inputElement, "john@gmail.com");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("emailError");
        expect(errorElement).toBe(null);
      });
    });
    test("should have 'success' className when input is valid", async () => {
      jest.spyOn(mockAxios, "get").mockResolvedValue({
        data: {
          validation_status: true,
          status: 200,
        },
      });
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/email/i);
      userEvent.type(inputElement, "John@gmail.com");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("emailError");
        expect(errorElement).toBe(null);
        expect(inputElement).toHaveClass("success");
      });
    });
    test("should have 'error' className when input is not valid", async () => {
      jest.spyOn(mockAxios, "get").mockResolvedValue({
        data: {
          validation_status: false,
          status: 200,
        },
      });
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/email/i);
      userEvent.type(inputElement, "John");
      await waitFor(() => {
        const errorElement = screen.queryByTestId("emailError");
        expect(errorElement).not.toBe(null);
        expect(inputElement).toHaveClass("error");
      });
    });
    test("should not show error when input is empty and it was not focused after initial render", async () => {
      render(<PersonForm />);
      const inputElement = screen.getByLabelText(/email/i);
      await waitFor(() => {
        const errorElement = screen.queryByTestId("emailError");
        expect(inputElement).toBeInTheDocument();
        expect(errorElement).toBe(null);
      });
    });
  });
  describe("submit button", () => {
    test("should be disabled when no input value was changed after initial render", async () => {
      render(<PersonForm />);
      const submitButtonElement = screen.getByRole("button", {
        type: "submit",
      });
      expect(submitButtonElement).toBeDisabled();
    });
    test("should be enabled when input was changed and form is valid", async () => {
      render(<PersonForm />);
      jest.spyOn(mockAxios, "get").mockResolvedValue({
        data: {
          validation_status: true,
          status: 200,
        },
      });
      userEvent.type(screen.getByLabelText(/first name/i), "John");
      userEvent.type(screen.getByLabelText(/surname/i), "Smith");
      userEvent.type(screen.getByLabelText(/birth date/i), "01/02/2000");
      userEvent.type(screen.getByLabelText(/email/i), "John@gmail.com");

      await waitFor(() => {
        const submitButtonElement = screen.getByText("Submit");
        expect(submitButtonElement).toBeEnabled();
      });
    });
    test("should be disabled when input was changed and form is not valid", async () => {
      render(<PersonForm />);
      jest.spyOn(mockAxios, "get").mockResolvedValue({
        data: {
          validation_status: false,
          status: 200,
        },
      });
      userEvent.type(screen.getByLabelText(/first name/i), "Jo");
      userEvent.type(screen.getByLabelText(/surname/i), "Smith");
      userEvent.type(screen.getByLabelText(/birth date/i), "01/02/2000");
      userEvent.type(screen.getByLabelText(/email/i), "John@gmail.com");

      await waitFor(() => {
        const submitButtonElement = screen.getByText("Submit");
        expect(submitButtonElement).toBeDisabled();
      });
    });
  });
});
