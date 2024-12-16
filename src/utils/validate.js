export const checkValidData = (email, password) => {
  const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
    email
  );
  const isPasswordValid =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);

  if (!email || !password) return "Please fill all the fields";

  if (!isEmailValid) return "Email Id is not valid";
  if (!isPasswordValid)
    return "Password is not valid! It should contain one uppercase, one lowercase, one number and one special character and should be at least 8 characters long";

  return null;
};
