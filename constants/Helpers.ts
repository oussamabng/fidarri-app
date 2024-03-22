export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  // Regular expression to match phone numbers in the given formats
  const phoneNumberRegex = /^\+\d{11}$/;

  return phoneNumberRegex.test(phoneNumber);
}

export function isOver18YearsOld(dateOfBirth: string): boolean {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  // Calculate the age difference in years
  const ageDifferenceInMilliseconds = today.getTime() - dob.getTime();
  const ageDifferenceInYears =
    ageDifferenceInMilliseconds / (365 * 24 * 60 * 60 * 1000);

  return ageDifferenceInYears >= 18;
}
