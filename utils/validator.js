exports.capitalize = (val = "") => {
  if (typeof val !== "string") {
    return { error: "Please insert a string value" };
  }

  let str = val.toLowerCase().split(" ");

  if (str.length > 2) {
    return { error: "Please insert two names only (firstname and lastname)" };
  }

  let firstWord = str[0];
  let secondWord = str[1];

  firstWord = firstWord[0].toUpperCase + firstWord.slice(1);
  secondWord = secondWord[0].toUpperCase + secondWord.slice(1);

  return firstWord + " " + secondWord;
};
