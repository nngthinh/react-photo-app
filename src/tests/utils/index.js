// Promise with settimeout
const delayPromise = (callback, time = 500) =>
  Promise((resolve, reject) =>
    setTimeout(() => callback(resolve, reject), time)
  );

// Server response
const resolveWithData = (resolve, data = {}) => resolve({ data });
const rejectWithMessage = (reject, message = "") => reject({ message });
const rejectWithData = (reject, data = {}) => reject({ data });

// Common errors
const wrongUrlError =
  "The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.";
// (resolve, reject) => {
//   const { pathname } = parseUrl(url);
//   if (pathname === "/users/me") {
//     if (config.headers?.Authorization) {
//       try {
//         const token = config.headers.Authorization.split(" ")[1];
//         if (token in userDatabase.accessToken) {
//           const email = userDatabase.accessToken[token];
//           const { name, id } = userDatabase.info[email];
//           return resolve({ data: { name, id } });
//         }
//       } catch (error) {
//         return reject({ message: "Invalid access token" });
//       }
//     }
//     return reject({ message: "Missing access token" });
//   } else {
//     return reject(wrongUrlError);
//   }
// }

export {
  delayPromise,
  resolveWithData,
  rejectWithData,
  rejectWithMessage,
  wrongUrlError,
};
