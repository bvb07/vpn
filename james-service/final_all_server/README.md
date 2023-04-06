Feature

- Login to redirect completed successfully

- authcontext navbar Navlink css button complete

- getdata role user getuser role admin role else complete

- Role permision complete

- firebase login complete

- protect api gen revoke complete

- session cookie complete

   // jwt: async ({
    //   token,
    //   account,
    //   user,
    // }: {
    //   token: any;
    //   account?: any;
    //   user: any;
    // }) => {
    //   if (account) {
    //     try {
    //       token.accessToken = account.access_token;
    //       const foundUser = getConnection()
    //         .get("tasks")
    //         .find({ email: user?.email })
    //         .value();
    //       if (foundUser) {
    //         token.role = foundUser.role;
    //         token.uid = foundUser.uid;
    //         token.photo = foundUser.photo;
    //       } else {
    //         if (account.provider === "google") {
    //           return token;
    //         } else {
    //           const check = false;
    //           return check;
    //         }
    //       }
    //     } catch (err) {
    //       if (account.provider === "google") {
    //         return token;
    //       } else {
    //         return { message: "You are not registered" };
    //       }
    //     }
    //   }
    //   return token;
    // },
