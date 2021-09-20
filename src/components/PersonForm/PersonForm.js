import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./PersonForm.css";
import DateView from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../Loader/Loader";
const PersonForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [isEmailValid, setIsEmailValid] = useState(false);
  let cancelToken;
  const initialValues = {
    firstName: "",
    surname: "",
    birthDate: null,
    gender: "",
    email: "",
  };
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
    resetForm();
  };
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Required")
      .min(3, "First Name must have more than 2 characters"),
    surname: Yup.string().max(10, "Surname must have less than 11 characters"),
    birthDate: Yup.date().required("Required").nullable(),
    email: Yup.string()
      .required("Required")
      .test("Email valid", "Email not valid", async (value) => {
        let url = `/api/email-validator.php?email=${value}`;
        setLoading(true);
        if (value !== email) {
          setEmail(value);
          //Check if there are any previous pending requests
          if (typeof cancelToken !== typeof undefined) {
            cancelToken.cancel("Operation canceled due to new request.");
          }
          //Save the cancel token for the current request
          cancelToken = axios.CancelToken.source();
          try {
            const response = await axios
              .get(url, {
                cancelToken: cancelToken.token,
              })
              .catch((thrown) => {
                if (axios.isCancel(thrown)) {
                  console.log("Request canceled", thrown.message);
                } else {
                  return Promise.resolve(false);
                }
              });
            console.log(response);
            if (
              response.data.validation_status &&
              response.data.status === 200
            ) {
              setIsEmailValid(true);
              setLoading(false);
              return Promise.resolve(true);
            } else {
              setIsEmailValid(false);
              setLoading(false);
              return Promise.resolve(false);
            }
          } catch (error) {
            setIsEmailValid(false);
            setLoading(false);
            return Promise.resolve(false);
          }
        } else {
          setLoading(false);
          if (isEmailValid) {
            return Promise.resolve(true);
          } else {
            return Promise.resolve(false);
          }
        }
      }),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form className="Form">
          <label htmlFor="firstName">first name</label>
          <Field
            className={
              formik.errors.firstName && formik.touched.firstName
                ? "error"
                : !formik.errors.firstName && formik.touched.firstName
                ? "success"
                : ""
            }
            type="text"
            id="firstName"
            name="firstName"
            onClick={() => {
              formik.setFieldTouched("firstName", true);
            }}
          />
          <ErrorMessage
            name="firstName"
            className="error_msg"
            component="div"
            data-testid="firstNameError"
          />
          <label htmlFor="surname">surname (optional)</label>
          <Field
            className={
              formik.errors.surname && formik.touched.surname
                ? "error"
                : !formik.errors.surname && formik.touched.surname
                ? "success"
                : ""
            }
            type="text"
            id="surname"
            name="surname"
            onClick={() => {
              formik.setFieldTouched("surname", true);
            }}
          />
          <ErrorMessage
            name="surname"
            className="error_msg"
            component="div"
            data-testid="surnameError"
          />
          <div className="form-control">
            <label htmlFor="birthDate">birth date</label>
            <Field name="birthDate" id="birthDate" type="date">
              {({ form, field }) => {
                const { setFieldValue } = form;
                const { value } = field;
                return (
                  <DateView
                    id="birthDate"
                    {...field}
                    selected={value}
                    placeholderText="Click to select the date"
                    onChange={(val) => setFieldValue("birthDate", val)}
                    maxDate={new Date()}
                    className={
                      formik.errors.birthDate && formik.touched.birthDate
                        ? "error"
                        : !formik.errors.birthDate && formik.touched.birthDate
                        ? "success"
                        : ""
                    }
                  />
                );
              }}
            </Field>
            <ErrorMessage
              name="birthDate"
              className="error_msg"
              component="div"
              data-testid="birthDateError"
            />
          </div>
          <label htmlFor="gender">gender (optional)</label>
          <div id="gender" role="group" className="gender_checkbox_group">
            <label htmlFor="male">
              <Field type="checkbox" id="male" name="gender" value="male" />
              Male
            </label>
            <label htmlFor="female">
              <Field type="checkbox" id="female" name="gender" value="female" />
              Female
            </label>
            <label htmlFor="other">
              <Field type="checkbox" id="other" name="gender" value="other" />
              Other
            </label>
          </div>
          <label htmlFor="email">email</label>
          <Field
            className={
              formik.errors.email && formik.touched.email
                ? "error"
                : !formik.errors.email && formik.touched.email
                ? "success"
                : ""
            }
            type="text"
            id="email"
            name="email"
            onClick={() => {
              formik.setFieldTouched("email", true);
            }}
          />
          {loading && <Loader />}
          {!loading && (
            <ErrorMessage
              name="email"
              className="error_msg"
              component="div"
              data-testid="emailError"
            />
          )}
          <button
            type="submit"
            disabled={
              !(formik.dirty && formik.isValid) ||
              formik.isSubmitting ||
              loading
            }
          >
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};
export default PersonForm;
