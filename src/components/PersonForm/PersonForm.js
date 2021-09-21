import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./PersonForm.css";
import DateView from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../Loader/Loader";
const PersonForm = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const axiosSource = useRef(null);
  const newCancelToken = () => {
    axiosSource.current = axios.CancelToken.source();
    return axiosSource.current.token;
  };
  const initialValues = {
    firstName: "",
    surname: "",
    birthDate: null,
    gender: "",
    email: "",
  };
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    if (!emailError) {
      values.email = email;
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
      resetForm();
      setEmail("");
      setEmailError("");
    }
  };
  const handleEmailValidation = async (value) => {
    if (!value) {
      setEmailError("Required");
    } else {
      let url = `/api/email-validator.php?email=${value}`;
      setLoading(true);
      //Check if there are any previous pending requests
      if (axiosSource.current) {
        axiosSource.current.cancel("Operation canceled due to new request.");
      }
      try {
        //Save the cancel token for the current request
        const response = await axios.get(url, {
          cancelToken: newCancelToken(),
        });
        if (response.data.validation_status && response.data.status === 200) {
          setLoading(false);
          setEmailError("");
        } else {
          setLoading(false);
          setEmailError("Email not valid");
        }
      } catch (e) {
        if (axios.isCancel(e)) {
        } else {
          console.log(e);
          setLoading(false);
          setEmailError("Email not valid");
        }
      }
    }
  };
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Required")
      .min(3, "First Name must have more than 2 characters"),
    surname: Yup.string().max(10, "Surname must have less than 11 characters"),
    birthDate: Yup.date().required("Required").nullable(),
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
          <input
            className={
              emailError && formik.touched.email
                ? "error"
                : !emailError && formik.touched.email
                ? "success"
                : ""
            }
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              handleEmailValidation(e.target.value);
            }}
            onClick={(e) => {
              if (!e.target.value) {
                setEmailError("Required");
              }
              formik.setFieldTouched("email", true);
            }}
          />
          {loading && <Loader />}
          {!loading && emailError && (
            <div name="email" className="error_msg" data-testid="emailError">
              {emailError}
            </div>
          )}
          <button
            type="submit"
            disabled={
              !(formik.dirty && formik.isValid) ||
              formik.isSubmitting ||
              loading ||
              emailError ||
              !email
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
