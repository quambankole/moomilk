"use client";

import { useState } from "react";
import "./form.css";
import { db } from "../data/firebaseConfig"; 
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth } from "../data/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fetchSignInMethodsForEmail } from "firebase/auth";

export default function Form() {
const [formData, setFormData] = useState({
firstName: "",
lastName: "",
email: "",
day: "",
month: "",
year: "",
address: "",
city: "",
province: "",
postalCode: "",
password: "",
confirmPassword: "",
guardianName: "",
guardianEmail: "",
guardianPhone: "",
isUnder16: false,
consentRules: false,
consentCommunications: false,
});

const [formErrors, setFormErrors] = useState({});
const [showGuardianForm, setShowGuardianForm] = useState(false);
const [isPopupVisible, setIsPopupVisible] = useState(false);
const [isRulesPopupVisible, setIsRulesPopupVisible] = useState(false);
const router = useRouter();

const calculateAge = (year, month, day) => {
const dob = new Date(Number(year), Number(month) - 1, Number(day));
const today = new Date();
let age = today.getFullYear() - dob.getFullYear();
const monthDiff = today.getMonth() - dob.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
}
return age;
};

const handleCheckboxClick = () => {
setIsRulesPopupVisible(true);
};

const checkIfEmailExists = async (email) => {
    try {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        return methods.length > 0; 
    } catch (error) {
        console.error("Error checking email: ", error.message);
        return false;
    }
};

const handleHeaderClick = () => {
setIsPopupVisible(!isPopupVisible);
};

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
const newValue = type === "checkbox" ? checked : value;
const updatedFormData = {
    ...formData,
    [name]: newValue,
};

setFormData(updatedFormData);

if (["day", "month", "year"].includes(name)) {
    if (updatedFormData.day && updatedFormData.month && updatedFormData.year) {
    const age = calculateAge(updatedFormData.year, updatedFormData.month, updatedFormData.day);
    setShowGuardianForm(age < 16);
    }
}

if (name === "isUnder16") {
    setShowGuardianForm(checked);
}
};

const namePattern = /^[a-zA-Z\s]+$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const postalCodePattern = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
const phonePattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%#&**?&]{8,}$/; 
const mooPattern = /moo/i;

const validateForm = () => {
const errors = {};

if (!formData.firstName.trim()) {
    errors.firstName = "First name is required.";
} else if (!namePattern.test(formData.firstName)) {
    errors.firstName = "First name must contain only letters.";
}

if (mooPattern.test(formData.firstName)) {
    errors.firstName = "Moooooo!!"; 
    playMooSound(); 
}

if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required.";
} else if (!namePattern.test(formData.lastName)) {
    errors.lastName = "Last name must contain only letters.";
}

if (!formData.email.trim()) {
    errors.email = "Email address is required.";
} else if (!emailPattern.test(formData.email)) {
    errors.email = "Please enter a valid email address.";
}

if (!formData.day) {
    errors.day = "Day is required.";
} else if (formData.day < 1 || formData.day > 31) {
    errors.day = "Please enter a valid day (1-31).";
}

if (!formData.month) {
    errors.month = "Month is required.";
} else if (formData.month < 1 || formData.month > 12) {
    errors.month = "Please enter a valid month (1-12).";
}

if (!formData.year) {
    errors.year = "Year is required.";
} else if (formData.year < 1900 || formData.year > new Date().getFullYear()) {
    errors.year = "Please enter a valid year.";
}

if (!formData.address.trim()) {
    errors.address = "House address is required.";
}

if (!formData.city.trim()) {
    errors.city = "City is required.";
}

if (!formData.province.trim()) {
    errors.province = "Province is required.";
}

if (!formData.postalCode.trim()) {
    errors.postalCode = "Postal code is required.";
} else if (!postalCodePattern.test(formData.postalCode)) {
    errors.postalCode = "Please enter a valid postal code.";
}

if (!formData.password.trim()) {
    errors.password = "Password is required.";
} else if (!passwordPattern.test(formData.password)) {
    errors.password = "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.";
}

if (!formData.confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your password.";
} else if (formData.confirmPassword !== formData.password) {
    errors.confirmPassword = "Passwords do not match.";
}

if (showGuardianForm) {
    if (!formData.guardianName.trim()) {
    errors.guardianName = "Guardian name is required.";
    } else if (!namePattern.test(formData.guardianName)) {
    errors.guardianName = "Guardian's name must contain only letters.";
    }

    if (!formData.guardianEmail.trim()) {
    errors.guardianEmail = "Guardian email is required.";
    } else if (!emailPattern.test(formData.guardianEmail)) {
    errors.guardianEmail = "Please enter a valid email address.";
    }

    if (!formData.guardianPhone.trim()) {
    errors.guardianPhone = "Guardian phone number is required.";
    } else if (!phonePattern.test(formData.guardianPhone)) {
    errors.guardianPhone = "Please enter a valid phone number.";
    }
}

if (!formData.consentRules) {
    errors.consentRules = "You must agree to the rules.";
}

return errors;
};

const playMooSound = () => {
    const mooAudio = new Audio('/moo.mp3'); 
    mooAudio.play();
};

const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
        console.log("Form has errors. Please correct them.");
        return;
    }

    try {
        const emailExists = await fetchSignInMethodsForEmail(auth, formData.email);
        if (emailExists.length > 0) {
            setFormErrors({ email: "This email is already registered. Please log in instead." });
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await addDoc(collection(db, "submissions"), { ...formData, userId: user.uid });

        console.log("Form Submitted, Document ID: ", user.uid);
        router.push("/form/thankyou");

    } catch (error) {

        if (error.code === "auth/email-already-in-use") {
            setFormErrors({ email: "This email is already registered. Please log in instead." });
        } else {
            setFormErrors({ general: "An error occurred. Please try again." });
        }
    }
};




return (


    <div className="form-wrapper">

        <div className="form-wrapper2">

            <div className="formHeader">
            <div className="formHeaderLeft">
                <h1>PARTICIPATION INSTRUCTIONS</h1>
            </div>
            <div className="formHeaderRight">
                <button className="formBtn" onClick={handleHeaderClick}>
                Read Instructions
                </button>
            </div>
            </div>

            {isPopupVisible && (
            <div className="popup">
                <div className="popupContent">
                <h2>How to Participate</h2>
                <hr className="hr"></hr>
                <ol>
                    <li>
                    <b>Fill out the form:</b> Enter your name, email, birthdate, and address.
                    </li>
                    <li>
                    <b>Upload your photo:</b> Take a fun photo with milk or milk products in the photobooth. Add stickers and filters!
                    </li>
                    <li>
                    <b>Submit your entry:</b> Complete the form, answer the skill-testing question, and submit.
                    </li>
                    <li>
                    <b>Win & Be Featured:</b> Every week, a winner will be chosen, and their photo will be featured as "Winning Image of the Week."
                    </li>
                    <li>
                    <b>Agree to the rules:</b> Make sure you read and agree to the rules before entering. If you're under 16, have a guardian’s consent.
                    </li>
                </ol>
                <div className="submitButton">
                    <button onClick={() => setIsPopupVisible(false)} className="closeBtn">
                    Back
                    </button>
                </div>
                </div>
            </div>
            )}


            {showGuardianForm ? (
            <div className="formContainer form2">
                <div className="formGroup">
                <div className="inputGroup2">
                <label>Guardian Name:</label>
                <input
                    type="text"
                    name="guardianName"
                    placeholder="Enter guardian's full name"
                    value={formData.guardianName}
                    onChange={handleChange}
                    className={`formInput ${formErrors.guardianName ? 'inputError' : ''}`}
                />
                {formErrors.guardianName && <span className="error">{formErrors.guardianName}</span>}
                </div>
                </div>
                <div className="formGroup">
                <div className="inputGroup2">
                <label>Guardian Email:</label>
                <input
                    type="email"
                    name="guardianEmail"
                    placeholder="Enter guardian's address"
                    value={formData.guardianEmail}
                    onChange={handleChange}
                    className={`formInput ${formErrors.guardianEmail ? 'inputError' : ''}`}
                />
                {formErrors.guardianEmail && <span className="error">{formErrors.guardianEmail}</span>}
                </div>
                </div>
                <div className="formGroup">
                <div className="inputGroup2">
                <label>Guardian Phone Number:</label>
                <input
                    type="tel"
                    name="guardianPhone"
                    placeholder="Enter guardian's number"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className={`formInput ${formErrors.guardianPhone ? 'inputError' : ''}`}
                />
                {formErrors.guardianPhone && <span className="error">{formErrors.guardianPhone}</span>}
                </div>
                </div>

                <div className="checkboxGroup">
                <label>
                    <input
                    type="checkbox"
                    name="consentRules"
                    checked={formData.consentRules}
                    onChange={handleChange}
                    className="formCheckbox"
                    />
                    I agree to the contest rules and regulations.
                </label>
                {formErrors.consentRules && <span className="error">{formErrors.consentRules}</span>}
                </div>
                <div className="checkboxGroup">
                <label>
                    <input
                    type="checkbox"
                    name="consentCommunications"
                    checked={formData.consentCommunications}
                    onChange={handleChange}
                    className="formCheckbox"
                    />
                    I consent to receiving communications about milk products and sponsors.
                </label>
                </div>

                <div className="guardianButton">
                <button type="button" onClick={() => setShowGuardianForm(false)} className="guardianSubmit">
                    BACK
                </button>
                <button type="submit" onClick={handleSubmit} className="guardianSubmit">
                    SUBMIT
                </button>
                </div>
            </div>
            ) : (
            <form onSubmit={handleSubmit} className="formContainer">
                <div className="formGroup">
                <div className="nameGroup">
                <div className="inputGroup">
                    <label htmlFor="firstName">First Name</label>
                    <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`formInput ${formErrors.firstName ? 'inputError' : ''}`}
                    />
                    {formErrors.firstName && <span className="error">{formErrors.firstName}</span>}
                </div>
                <div className="inputGroup">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                    type="text"
                    id="lastName"
                    placeholder="Enter your last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`formInput ${formErrors.lastName ? 'inputError' : ''}`}
                    />
                    {formErrors.lastName && <span className="error">{formErrors.lastName}</span>}
                </div>
                </div>
                </div>

                <div className="formGroup">
                <div className="inputGroup2">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`formInput ${formErrors.email ? 'inputError' : ''}`}
                />
                {formErrors.email && <span className="error">{formErrors.email}</span>}
                </div>
                </div>

                <div className="formGroup dateRow">
                <div className="inputGroup">
                <label htmlFor="day">Day</label>
                <select
                    id="day"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    className={`formInput ${formErrors.day ? 'inputError' : ''}`}
                >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1}
                    </option>
                    ))}
                </select>
                {formErrors.day && <span className="error">{formErrors.day}</span>}
                </div>

                <div className="inputGroup">
                <label htmlFor="month">Month</label>
                <select
                    id="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className={`formInput ${formErrors.month ? 'inputError' : ''}`}
                >
                    <option value="">Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                {formErrors.month && <span className="error">{formErrors.month}</span>}
                </div>

                <div className="inputGroup">
                <label htmlFor="year">Year</label>
                <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={`formInput ${formErrors.year ? 'inputError' : ''}`}
                >
                    <option value="">Year</option>
                    {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => {
                    const yr = 1900 + i;
                    return (
                        <option key={yr} value={yr}>
                        {yr}
                        </option>
                    );
                    })}
                </select>
                {formErrors.year && <span className="error">{formErrors.year}</span>}
                </div>
            </div>

                <div className="formGroup">
                <div className="inputGroup2">
                <label>House Address</label>
                <input
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`formInput ${formErrors.address ? 'inputError' : ''}`}
                />
                {formErrors.address && <span className="error">{formErrors.address}</span>}
                </div>
                </div>

                <div className="formGroup addressRow">
                <div className="inputGroup">
                    <label>City</label>
                    <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`formInput ${formErrors.city ? "inputError" : ""}`}
                    >
                    <option value="">Select City</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Ottawa">Ottawa</option>
                    <option value="Montreal">Montreal</option>
                    <option value="Vancouver">Vancouver</option>
                    <option value="Calgary">Calgary</option>
                    </select>
                    {formErrors.city && <span className="error">{formErrors.city}</span>}
                </div>
                <div className="inputGroup">
                    <label>Province</label>
                    <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className={`formInput ${formErrors.province ? "inputError" : ""}`}
                    >
                    <option value="">Select Province</option>
                    <option value="Ontario">Ontario</option>
                    <option value="Quebec">Quebec</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Alberta">Alberta</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="New Brunswick">New Brunswick</option>
                    <option value="Prince Edward Island">Prince Edward Island</option>
                    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                    </select>
                    {formErrors.province && <span className="error">{formErrors.province}</span>}
                </div>
                <div className="inputGroup">
                    <label>Postal</label>
                    <input
                    type="text"
                    name="postalCode"
                    placeholder="Enter your postal code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`formInput ${formErrors.postalCode ? 'inputError' : ''}`}
                    />
                    {formErrors.postalCode && <span className="error">{formErrors.postalCode}</span>}
                </div>
                </div>

                <div className="formGroup">
                <div className="inputGroup2">
                <label htmlFor="password">Password</label>
                <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`formInput ${formErrors.password ? 'inputError' : ''}`}
                placeholder="Enter your password"
                />
                {formErrors.password && <span className="error">{formErrors.password}</span>}
            </div>
            </div>

            <div className="formGroup">
            <div className="inputGroup2">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`formInput ${formErrors.confirmPassword ? 'inputError' : ''}`}
                placeholder="Re-enter your password"
                />
                {formErrors.confirmPassword && <span className="error">{formErrors.confirmPassword}</span>}
            </div>
            </div>

                <div className="checkboxGroup">
                <label>
                    <input
                    type="checkbox"
                    name="isUnder16"
                    checked={formData.isUnder16}
                    onChange={handleChange}
                    className="formCheckbox"
                    />
                    Check this box if you're below 16 years old.
                </label>
                </div>
                <div className="checkboxGroup">
                <label>
                    <input
                    type="checkbox"
                    name="consentRules"
                    checked={formData.consentRules}
                    onChange={handleChange}
                    className="formCheckbox"
                    />
                    <span className="clickToRead" onClick={handleCheckboxClick}>
                    Click to read.
                    </span>{" "}
                    I agree to the contest rules and regulations.
                </label>
                {formErrors.consentRules && <span className="error">{formErrors.consentRules}</span>}

                {isRulesPopupVisible && (
                    <div className="popup">
                    <div className="popupContent">
                        <h2>Contest Rules & Terms</h2>
                        <hr className="hr"></hr>
                        <ol>
                        <li>
                            <b>Eligibility:</b> Open to Canadian residents aged 16+. Under 16 requires guardian consent.
                        </li>
                        <li>
                            <b>Photo Use:</b> By entering, you allow us to use your photo in marketing materials.
                        </li>
                        <li>
                            <b>Prizes:</b> Winners are drawn randomly, must answer a skill-testing question, and prizes are non-transferable.
                        </li>
                        <li>
                            <b>Data Use:</b> Your personal info will be used only for contest purposes. You can opt out anytime.
                        </li>
                        <li>
                            <b>Communications:</b> By entering, you agree to receive updates about milk products and promotions.
                        </li>
                        <li>
                            <b>Contest Changes:</b> We reserve the right to modify or cancel the contest at any time.
                        </li>
                        </ol>
                        <div className="submitButton">
                        <button
                            onClick={() => {
                            setIsRulesPopupVisible(false);
                            }}
                            className="closeBtn"
                        >
                            Agreed
                        </button>
                        </div>
                    </div>
                    </div>
                )}
                </div>

                <div className="checkboxGroup">
                <label>
                    <input
                    type="checkbox"
                    name="consentCommunications"
                    checked={formData.consentCommunications}
                    onChange={handleChange}
                    className="formCheckbox"
                    />
                    I consent to receiving communications regarding milk products and sponsors.
                </label>
                </div>

                <div className="submitButton">
                <button type="submit" className="formSubmit">
                    SUBMIT
                </button>
                </div>
            </form>
            )}
        </div>
    </div>
);
}
